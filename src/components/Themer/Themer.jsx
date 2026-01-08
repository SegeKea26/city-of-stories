import { useEffect, useState } from 'react';
import './Themer.css';
import SunIcon from './SunIcon';
import MoonIcon from './MoonIcon';

export default function Themer() {
  const [isDark, setIsDark] = useState(true);

  const applyTheme = (isDarkMode) => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      applyTheme(storedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark);
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    applyTheme(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <button 
      className="themer__button" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
