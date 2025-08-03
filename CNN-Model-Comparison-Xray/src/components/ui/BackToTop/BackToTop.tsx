import React, { useState, useEffect } from 'react';
import styles from './BackToTop.module.css';

interface BackToTopProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function BackToTop({ scrollContainerRef }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (scrollContainerRef.current && scrollContainerRef.current.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', toggleVisibility);
      
      // Cleanup function
      return () => {
        container.removeEventListener('scroll', toggleVisibility);
      };
    }
  }, [scrollContainerRef]);

  return (
    <div 
      title={'Back to Top'} 
      className={`${styles['back-to-top']} ${isVisible ? styles.visible : ''}`} 
      onClick={scrollToTop}
    >
      <WeuiBack2Filled />
    </div>
  );
}

export function WeuiBack2Filled(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="#fff"
        fillRule="evenodd"
        d="m12 11.325l2.375 2.375q.275.275.688.275t.712-.275q.3-.3.3-.712t-.3-.713L12.7 9.2q-.3-.3-.7-.3t-.7.3l-3.1 3.1q-.3.3-.287.7t.312.7q.3.275.7.288t.7-.288zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
      />
    </svg>
  );
}

export default BackToTop;