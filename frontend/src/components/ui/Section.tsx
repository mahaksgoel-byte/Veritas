import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, FolderOpen, User, BookOpen, Microscope, GraduationCap } from 'lucide-react';

interface SectionProps {
  title: string;
  children?: React.ReactNode;
  icon?: string;
  defaultOpen?: boolean;
}

const getSectionIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('basic') || lowerTitle.includes('information')) return User;
  if (lowerTitle.includes('academic') || lowerTitle.includes('education')) return GraduationCap;
  if (lowerTitle.includes('research')) return Microscope;
  if (lowerTitle.includes('profile')) return FolderOpen;
  return BookOpen;
};

export const Section: React.FC<SectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = getSectionIcon(title);
  
  const toggleSection = () => setIsOpen(!isOpen);
  
  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-4 pb-2 border-b border-forest-divider/20 cursor-pointer"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        onClick={toggleSection}
      >
        <motion.div
          className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent/10 to-emerald-500/10 flex items-center justify-center border border-accent/20"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon size={14} className="text-accent" />
        </motion.div>
        <h3 className="text-lg font-playfair text-text-primary font-bold tracking-tight flex-1">
          {title}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="ml-auto"
        >
          <ChevronDown size={14} className="text-text-muted" />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, height: 0, y: -10 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          height: isOpen ? "auto" : 0,
          y: isOpen ? 0 : -10 
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
