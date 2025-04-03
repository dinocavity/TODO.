import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LevelBadge, { levelBadges } from './LevelBadges';

const ShortcutsPanel = ({ layoutMode, level, onClose }) => {
  const [activeTab, setActiveTab] = useState('shortcuts'); // 'shortcuts' or 'levels'
  
  // Panel layout based on screen size
  const getGridClass = () => {
    switch(layoutMode) {
      case 'compact': return 'grid-cols-1 gap-1';
      case 'expanded': return 'grid-cols-3 gap-3';
      default: return 'grid-cols-2 gap-2';
    }
  };
  
  const shortcuts = [
    { key: 'N', description: 'New task' },
    { key: 'G', description: 'Toggle grid/list' },
    { key: 'A', description: 'All tasks' },
    { key: 'V', description: 'Active tasks' },
    { key: 'C', description: 'Completed tasks' },
    { key: 'I', description: 'Show help panel' },
    { key: 'R', description: 'Toggle rewards' },
    { key: 'L', description: 'Return to list' },
    { key: 'Esc', description: 'Close dialogs' }
  ];
  
  // How many levels to display based on layout
  const getLevelsToShow = () => {
    switch(layoutMode) {
      case 'compact': return 3;
      case 'expanded': return 6;
      default: return 4;
    }
  };
  
  // Display badges that are close to current level, prioritizing next levels to unlock
  const getLevelsToDisplay = () => {
    const numToShow = getLevelsToShow();
    const startLevel = Math.max(1, Math.min(level - 1, 10 - numToShow));
    
    return levelBadges.slice(startLevel - 1, startLevel - 1 + numToShow);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-light text-gray-300">Help & Information</h2>
        <motion.button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-300 text-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ×
        </motion.button>
      </div>
      
      {/* Tab navigation */}
      <div className="flex border-b border-gray-800 mb-4">
        <motion.button
          className={`pb-2 mr-4 text-sm ${activeTab === 'shortcuts' ? 'text-yellow-400 border-b border-yellow-400' : 'text-gray-500'}`}
          onClick={() => setActiveTab('shortcuts')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Keyboard Shortcuts
        </motion.button>
        <motion.button
          className={`pb-2 text-sm ${activeTab === 'levels' ? 'text-yellow-400 border-b border-yellow-400' : 'text-gray-500'}`}
          onClick={() => setActiveTab('levels')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Level Badges
        </motion.button>
      </div>
      
      <AnimatePresence mode="wait">
        {activeTab === 'shortcuts' ? (
          <motion.div
            key="shortcuts"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`grid ${getGridClass()} text-xs`}>
              {shortcuts.map((shortcut, index) => (
                <motion.div 
                  key={shortcut.key} 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (index * 0.03) }}
                >
                  <motion.span 
                    className="bg-gray-800 text-gray-400 px-2 py-1 rounded mr-2 w-6 text-center"
                    whileHover={{ backgroundColor: '#374151', color: '#D1D5DB' }}
                  >
                    {shortcut.key}
                  </motion.span>
                  <span className="text-gray-400">{shortcut.description}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="levels"
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-xs text-gray-400 mb-2">
              Current Level: <span className="text-yellow-400">{levelBadges[level-1]?.name || 'Novice'}</span>
            </div>
            
            {/* Display current and next levels */}
            <div className="space-y-2">
              {getLevelsToDisplay().map((badge, index) => (
                <motion.div
                  key={badge.level}
                  className="flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (index * 0.05) }}
                >
                  <div className={`w-8 h-8 ${badge.color} rounded-full flex items-center justify-center 
                    border-2 ${badge.borderColor} ${badge.level <= level ? '' : 'opacity-60'}`}>
                    {React.createElement(badge.icon, { 
                      size: 16, 
                      className: badge.level <= level ? badge.textColor : 'text-gray-600',
                      strokeWidth: 2.5
                    })}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-300 flex items-center">
                      {badge.name}
                      {badge.level === level && (
                        <span className="ml-2 text-yellow-400 text-xs">
                          (Current)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{badge.description}</div>
                    <div className="text-xs text-gray-600 italic">
                      Achievement: {badge.achievement}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-xs text-gray-500 pt-2">
              Complete tasks to earn points and level up. Higher priority tasks award more points!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShortcutsPanel;