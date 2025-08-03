import React, { useState, useEffect } from 'react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div title={'Back2Top'} className={`back-to-top ${isVisible ? 'visible' : ''}`} onClick={scrollToTop}>
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
        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m1.999-6.563L10.68 12L14 8.562L12.953 7.5L9.29 11.277a1.045 1.045 0 0 0 0 1.446l3.663 3.777z"
      />
    </svg>
  );
}

export default BackToTop;