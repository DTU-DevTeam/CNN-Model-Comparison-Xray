import type { SVGProps } from 'react';

export function MouseScrollIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.4}>
        {/* Con lăn chuột với animation */}
        <path 
          d="M12 11.25a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 1 1 3 0v3a1.5 1.5 0 0 1-1.5 1.5"
          style={{
            animation: 'wheelScroll 1.5s infinite ease-in-out',
            transformOrigin: 'center'
          }}
        />
        {/* Khung chuột */}
        <path d="M19.5 8.25a7.5 7.5 0 0 0-15 0v7.5a7.5 7.5 0 0 0 15 0z" />
      </g>
    </svg>
  );
}