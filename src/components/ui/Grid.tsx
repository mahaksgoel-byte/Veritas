import React from 'react';
import { motion } from 'framer-motion';

interface GridProps {
  children?: React.ReactNode;
  cols?: number;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({ children, cols = 2, className = '' }) => {
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[cols] || 'grid-cols-1 md:grid-cols-2';

  return (
    <motion.div 
      className={`grid ${gridColsClass} gap-6 mb-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="relative group"
        >
          {/* Subtle background on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <div className="relative">
            {child}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
