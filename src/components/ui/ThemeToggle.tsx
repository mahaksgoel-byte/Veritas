import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        // Use the context toggle function
        toggleMode();
      }}
      className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-forest-800/90 backdrop-blur-sm border border-forest-divider/50 shadow-lg hover:bg-forest-700/90 transition-colors group"
      aria-label={`Toggle theme - currently ${mode} mode`}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: mode === 'light' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {mode === 'dark' ? (
          <Moon size={20} className="text-accent group-hover:text-accent/80 transition-colors" />
        ) : (
          <Sun size={20} className="text-light-accent group-hover:text-light-accent/80 transition-colors" />
        )}
      </motion.div>
      
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:bg-accent/20 light:bg-light-accent/20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};
