import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ title, description, icon: Icon, selected, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className={cn(
        "cursor-pointer p-4 rounded-xl border transition-all duration-300 ease-institutional flex-1",
        selected 
          ? "dark:bg-forest-700 light:bg-light-200 dark:border-accent light:border-light-accent shadow-[0_0_15px_rgba(111,175,138,0.1)]" 
          : "dark:bg-forest-800 light:bg-light-100 dark:border-forest-divider light:border-light-divider hover:dark:bg-forest-700 hover:light:bg-light-200"
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col h-full justify-between">
        <div className={cn("mb-3", selected ? "dark:text-accent light:text-light-accent" : "dark:text-text-muted light:text-light-text-muted")}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className={cn("font-serif text-lg mb-1", selected ? "text-text-primary" : "dark:text-text-muted light:text-light-text-muted")}>
            {title}
          </h3>
          <p className="text-xs dark:text-text-muted light:text-light-text-muted leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
