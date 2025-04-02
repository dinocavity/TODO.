// components/RewardsPanel.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LevelBadge, { levelBadges } from './LevelBadges';
import BadgeShowcase from './BadgeShowcase';

const RewardsPanel = ({ level, points, layoutMode }) => {
  const [showAllBadges, setShowAllBadges] = useState(false);

  // Adjust grid based on screen size
  const getGridClass = () => {
    switch (layoutMode) {
      case 'compact': return 'grid-cols-5 gap-1';
      case 'expanded': return 'grid-cols-10 gap-3';
      default: return 'grid-cols-5 gap-2';
    }
  };

  const getAchievementSize = () => {
    switch (layoutMode) {
      case 'compact': return 'w-6 h-6';
      case 'expanded': return 'w-10 h-10';
      default: return 'w-8 h-8';
    }
  };

  return (
    <motion.div
      className="mb-6 bg-gray-900 bg-opacity-30 p-4 rounded space-y-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      {/* Current level badge and info */}
      <motion.div
        className="flex justify-between items-start"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <LevelBadge
          level={level}
          showInfo={true}
          size={layoutMode === 'compact' ? 'small' : 'medium'}
          animate={true}
        />

        <div className="text-right">
          <div className="text-xs text-gray-400">Next level</div>
          <div className="text-xs text-gray-600">
            {points % 100}/100 to level {level + 1}
          </div>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="h-2 bg-gray-800 rounded-full overflow-hidden"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="h-full bg-yellow-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(points % 100)}%` }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>

      {/* Toggle button to show all badges */}
      <AnimatePresence>
        <div className="flex justify-center">
          <motion.button
            onClick={() => setShowAllBadges(!showAllBadges)}
            className={`text-xs px-3 py-1 rounded-full transition-colors
        ${showAllBadges
                ? 'bg-yellow-400 bg-opacity-40 text-white-800 border border-yellow-500'
                : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showAllBadges ? 'Hide Badge Collection' : 'View All Badges'}


          </motion.button>
        </div>
      </AnimatePresence>

      {/* Badge showcase or achievement progress */}
      <AnimatePresence mode="wait">
        {showAllBadges ? (
          <motion.div
            key="showcase"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BadgeShowcase level={level} layoutMode={layoutMode} />
          </motion.div>
        ) : (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-xs text-gray-500 text-center mb-2">Progress</div>
            {/* Achievements */}
            <motion.div
              className={`grid ${getGridClass()} gap-y-3`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[...Array(layoutMode === 'expanded' ? 10 : 5)].map((_, i) => {
                const currentLevel = i + 1;
                const unlocked = currentLevel <= level;
                const delay = 0.5 + (i * 0.05);
                const badge = levelBadges.find(b => b.level === currentLevel) || levelBadges[0];
                const IconComponent = badge.icon;

                return (
                  <motion.div
                    key={i}
                    className={`flex flex-col items-center justify-center gap-1`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className={`${getAchievementSize()} rounded-full flex items-center justify-center 
                      ${unlocked ? badge.color : 'bg-gray-800'} 
                      border ${unlocked ? badge.borderColor : 'border-gray-700'} shadow-md`}>
                      <IconComponent
                        size={layoutMode === 'compact' ? 14 : 20}
                        className={unlocked ? badge.textColor : 'text-gray-600'}
                        strokeWidth={2.5}
                      />
                    </div>
                    {layoutMode !== 'compact' && (
                      <span className={`text-xs ${unlocked ? 'text-gray-300' : 'text-gray-600'} truncate`}>
                        {badge.name}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RewardsPanel;