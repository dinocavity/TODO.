// components/Footer.jsx
import React from 'react';

const Footer = ({ 
  activeTodoCount, 
  hasCompletedTodos, 
  clearCompleted, 
  showInfoModal,
  layoutMode
}) => {
  // Get font size based on layout mode
  const getFontClass = () => {
    switch(layoutMode) {
      case 'compact': return 'text-xs';
      case 'expanded': return 'text-sm';
      default: return 'text-xs';
    }
  };
  
  return (
    <div className={`flex justify-between items-center ${getFontClass()} text-gray-600`}>
      <div>
        {activeTodoCount} remaining
      </div>
      
      {hasCompletedTodos && (
        <button 
          onClick={clearCompleted}
          className="hover:text-gray-400 transition-all duration-300 flex items-center"
        >
          <span>clear completed</span>
          {showInfoModal && <span className="ml-1 text-gray-800">[X]</span>}
        </button>
      )}
    </div>
  );
};

export default Footer;