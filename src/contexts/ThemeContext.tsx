import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Check localStorage for saved preference
    const savedMode = localStorage.getItem('veritas_theme') as ThemeMode;
    return savedMode || 'dark'; // Default to dark
  });

  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('veritas_theme', mode);
  }, [mode]);

  // Apply theme to document root
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const toggleMode = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('veritas_theme', newMode);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
