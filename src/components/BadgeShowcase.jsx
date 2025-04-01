// components/BadgeShowcase.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { levelBadges } from './LevelBadges';

const BadgeShowcase = ({ level, layoutMode }) => {
  const getGridClass = () => {
    switch(layoutMode) {
      case 'compact': return 'grid-cols-2 gap-2';
      case 'expanded': return 'grid-cols-5 gap-4';
      default: return 'grid-cols-3 gap-3';
    }
  };

  return (
    <motion.div 
      className="mt-4 mb-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h3 
        className="text-sm text-gray-400 mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Badge Collection
      </motion.h3>
      
      <div className={`grid ${getGridClass()}`}>
        {levelBadges.map((badge) => {
          const unlocked = badge.level <= level;
          const isCurrentLevel = badge.level === level;
          
          return (
            <motion.div
              key={badge.level}
              className={`flex flex-col items-center p-2 rounded-lg ${
                isCurrentLevel ? 'bg-gray-800 bg-opacity-50 ring-1 ring-yellow-400' : ''
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: badge.level * 0.05,
                duration: 0.3
              }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className={`w-12 h-12 rounded-full flex items-center justify-center
                  ${unlocked ? badge.color : 'bg-gray-800'}
                  border-2 ${unlocked ? badge.borderColor : 'border-gray-700'}
                  shadow-lg mb-1`}
                animate={isCurrentLevel ? {
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    '0 0 0 rgba(255, 214, 10, 0)',
                    '0 0 20px rgba(255, 214, 10, 0.7)',
                    '0 0 0 rgba(255, 214, 10, 0)'
                  ]
                } : {}}
                transition={isCurrentLevel ? {
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                } : {}}
              >
                {React.createElement(badge.icon, { 
                  size: 24, 
                  className: unlocked ? badge.textColor : 'text-gray-600',
                  strokeWidth: isCurrentLevel ? 3 : 2.5
                })}
              </motion.div>
              
              <div className="text-center">
                <div className={`text-xs font-medium ${
                  isCurrentLevel ? 'text-yellow-400' : 
                  unlocked ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {badge.name}
                </div>
                <div className="text-xs text-gray-600">Level {badge.level}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BadgeShowcase;