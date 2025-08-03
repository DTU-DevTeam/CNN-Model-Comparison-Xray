import React, { useState, useEffect } from 'react';
import styles from './GreetingText.module.css';

const GreetingText: React.FC = () => {
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetText, setTargetText] = useState('');

  const getGreetingByTime = (): string => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 4 && hour <= 6) {
      return "Morning! Hope you slept well.";
    } else if (hour >= 6 && hour <= 11) {
      return "Good morning!";
    } else if (hour >= 12 && hour <= 13) {
      return "Enjoy your lunch!";
    } else if (hour >= 13 && hour <= 17) {
      return "Wishing you a lovely afternoon!";
    } else if (hour >= 18 && hour <= 21) {
      return "Have a pleasant evening!";
    } else {
      return "Still up? Time to sleep, go to bed!";
    }
  };

  // Initialize target text
  useEffect(() => {
    setTargetText(getGreetingByTime());
  }, []);

  // Check for time changes every 30 seconds for more responsive updates
  useEffect(() => {
    const timeCheckInterval = setInterval(() => {
      const newGreeting = getGreetingByTime();
      if (newGreeting !== targetText) {
        // Reset animation when greeting changes
        setTargetText(newGreeting);
        setCurrentText('');
        setCurrentIndex(0);
        setIsTyping(true);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(timeCheckInterval);
  }, [targetText]);

  useEffect(() => {
    if (!targetText) return; // Don't start animation until targetText is set
    
    let timeout: ReturnType<typeof setTimeout>;

    if (isTyping) {
      if (currentIndex < targetText.length) {
        timeout = setTimeout(() => {
          setCurrentText(targetText.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, 80); // typing speed
      } else {
        // Pause before starting to delete
        timeout = setTimeout(() => {
          setIsTyping(false);
          setCurrentIndex(targetText.length);
        }, 2000);
      }
    } else {
      if (currentIndex > 0) {
        timeout = setTimeout(() => {
          setCurrentText(targetText.slice(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        }, 50); // deleting speed
      } else {
        // Pause before starting to type again
        timeout = setTimeout(() => {
          setIsTyping(true);
          setCurrentIndex(0);
        }, 1000);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, isTyping, targetText]);

  return (
    <div className={styles.greetingContainer}>
      <span className={styles.greetingText}>
        {currentText}
        <span className={styles.cursor}>|</span>
      </span>
    </div>
  );
};

export default GreetingText;