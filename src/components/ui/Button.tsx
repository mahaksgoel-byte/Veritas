import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', fullWidth, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "h-12 px-6 font-sans font-medium text-sm transition-colors duration-300 ease-institutional rounded-sm",
          fullWidth && "w-full",
          variant === 'primary' && "bg-accent text-forest-900 hover:bg-accent-hover hover:bg-accent/90 shadow-sm dark:text-forest-900 light:text-white",
          variant === 'ghost' && "bg-transparent text-text-muted hover:text-text-primary dark:text-text-muted light:text-light-text-muted dark:hover:text-text-primary light:hover:text-light-text-primary",
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);
