import React from 'react';
import styles from './Footer.module.css';
import Logo from '../../../assets/xraimain.svg';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        
        {/* Column 1: Logo and Description and Social Media */}
        <div className={styles.footerColumn}>
          <div className={styles.footerLogo}>
            <img src={Logo} alt="XRAI Logo" />
          </div>
          <p className={styles.footerDescription}>
            “We’re not just building software — we’re building the future of healthcare, hand in hand with the people who save lives every day.”
            <br /> — Dr. Emily Tran, Co-Founder & CEO of MedNova Health
          </p>
          <div className={styles.followUsRow}>
            <h3 className={styles.footerTitle1}>Follow Us:</h3>
            <div className={styles.socialIcons}>
              <a href="https://github.com/DTU-DevTeam/CNN-Model-Comparison-Xray" target="_blank" rel="noopener noreferrer" className={`fab fa-github ${styles.githubIcon}`}></a>
              <a href="https://www.linkedin.com/in/tuan-leminh-tech/" target="_blank" rel="noopener noreferrer" className={`fab fa-linkedin ${styles.linkedinIcon}`}></a>
              <a href="https://www.instagram.com/le.mingtuann_17/" target="_blank" rel="noopener noreferrer" className={`fab fa-instagram ${styles.instagramIcon}`}></a>
            </div>
          </div>
        </div>

        {/* Column 2: Helpful Links */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerTitle2}>Helpful Links</h3>
          <ul className={styles.footerLinks}>
            <li><a href="/about">About Project</a></li>
            <li><a href="/team">R&D Team</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/analysis" className={styles.footerStartAnalysis}>Start Analysis</a></li>
          </ul>
        </div>

        {/* Column 3: AI models */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerTitle3}>CNN AI Models</h3>
          <div className={styles.aiModels}>
            <img src="/src/assets/YOLOv8.svg" alt="YOLOv8" />
            <img src="/src/assets/UNet.svg" alt="U-Net" />
          </div>
        </div>

        {/* Column 4: Our Achievements */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerTitle4}>Our Achievements</h3>
          <div className={styles.achievementImages}>
            <img src="/src/assets/achieves1.jpg" alt="Service Award Steve Fredrickson" />
            <img src="/src/assets/achieves2.jpeg" alt="Award of Excellence" />
            <img src="/src/assets/achieves3.jpg" alt="Caduceus Award" />
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} SAMSUNG INNOVATION CAMPUS 2025, AI Pioneers. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;