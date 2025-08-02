import React, { useRef, useEffect } from 'react';
import styles from './ParticleCursor.module.css';

// Thêm interface cho props để nhận trạng thái active
interface ParticleCursorProps {
  isActive: boolean;
}

const ParticleCursor: React.FC<ParticleCursorProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 }); // Bắt đầu ở ngoài màn hình
  // Fix: Khởi tạo useRef với giá trị ban đầu là null để tránh lỗi TypeScript.
  const animationFrameId = useRef<number | null>(null);
  const isMouseMoving = useRef(false);
  const mouseMoveTimeoutId = useRef<number | null>(null);

  // Dùng ref để truy cập giá trị isActive mới nhất trong animation loop
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  useEffect(() => {
    // Yêu cầu 2: Nếu không active, dừng mọi thứ và xóa canvas
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

    const particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Yêu cầu 1 & 3: Xử lý di chuyển chuột và rời khỏi trình duyệt
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      isMouseMoving.current = true;
      // Fix: Kiểm tra trước khi xóa timeout
      if (mouseMoveTimeoutId.current) {
        clearTimeout(mouseMoveTimeoutId.current);
      }
      // Dừng tạo hạt sau 150ms chuột không di chuyển
      mouseMoveTimeoutId.current = window.setTimeout(() => {
        isMouseMoving.current = false;
      }, 150);
    };

    const handleMouseLeave = () => {
      isMouseMoving.current = false; // Dừng tạo hạt khi chuột ra ngoài
    };

    // Yêu cầu 4: Class cho hiệu ứng "Soft Particle"
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      maxLife: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 7 + 3; // Hạt to và mềm mại hơn
        this.speedX = Math.random() * 2 - 1; // Di chuyển chậm
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsl(190, 100%, 90%)`; // Màu xanh nhạt, mềm mại
        this.life = 0;
        this.maxLife = 80 + Math.random() * 50;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1; // Nhỏ dần theo thời gian
        this.life++;
      }

      draw() {
        if (!ctx || this.size <= 0.2) return;
        const opacity = 1 - (this.life / this.maxLife); // Mờ dần đi
        ctx.fillStyle = this.color;
        ctx.globalAlpha = opacity > 0 ? opacity : 0;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animate = () => {
      // Yêu cầu 2: Dừng vòng lặp nếu không còn active
      if (!isActiveRef.current) {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1; // Reset lại độ mờ

      // Yêu cầu 1: Chỉ tạo hạt khi chuột đang di chuyển
      if (isMouseMoving.current) {
        particles.push(new Particle(mouse.current.x, mouse.current.y));
      }

      // Cập nhật và vẽ các hạt
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life >= particles[i].maxLife || particles[i].size <= 0.2) {
          particles.splice(i, 1);
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Gắn các event listener
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    resizeCanvas();
    animate();

    // Dọn dẹp khi component unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (mouseMoveTimeoutId.current) {
        clearTimeout(mouseMoveTimeoutId.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isActive]); // Chạy lại effect khi prop `isActive` thay đổi

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
};

export default ParticleCursor;
