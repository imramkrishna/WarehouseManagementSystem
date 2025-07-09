import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative overflow-hidden"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
        }`} />
        <Moon className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
        }`} />
      </div>
    </Button>
  );
}