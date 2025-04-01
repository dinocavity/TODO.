// components/ViewToggle.jsx
import React from 'react';

const ViewToggle = ({ viewMode, setViewMode, showInfoModal }) => {
  // Simplified version of icons for list and grid views
  const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  );
  
  const GridIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
  
  return (
    <div className="flex space-x-2">
      <button
        className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'text-yellow-400 bg-gray-900' : 'text-gray-500'}`}
        onClick={() => setViewMode('list')}
        aria-label="List view"
      >
        <ListIcon />
      </button>
      <button
        className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'text-yellow-400 bg-gray-900' : 'text-gray-500'}`}
        onClick={() => setViewMode('grid')}
        aria-label="Grid view"
      >
        <GridIcon />
        {showInfoModal && viewMode !== 'grid' && (
          <span className="ml-1 text-gray-700 text-xs">[G]</span>
        )}
      </button>
    </div>
  );
};

export default ViewToggle;