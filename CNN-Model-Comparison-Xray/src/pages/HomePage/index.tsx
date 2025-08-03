import React, { useRef, useState } from 'react';
import styles from './HomePage.module.css';
import Header from '../../components/layout/Header';
import { MouseScrollIcon } from '../../components/ui/Icons';
import MainVideo from '../../assets/FuturisticXRay.mp4';
import SubVideo from '../../assets/FuturisticXRay_mini.mp4';

const HomePage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Section refs
  const aboutRef = useRef<HTMLDivElement>(null);
  const rdTeamRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: 'about' | 'rdteam' | 'contact') => {
    if (section === 'about' && aboutRef.current) aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    if (section === 'rdteam' && rdTeamRef.current) rdTeamRef.current.scrollIntoView({ behavior: 'smooth' });
    if (section === 'contact' && contactRef.current) contactRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Header Component */}
      <Header
        onScrollToAbout={() => scrollToSection('about')}
        onScrollToRDTeam={() => scrollToSection('rdteam')}
        onScrollToContact={() => scrollToSection('contact')}
        isHomePage={true}
        scrollContainerRef={containerRef}
      />

      {/* Main Content - Video Full Height */}
      <div className={styles.videoContainer}>
        <video autoPlay muted loop className={styles.videoStyles}>
          <source src={MainVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <MouseScrollIcon className={styles.mouseIcon} />
        </div>
        {/* Floating Learn more Button và Our contact Button ở góc trái, Floating Video ở góc phải */}
        <div className={styles.floatingButtons}>
          <button className={styles.learnMoreButton}>
            Learn more
          </button>
          <div className={styles.ourContactButton}>
            <span>Our contact:</span>
            <div className={styles.socialIcons}>
              <a href="https://www.github.com/DTU-DevTeam/" target="_blank" rel="noopener noreferrer" className={`fab fa-github ${styles.githubIcon}`}></a>
              <a href="https://www.linkedin.com/in/tuan-leminh-tech/" target="_blank" rel="noopener noreferrer" className={`fab fa-linkedin ${styles.linkedinIcon}`}></a>
              <a href="https://www.instagram.com/le.mingtuann_17/" target="_blank" rel="noopener noreferrer" className={`fab fa-instagram ${styles.instagramIcon}`}></a>
            </div>
          </div>
        </div>
        <div className={styles.floatingVideoContainer} onClick={toggleVideo}>
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            loop 
            className={styles.floatingVideo}
          >
            <source src={SubVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Play/Pause Button Overlay */}
          <div className={styles.playButtonOverlay}>
            <div className={styles.playButton}>
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About Project Section */}
      <div ref={aboutRef} style={{ padding: 32, background: '#f7f7fa' }}>
        <h1>About the Project</h1>
        <p>This project is a research and comparison of CNN models for X-ray image analysis. It aims to provide insights into model performance and practical applications in medical imaging.</p>
      </div>

      {/* RD Team Section */}
      <div ref={rdTeamRef} style={{ padding: 32, background: '#f0f4ff' }}>
        <h1>R&D Team</h1>
        <p>Our Research & Development team consists of passionate AI researchers and engineers dedicated to advancing medical imaging technology.</p>
      </div>

      {/* Contact Us Section */}
      <div ref={contactRef} style={{ padding: 32, background: '#f7f7fa' }}>
        <h1>Contact Us</h1>
        <p>For inquiries, collaborations, or feedback, please contact us at <a href="mailto:contact@xraicnn.com">contact@xraicnn.com</a>.</p>
      </div>
    </div>
  );
};

export default HomePage;
