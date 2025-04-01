// components/LevelBadges.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sprout, 
  Diamond, 
  Star, 
  Award, 
  ShieldCheck,
  Trophy, 
  Crown, 
  Medal, 
  Zap, 
  Sparkles 
} from 'lucide-react';

// Badge definitions with icons and names
export const levelBadges = [
  { 
    level: 1, 
    name: "Novice", 
    icon: Sprout, 
    color: "bg-green-400", 
    textColor: "text-green-900",
    borderColor: "border-green-500",
    description: "Just starting out", 
    achievement: "Automatically achieved when you start using the app"
  },
  { 
    level: 2, 
    name: "Beginner", 
    icon: Diamond, 
    color: "bg-blue-400", 
    textColor: "text-blue-900",
    borderColor: "border-blue-500",
    description: "Building momentum", 
    achievement: "Complete 5 tasks of any priority"
  },
  { 
    level: 3, 
    name: "Apprentice", 
    icon: Star, 
    color: "bg-yellow-400", 
    textColor: "text-yellow-900",
    borderColor: "border-yellow-500",
    description: "Getting consistent", 
    achievement: "Complete 10 tasks including 3 medium priority tasks"
  },
  { 
    level: 4, 
    name: "Adept", 
    icon: ShieldCheck, 
    color: "bg-orange-400", 
    textColor: "text-orange-900",
    borderColor: "border-orange-500",
    description: "Mastering the basics", 
    achievement: "Complete 20 tasks with no overdue tasks"
  },
  { 
    level: 5, 
    name: "Expert", 
    icon: Award, 
    color: "bg-indigo-400", 
    textColor: "text-indigo-900",
    borderColor: "border-indigo-500",
    description: "High productivity", 
    achievement: "Complete 5 high priority tasks with all their subtasks"
  },
  { 
    level: 6, 
    name: "Master", 
    icon: Trophy, 
    color: "bg-purple-400", 
    textColor: "text-purple-900",
    borderColor: "border-purple-500",
    description: "Task managing pro", 
    achievement: "Complete 50 tasks total with at least 70% on time"
  },
  { 
    level: 7, 
    name: "Grandmaster", 
    icon: Crown, 
    color: "bg-yellow-500", 
    textColor: "text-yellow-900",
    borderColor: "border-yellow-600",
    description: "Legendary efficiency", 
    achievement: "Complete 10 high priority tasks before their due date"
  },
  { 
    level: 8, 
    name: "Champion", 
    icon: Medal, 
    color: "bg-red-400", 
    textColor: "text-red-900",
    borderColor: "border-red-500",
    description: "Unmatched discipline", 
    achievement: "Maintain a 100% completion rate for 7 consecutive days"
  },
  { 
    level: 9, 
    name: "Legend", 
    icon: Zap, 
    color: "bg-cyan-400", 
    textColor: "text-cyan-900",
    borderColor: "border-cyan-500",
    description: "Unstoppable force", 
    achievement: "Complete 100 tasks with all their subtasks"
  },
  { 
    level: 10, 
    name: "Mythic", 
    icon: Sparkles, 
    color: "bg-pink-400", 
    textColor: "text-pink-900",
    borderColor: "border-pink-500",
    description: "Productivity incarnate", 
    achievement: "Reach 1000 MMR points (decreases with overdue tasks)"
  }
];

const LevelBadge = ({ level, size = "medium", showInfo = false, animate = false }) => {
  // Find the badge for this level (or default to level 1)
  const badge = levelBadges.find(b => b.level === level) || levelBadges[0];
  const IconComponent = badge.icon;
  
  // Size classes
  const getSizeClasses = () => {
    switch(size) {
      case "small": return { wrapper: "w-6 h-6", icon: 12 };
      case "large": return { wrapper: "w-14 h-14", icon: 28 };
      default: return { wrapper: "w-10 h-10", icon: 20 }; // medium
    }
  };
  
  const sizeClasses = getSizeClasses();
  
  return (
    <div className={`flex ${showInfo ? 'items-start' : 'items-center'}`}>
      <motion.div 
        className={`${sizeClasses.wrapper} ${badge.color} rounded-full flex items-center justify-center 
          border-2 ${badge.borderColor} shadow-lg z-10`}
        whileHover={animate ? { scale: 1.1, rotate: 5 } : {}}
        initial={animate ? { scale: 0.8, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <IconComponent size={sizeClasses.icon} className={badge.textColor} strokeWidth={2.5} />
      </motion.div>
      
      {showInfo && (
        <motion.div 
          className="ml-3"
          initial={animate ? { opacity: 0, x: -10 } : {}}
          animate={animate ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          <div className="font-medium text-gray-300">{badge.name}</div>
          <div className="text-xs text-gray-500">{badge.description}</div>
        </motion.div>
      )}
    </div>
  );
};

export default LevelBadge;