// components/FilterTabs.jsx
import React from 'react';

const FilterTabs = ({ filter, setFilter, showInfoModal, overdueTodoCount, deletedTodoCount }) => {
  const filterOptions = [
    { id: 'all', label: 'All', shortcut: 'A' },
    { id: 'active', label: 'Active', shortcut: 'V' },
    { id: 'completed', label: 'Completed', shortcut: 'C' },
    { id: 'overdue', label: `Overdue ${overdueTodoCount > 0 ? `(${overdueTodoCount})` : ''}`, shortcut: 'O', alert: overdueTodoCount > 0 },
    { id: 'deleted', label: `Deleted ${deletedTodoCount > 0 ? `(${deletedTodoCount})` : ''}`, shortcut: 'D' }
  ];
  
  return (
    <div className="flex text-xs border-b border-gray-900 overflow-x-auto pb-1">
      {filterOptions.map((status) => (
        <button 
          key={status.id}
          className={`mr-4 pb-1 flex items-center whitespace-nowrap ${
            filter === status.id 
              ? 'text-yellow-400 border-b border-yellow-400' 
              : status.alert 
                ? 'text-red-400' 
                : 'text-gray-500'
          }`}
          onClick={() => setFilter(status.id)}
        >
          {status.label}
          {showInfoModal && (
            <span className="ml-1 text-gray-700">[{status.shortcut}]</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;