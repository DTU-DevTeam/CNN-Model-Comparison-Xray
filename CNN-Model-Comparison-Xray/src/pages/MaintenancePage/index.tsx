import React from 'react';
import styles from './MaintenancePage.module.css';
import { useNavigate } from 'react-router-dom';

const MaintenanceIcon = () => (
  <div className={styles.iconContainer}>
    <svg className={styles.gear} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20v-4" />
      <path d="M12 4V2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.93 19.07 1.41-1.41" />
      <path d="m17.66 6.34 1.41-1.41" />
      <circle cx="12" cy="12" r="4" />
    </svg>
     <svg className={`${styles.gear} ${styles.gearInner}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20v-4" />
      <path d="M12 4V2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.93 19.07 1.41-1.41" />
      <path d="m17.66 6.34 1.41-1.41" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  </div>
);

const MaintenancePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.stars}></div>
      <div className={styles.twinkling}></div>
      <div className={styles.contentBox}>
        <MaintenanceIcon />
        <h1 className={styles.title}>System is under maintenance</h1>
        <p className={styles.message}>
          We are performing some upgrades to improve your experience.
          The system will soon be back online. <br />
          Thank you for your patience!
        </p>
        <button onClick={handleGoHome} className={styles.homeButton}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default MaintenancePage;
