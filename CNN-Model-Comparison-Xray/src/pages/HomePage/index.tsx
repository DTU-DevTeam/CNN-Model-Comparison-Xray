import React from 'react';
import styles from './HomePage.module.css';
import Logo from '../../assets/xraimain.svg'

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Navigation Header */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.navLeft}>
            <div className={styles.logo}>
              <a href="" target="_blank" rel="noopener noreferrer">
                <img src={Logo} alt="XRAI Logo" className={styles.logoImage} />
              </a>
            </div>
            <div className={styles.navLinks}>
              <a href="" className={styles.navLink}>
                Home
              </a>
              <a href="#about-us" className={styles.navLink}>
                About us
              </a>
              <a href="#contact" className={styles.navLink}>
                Contact
              </a>
            </div>
          </div>
          <div className={styles.navRight}>
            <button className={styles.getStartedBtn}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Left Section */}
          <div className={styles.leftSection}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                AI-Powered Radiology:
              </h1>
              <h1 className={styles.heroTitle}>
                A Comparative Study.
              </h1>
              <p className={styles.heroSubtitle}>
                A research prototype comparing the speed of YOLOv8 for detection and the precision of U-Net for segmentation in medical imaging.
              </p>
            </div>
            
            {/* X-ray Thumbnails */}
            <div className={styles.xrayThumbnails}>
              <div className={styles.thumbnail}>
                <div className={styles.thumbnailImage}>
                  <i className="fas fa-bone"></i>
                </div>
              </div>
              <div className={styles.thumbnail}>
                <div className={styles.thumbnailImage}>
                  <i className="fas fa-bone"></i>
                </div>
              </div>
              <div className={styles.thumbnail}>
                <div className={styles.thumbnailImage}>
                  <i className="fas fa-bone"></i>
                </div>
              </div>
            </div>
            
            <button className={styles.scrollDownBtn}>
              <i className="fas fa-chevron-down"></i>
            </button>
          </div>

          {/* Center X-ray Display */}
          <div className={styles.centerSection}>
            <div className={styles.xrayDisplay}>
              <div className={styles.xrayHeader}>
                <div className={styles.xrayInfo}>
                  <span className={styles.xrayType}>XR ELBOW</span>
                  <span className={styles.diagnosis}>Radial head fracture</span>
                </div>
                <div className={styles.xrayTools}>
                  <button className={styles.toolBtn}>
                    <i className="fas fa-ruler"></i>
                  </button>
                  <button className={styles.toolBtn}>
                    <i className="fas fa-search"></i>
                  </button>
                  <button className={styles.toolBtn}>
                    <i className="fas fa-circle"></i>
                  </button>
                  <button className={styles.toolBtn}>
                    <i className="fas fa-arrows-alt"></i>
                  </button>
                </div>
              </div>
              
              <div className={styles.xrayImage}>
                <div className={styles.xrayPlaceholder}>
                  <i className="fas fa-x-ray"></i>
                  <span>Elbow X-Ray Analysis</span>
                </div>
              </div>
              
              <div className={styles.xrayContext}>
                <div className={styles.contextBox}>
                  <span>This is a 28-year-old skateboarder.</span>
                  <div className={styles.contextIndicator}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Statistics */}
          <div className={styles.rightSection}>
            <div className={styles.statsContent}>
              <div className={styles.statNumber}>4M+</div>
              <div className={styles.statLabel}>Cases mined</div>
              <button className={styles.discoverBtn}>Discover more</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
