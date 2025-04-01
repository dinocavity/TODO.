// components/Header.jsx
import React from 'react';
import { motion } from 'framer-motion';
import LevelBadge from './LevelBadges';

const Header = ({ 
  level, 
  points, 
  mmr,
  showInfoModal,
  showMmrModal,
  showRewards, 
  setShowRewards,
  layoutMode 
}) => {
  // Header styles based on layout mode
  const getTitleClass = () => {
    switch(layoutMode) {
      case 'compact': return 'text-3xl';
      case 'expanded': return 'text-5xl';
      default: return 'text-4xl';
    }
  };

  const getPointsClass = () => {
    switch(layoutMode) {
      case 'compact': return 'text-lg';
      case 'expanded': return 'text-2xl';
      default: return 'text-xl';
    }
  };
  
  return (
    <motion.div 
      className="mb-8 flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="flex items-center">
        <motion.h1 
          className={`${getTitleClass()} font-light tracking-widest`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          TODO<motion.span 
            className="text-yellow-400 ml-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
          >.</motion.span>
        </motion.h1>
        
        <motion.button 
          onClick={showInfoModal}
          className="relative ml-3 w-5 h-5 rounded-full border border-gray-700 text-gray-500 flex items-center justify-center text-xs hover:border-gray-500 hover:text-gray-400 focus:outline-none"
          aria-label="Show help and information"
          whileHover={{ scale: 1.2, borderColor: "#6B7280" }}
          whileTap={{ scale: 0.9 }}
        >
          i
        </motion.button>
      </div>
      
      <motion.div 
        className="flex items-center space-x-2 cursor-pointer" 
        onClick={() => setShowRewards(!showRewards)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <LevelBadge level={level} size="small" animate={false} />
          
          {/* Level bubble */}
          <motion.div 
            className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border border-yellow-500 shadow-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.5,
              type: "spring",
              stiffness: 500,
              damping: 15
            }}
          >
            {level}
          </motion.div>
          
          {/* MMR indicator for level 10 */}
          {level === 10 && (
            <motion.div 
              className={`absolute -bottom-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border shadow-sm cursor-pointer ${
                mmr < 0 ? 'bg-red-500 text-white border-red-600' : 
                'bg-pink-400 text-pink-900 border-pink-500'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.6,
                type: "spring",
                stiffness: 500,
                damping: 15
              }}
              onClick={showMmrModal}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Click to view MMR details"
            >
              <span className="text-xs">M</span>
            </motion.div>
          )}
        </motion.div>
        
        <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-yellow-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(points % 100)}%` }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          ></motion.div>
        </div>
        <motion.div 
          className={`${getPointsClass()} text-yellow-400`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >{points}</motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Header;