import React, { useRef, useEffect } from 'react';
import styles from './CursorRipple.module.css';

interface CursorRippleProps {
  isActive: boolean;
}

const CursorRipple: React.FC<CursorRippleProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  useEffect(() => {
    // Nếu không active, dừng mọi hoạt động
    if (!isActive) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ripples: Ripple[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseClick = (e: MouseEvent) => {
      if (isActiveRef.current) {
        ripples.push(new Ripple(e.clientX, e.clientY));
      }
    };

    class Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      speed: number;
      lineWidth: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.maxRadius = 60;
        this.speed = 1.8;
        this.lineWidth = 3;
      }

      update() {
        this.radius += this.speed;
        if (this.lineWidth > 0.2) this.lineWidth -= 0.05;
      }

      draw() {
        if (!ctx || this.radius >= this.maxRadius) return;
        const opacity = 1 - this.radius / this.maxRadius;
        ctx.strokeStyle = `rgba(220, 235, 255, ${opacity > 0 ? opacity : 0})`;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const animate = () => {
      if (!isActiveRef.current) {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw();
        if (ripples[i].radius >= ripples[i].maxRadius) {
          ripples.splice(i, 1);
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('click', handleMouseClick);
    resizeCanvas();
    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('click', handleMouseClick);
    };
  }, [isActive]);

  return <canvas ref={canvasRef} className={styles.rippleCanvas} />;
};

export default CursorRipple;
