import React, { useState, useEffect } from 'react';
import styles from './IntroPage.module.css';
import HomePage from '../HomePage';
import Loader from '../../components/ui/Loader/Loader';
import SocialButton from '../../components/ui/Button/Button';
import ParticleCursor from '../../components/ui/ParticleCursor/ParticleCursor';
import CursorRipple from '../../components/ui/CursorRipple/CursorRipple';

const IntroPage: React.FC = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSocialButtons, setShowSocialButtons] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    // Start the animation sequence
    const timer1 = setTimeout(() => {
      setShowTitle(true);
      setShowSocialButtons(true); // Show social buttons with title
    }, 500);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  useEffect(() => {
    if (showTitle) {
      // Start loading animation after title is shown
      const timer = setTimeout(() => {
        // Show main content after loading animation
        setTimeout(() => setShowContent(true), 2000);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showTitle]);

  useEffect(() => {
    if (showContent) {
      // Wait for fade out animation to complete (0.8s) before showing HomePage
      const timer = setTimeout(() => {
        setIntroComplete(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showContent]);

  const handleSocialClick = (platform: string) => {
    const urls = {
      github: 'https://github.com/DTU-DevTeam/',
      linkedin: 'https://www.linkedin.com/in/tuan-leminh-tech/',
      instagram: 'https://www.instagram.com/le.mingtuann_17/'
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const subtitleFullText = "www.xraicnn.com";
  const [subtitleText, setSubtitleText] = useState('');
  const [typingForward, setTypingForward] = useState(true);

  useEffect(() => {
    if (!showTitle || introComplete) return;
    let currentIndex = 0;
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      interval = setInterval(() => {
        if (typingForward) {
          if (currentIndex < subtitleFullText.length) {
            setSubtitleText(subtitleFullText.slice(0, currentIndex + 1));
            currentIndex++;
          } else {
            setTypingForward(false);
            clearInterval(interval);
            timeout = setTimeout(type, 500); // pause 0.5s before deleting
          }
        } else {
          if (currentIndex > 0) {
            setSubtitleText(subtitleFullText.slice(0, currentIndex - 1));
            currentIndex--;
          } else {
            setTypingForward(true);
            clearInterval(interval);
            timeout = setTimeout(type, 500); // pause 0.5s before typing again
          }
        }
      }, 120); // slower typing
    };

    type();
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [showTitle, typingForward, introComplete]);

  return (
    <>
      {/* Particle Cursor & Cursor Ripple Animation */}
      <ParticleCursor isActive={!introComplete} />
      <CursorRipple isActive={!introComplete} />
      
      {/* Intro Animation Section */}
      <div className={`${styles.introSection} ${showContent ? styles.fadeOut : ''}`}>
        <div className={styles.introContent}>
          {/* Main Title with Zoom In Effect */}
          <h1 className={`${styles.mainTitle} ${showTitle ? styles.zoomIn : ''}`}>
            AI X-RAY ANALYSIS
          </h1>

          {/* Subtitle with Zoom In, Pulse, and Typing Text Cycle */}
          <a
            href="https://www.xraicnn.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.subtitle} ${showTitle ? styles.zoomIn : ''}`}
          >
            {subtitleText}
            <span className={styles.cursor}>|</span>
          </a>

          {/* Loader */}
          {showTitle && (
            <Loader/>
          )}

          {/* Social Media Buttons */}
          <div className={`${styles.socialButtons} ${showSocialButtons ? styles.slideUp : ''}`}>
            <SocialButton iconClass="fab fa-github" onClick={() => handleSocialClick('github')} variant="github">
              GitHub
            </SocialButton>
            <SocialButton iconClass="fab fa-linkedin" onClick={() => handleSocialClick('linkedin')} variant="linkedin">
              LinkedIn
            </SocialButton>
            <SocialButton iconClass="fab fa-instagram" onClick={() => handleSocialClick('instagram')} variant="instagram">
              Instagram
            </SocialButton>
          </div>
        </div>
      </div>

      {/* HomePage (shown after intro animation completes) */}
      {introComplete && <HomePage />}
    </>
  );
};

export default IntroPage;
