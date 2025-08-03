import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import Logo from '../../../assets/xraimain.svg';
import { MenuToCloseIcon, CloseToMenuIcon, ArrowUpIcon } from '../../ui/Icons';
import GreetingText from '../../ui/GreetingText';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onGetStartedClick?: () => void;
  onScrollToAbout?: () => void;
  onScrollToRDTeam?: () => void;
  onScrollToContact?: () => void;
  isHomePage?: boolean;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

const Header: React.FC<HeaderProps> = ({ onGetStartedClick, onScrollToAbout, onScrollToRDTeam, onScrollToContact, isHomePage, scrollContainerRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const container = scrollContainerRef?.current || window;
    const handleScroll = () => {
      const scrollY = scrollContainerRef?.current ? (scrollContainerRef.current.scrollTop) : window.scrollY;
      setShowScrollTop(scrollY > 200);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScroll = (cb?: () => void) => () => {
    setIsMenuOpen(false);
    if (cb) cb();
  };

  const handleScrollTop = () => {
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.reload();
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (isHomePage) {
      if (scrollContainerRef?.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/home');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.navLeft}>
          <div className={styles.logo}>
            <a href="/" onClick={handleLogoClick}>
              <img src={Logo} alt="XRAI Logo" />
            </a>
          </div>
        </div>
        <div className={styles.navRight}>
          {/* Greeting Text */}
          <GreetingText />
          {/* Menu Toggle Button */}
          <button 
            className={styles.menuToggle}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <MenuToCloseIcon key="close" />
            ) : (
              <CloseToMenuIcon key="menu" />
            )}
          </button>
          {/* Get Started Button */}
          <button 
            className={styles.getStartedBtn}
            onClick={onGetStartedClick}
          >
            Start Analysis
          </button>
        </div>
      </div>
      {/* Menu Dropdown */}
      <div className={`${styles.Menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <div className={styles.menuContent}>
          <a href="/home" className={styles.navLinks} onClick={handleHomeClick}>
            Home
          </a>
          <a href="#" className={styles.navLinks} onClick={handleScroll(onScrollToAbout)}>
            About project
          </a>
          <a href="#" className={styles.navLinks} onClick={handleScroll(onScrollToRDTeam)}>
            R&D Team
          </a>
          <a href="#" className={styles.navLinks} onClick={handleScroll(onScrollToContact)}>
            Contact us
          </a>
        </div>
      </div>
      {/* Nút scroll to top */}
      {showScrollTop && (
        <button
          className={styles.scrollToTopBtn}
          onClick={handleScrollTop}
          aria-label="Scroll to top"
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 9999,
            borderRadius: '50%',
            width: 48,
            height: 48,
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24
          }}
        >
          <ArrowUpIcon style={{ width: 28, height: 28 }} />
        </button>
      )}
    </nav>
  );
};

export default Header;
