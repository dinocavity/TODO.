// components/MMRRating.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const MMRRating = ({ mmr, layoutMode }) => {
  // Determine rating tier based on MMR
  const getTier = (mmr) => {
    if (mmr >= 1000) return { name: "Mythic", color: "text-pink-400" };
    if (mmr >= 800) return { name: "Diamond", color: "text-cyan-400" };
    if (mmr >= 600) return { name: "Platinum", color: "text-purple-400" };
    if (mmr >= 400) return { name: "Gold", color: "text-yellow-400" };
    if (mmr >= 200) return { name: "Silver", color: "text-gray-400" };
    if (mmr >= 0) return { name: "Bronze", color: "text-orange-400" };
    return { name: "Unranked", color: "text-red-400" };
  };
  
  const tier = getTier(mmr);
  
  // Calculate MMR progression to next tier
  const getNextTierThreshold = (mmr) => {
    if (mmr >= 1000) return 1200;
    if (mmr >= 800) return 1000;
    if (mmr >= 600) return 800;
    if (mmr >= 400) return 600;
    if (mmr >= 200) return 400;
    if (mmr >= 0) return 200;
    return 0;
  };
  
  const currentTierThreshold = Math.max(0, getNextTierThreshold(mmr) - 200);
  const nextTierThreshold = getNextTierThreshold(mmr);
  const progress = Math.max(0, Math.min(100, ((mmr - currentTierThreshold) / (nextTierThreshold - currentTierThreshold)) * 100));
  
  return (
    <div className="bg-gray-900 bg-opacity-40 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Sparkles className="mr-2 text-pink-400" size={18} />
          <span className="text-gray-300 font-medium">MMR Rating</span>
        </div>
        <div className={`${tier.color} font-bold text-lg`}>
          {mmr < 0 ? <span className="text-red-500">{mmr}</span> : mmr}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className={`${tier.color} text-sm font-semibold`}>{tier.name}</div>
        {mmr < 0 ? (
          <div className="text-xs text-red-500 ml-1">(Deranking!)</div>
        ) : mmr >= 1000 ? (
          <div className="text-xs text-green-400 ml-1">(Max tier)</div>
        ) : (
          <div className="text-xs text-gray-500 ml-1">
            ({nextTierThreshold - mmr} to {getTier(nextTierThreshold).name})
          </div>
        )}
      </div>
      
      {mmr >= 0 && (
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${tier.color.replace('text-', 'bg-')}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
      
      <div className="text-xs text-gray-500 space-y-1">
        <div>
          <span className="text-green-400">+20 MMR</span> for completing a high priority task on time
        </div>
        <div>
          <span className="text-green-400">+10 MMR</span> for completing a medium priority task on time
        </div>
        <div>
          <span className="text-green-400">+5 MMR</span> for completing a low priority task on time
        </div>
        <div>
          <span className="text-red-400">-30 MMR</span> for each overdue task
        </div>
        <div>
          <span className="text-red-400">-15 MMR</span> for each deleted task
        </div>
        <div className="italic pt-1 text-gray-600">
          If MMR falls below 0, you'll be deranked from Mythic level
        </div>
      </div>
    </div>
  );
};

export default MMRRating;