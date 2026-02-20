import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  onChange?: (value: string) => void;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, value, rows = 4, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    // Update hasValue when the value prop changes externally
    useEffect(() => {
      setHasValue(!!value);
    }, [value]);

    return (
      <div className="relative pt-5 mb-4">
        <textarea
          ref={ref}
          id={id}
          value={value}
          rows={rows}
          style={{
            WebkitBoxShadow: 'inset 0 0 0 1000px transparent',
            fontSize: '16px',
            transition: 'background-color 5000s ease-in-out 0s',
            resize: 'none',
          }}
          className={cn(
            "block w-full bg-transparent border-b dark:border-forest-divider light:border-light-divider py-2 dark:text-text-primary light:text-light-primary placeholder-transparent focus:outline-none transition-colors duration-300",
            "font-sans text-base",
            "autofill:bg-transparent autofill:text-text-primary autofill:shadow-[inset_0_0_0_1000px_transparent]",
            "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-text-primary [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_transparent]",
            "[&:autofill]:bg-transparent [&:autofill]:text-text-primary",
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
            props.onBlur?.(e);
          }}
          onChange={(e) => {
            const newValue = e.target.value;
            setHasValue(!!newValue);
            onChange?.(newValue);
          }}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-0 transition-all duration-300 ease-institutional pointer-events-none uppercase tracking-wider",
            (isFocused || hasValue) 
              ? "top-0 text-[10px] text-accent font-semibold" 
              : "top-6 text-xs dark:text-text-muted light:text-light-muted font-medium"
          )}
        >
          {label}
        </label>
        {/* Animated Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
          className="absolute bottom-0 left-0 w-full h-[1px] bg-accent origin-left"
        />
      </div>
    );
  }
);
