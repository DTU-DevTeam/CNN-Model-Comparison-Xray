import React from 'react';
import styles from './Button.module.css';

interface SocialButtonProps {
  iconClass: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'github' | 'linkedin' | 'instagram';
}

const SocialButton: React.FC<SocialButtonProps> = ({ iconClass, children, onClick, variant }) => (
  <button className={styles.socialButton} onClick={onClick}>
    <i className={`${iconClass} ${variant ? styles[variant + 'Color'] : ''}`}></i>
    <span className={variant ? styles[variant + 'Color'] : ''}>{children}</span>
  </button>
);

export default SocialButton;
