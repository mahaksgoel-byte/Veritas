import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Check, AlertCircle } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  onChange?: (value: string) => void;
  error?: string;
  success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, value, onChange, error, success, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);
    const [isHovered, setIsHovered] = useState(false);

    // Update hasValue when the value prop changes externally
    useEffect(() => {
      setHasValue(!!value);
    }, [value]);

    return (
      <motion.div 
        className="relative pt-5 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.input
          ref={ref}
          id={id}
          name={props.name}
          value={value}
          style={{
            WebkitBoxShadow: 'inset 0 0 0 1000px transparent',
            WebkitTextFillColor: 'currentColor',
            color: 'currentColor',
            fontSize: '16px',
            transition: 'background-color 5000s ease-in-out 0s',
          }}
          className={cn(
            "block w-full bg-transparent border-b py-2 dark:text-text-primary light:text-light-primary placeholder-transparent focus:outline-none transition-all duration-300",
            "font-sans text-base",
            "autofill:bg-transparent autofill:text-text-primary autofill:shadow-[inset_0_0_0_1000px_transparent]",
            "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-text-primary [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_transparent]",
            "[&:autofill]:bg-transparent [&:autofill]:text-text-primary",
            error 
              ? "border-red-400/50 text-red-100" 
              : success 
                ? "border-green-400/50 text-green-100"
                : "dark:border-forest-divider light:border-light-divider hover:border-accent/30",
            (isFocused || isHovered) && "dark:bg-forest-800/20 light:bg-light-200/20",
            className
          )}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
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
          disabled={props.disabled}
          placeholder={props.placeholder}
          type={props.type}
          maxLength={props.maxLength}
          minLength={props.minLength}
          pattern={props.pattern}
          required={props.required}
          autoComplete={props.autoComplete}
        />
        <motion.label
          htmlFor={id}
          className={cn(
            "absolute left-0 transition-all duration-300 ease-institutional pointer-events-none uppercase tracking-wider flex items-center gap-1",
            (isFocused || hasValue) 
              ? "top-0 text-[10px] font-semibold" 
              : "top-6 text-xs font-medium",
            error 
              ? "text-red-400" 
              : success 
                ? "text-green-400"
                : (isFocused || hasValue) 
                  ? "text-accent" 
                  : "dark:text-text-muted light:text-light-muted"
          )}
        >
          {label}
          {success && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Check size={10} className="text-green-400" />
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <AlertCircle size={10} className="text-red-400" />
            </motion.div>
          )}
        </motion.label>
        {/* Animated Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
          className={cn(
            "absolute bottom-0 left-0 w-full h-[1px] origin-left",
            error ? "bg-red-400" : success ? "bg-green-400" : "bg-accent"
          )}
        />
        
        {/* Hover Glow Effect */}
        {isHovered && !isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-accent/5 rounded-lg pointer-events-none"
          />
        )}
      </motion.div>
    );
  }
);
