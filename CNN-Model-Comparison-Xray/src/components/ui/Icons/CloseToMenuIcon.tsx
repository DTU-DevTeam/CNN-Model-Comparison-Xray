import React from 'react';
import type { SVGProps } from 'react';

export function CloseToMenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={24} 
      height={24} 
      viewBox="0 0 24 24" 
      {...props}
    >
      <g 
        fill="none" 
        stroke="currentColor" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2}
      >
        <path d="M5 5L19 19M5 19L19 5">
          <animate 
            fill="freeze" 
            attributeName="d" 
            dur="0.4s" 
            values="M5 5L19 19M5 19L19 5;M5 5L19 5M5 19L19 19"
          />
        </path>
        <path d="M12 12H12" opacity={0}>
          <animate 
            fill="freeze" 
            attributeName="d" 
            begin="0.2s" 
            dur="0.4s" 
            values="M12 12H12;M5 12H19"
          />
          <set 
            fill="freeze" 
            attributeName="opacity" 
            begin="0.2s" 
            to={1}
          />
        </path>
      </g>
    </svg>
  );
}