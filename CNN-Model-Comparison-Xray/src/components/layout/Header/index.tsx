import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import Logo from '../../../assets/xraimain.svg';
import { BackToTop } from '../../ui/BackToTop/BackToTop';
import { MenuToCloseIcon, CloseToMenuIcon } from '../../ui/Icons';
import GreetingText from '../../ui/GreetingText';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onGetStartedClick?: () => void;
  onScrollToAbout?: () => void;
  onScrollToRDTeam?: () => void;
  onScrollToContact?: () => void;
  isHomePage?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

const Header: React.FC<HeaderProps> = ({ onGetStartedClick, onScrollToAbout, onScrollToRDTeam, onScrollToContact, isHomePage, scrollContainerRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScroll = (cb?: () => void) => () => {
    setIsMenuOpen(false);
    if (cb) cb();
  };
  
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/';
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (isHomePage) {
      const container = scrollContainerRef?.current || window;
      container.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/', { replace: true });
    } else {
      navigate('/');
    }
  };

  const handleAnalysisClick = () => {
    if (onGetStartedClick) {
      onGetStartedClick();
    } else {
      navigate('/analysis');
    }
  };

  useEffect(() => {
  const container = scrollContainerRef?.current || window;

  const handleScrollEvent = () => {
    const scrollTop = container instanceof Window
      ? window.scrollY
      : (container as HTMLElement).scrollTop;

    setIsScrolled(scrollTop > 10);
  };

  container.addEventListener('scroll', handleScrollEvent);
  return () => container.removeEventListener('scroll', handleScrollEvent);
}, [scrollContainerRef]);

  return (
    <>
      <nav className={`${styles.navbar} ${isHomePage ? styles.navbarAbsolute : ''}${
          isScrolled ? styles.scrolled : ''
        }`}
      >
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <a href="/" onClick={handleLogoClick}>
              <img src={Logo} alt="XRAI Logo" />
            </a>
          </div>
          
          <div className={styles.navRight}>
            <GreetingText />
            <button 
              className={styles.menuToggle}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <MenuToCloseIcon key="close" /> : <CloseToMenuIcon key="menu" />}
            </button>
            <button 
              className={styles.getStartedBtn}
              onClick={handleAnalysisClick}
            >
              Start Analysis
            </button>
          </div>
        </div>

        <div className={`${styles.Menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
          <div className={styles.menuContent}>
            <a href="#home" className={styles.navLinks} onClick={handleHomeClick}>Home</a>
            <a href="#about-project" className={styles.navLinks} onClick={handleScroll(onScrollToAbout)}>About project</a>
            <a href="#rd-team" className={styles.navLinks} onClick={handleScroll(onScrollToRDTeam)}>R&D Team</a>
            <a href="#contact-us" className={styles.navLinks} onClick={handleScroll(onScrollToContact)}>Contact us</a>
          </div>
        </div>
      </nav>

      {scrollContainerRef && (
        <BackToTop scrollContainerRef={scrollContainerRef} />
      )}
    </>
  );
};

export default Header;