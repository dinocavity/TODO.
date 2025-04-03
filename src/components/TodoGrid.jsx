import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TodoGrid = ({ 
  todos, 
  toggleTodo, 
  startEdit, 
  deleteTodo,
  restoreTodo,
  permanentlyDeleteTodo,
  openNoteView,
  layoutMode,
  isOverdue,
  filter
}) => {
  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-400';
      case 'low': return 'border-green-400';
      default: return 'border-yellow-400';
    }
  };
  
  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Check if a task is overdue
  const checkIfOverdue = (todo) => {
    if (isOverdue && isOverdue(todo.id)) {
      return true;
    }
    
    if (!todo.dueDate || todo.completed) return false;
    
    const now = new Date();
    const dueDate = new Date(todo.dueDate);
    
    if (todo.dueTime) {
      const [hours, minutes] = todo.dueTime.split(':');
      dueDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    }
    
    return now > dueDate;
  };
  
  // Get grid columns based on layout mode
  const getGridClass = () => {
    switch(layoutMode) {
      case 'compact': return 'grid-cols-1 gap-2';
      case 'expanded': return 'grid-cols-3 gap-4';
      default: return 'grid-cols-2 gap-3';
    }
  };
  
  return (
    <motion.div 
      className={`grid ${getGridClass()}`}
      layout
    >
      <AnimatePresence>
        {todos.map((todo, index) => (
          <motion.div 
            key={todo.id} 
            className={`p-3 bg-gray-900 bg-opacity-20 rounded-md border-l-4 ${getPriorityColor(todo.priority)} 
              ${todo.completed ? 'opacity-60' : ''} group`}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ 
              y: -5, 
              backgroundColor: 'rgba(31, 41, 55, 0.3)', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
            }}
            layout
          >
          <div className="flex items-start mb-2">
            {/* Checkbox - only show for non-deleted tasks */}
            {filter !== 'deleted' && (
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`mt-1 w-4 h-4 rounded-full mr-2 flex-shrink-0 border ${
                  todo.completed ? 'bg-yellow-400 border-yellow-400' : 'border-gray-600'
                }`}
                aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
              />
            )}
            
            {/* Title */}
            <h3 
              className={`flex-grow text-sm font-medium ${
                todo.completed ? 'text-gray-600 line-through' : isOverdue(todo) ? 'text-red-400' : 'text-gray-300'
              }`}
            >
              {todo.text}
            </h3>
          </div>
          
          {/* Due date */}
          {todo.dueDate && (
            <div className={`text-xs ml-6 mb-2 ${isOverdue(todo) ? 'text-red-400' : 'text-gray-500'}`}>
              {formatDate(todo.dueDate)}
              {todo.dueTime && ` at ${todo.dueTime}`}
            </div>
          )}
          
          {/* Deletion date for deleted tasks */}
          {filter === 'deleted' && todo.deletedAt && (
            <div className="text-xs ml-6 mb-2 text-gray-600">
              Deleted on {new Date(todo.deletedAt).toLocaleDateString()}
            </div>
          )}
          
          {/* Subtasks summary - only show for non-deleted tasks */}
          {filter !== 'deleted' && todo.subtasks && todo.subtasks.length > 0 && (
            <div className="ml-6 mb-2 space-y-1">
              <div className="text-xs flex items-center space-x-1">
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getPriorityColor(todo.priority).replace('border-', 'bg-')}`}
                    style={{ 
                      width: `${todo.subtasks.filter(st => st.completed).length / todo.subtasks.length * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-gray-500 whitespace-nowrap">
                  {todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}
                </span>
              </div>
              
              {/* Show first couple of subtasks (abbreviated) */}
              {todo.subtasks.length > 0 && (
                <div className="text-xs text-gray-500 pl-2 border-l border-dashed border-gray-700">
                  {todo.subtasks.slice(0, 2).map((subtask, index) => (
                    <div 
                      key={subtask.id}
                      className={`truncate ${subtask.completed ? 'line-through text-gray-600' : ''}`}
                    >
                      • {subtask.text}
                    </div>
                  ))}
                  {todo.subtasks.length > 2 && (
                    <div className="text-gray-600 italic">
                      +{todo.subtasks.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Bottom toolbar */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
            {/* Points - only show for non-deleted tasks */}
            {filter !== 'deleted' && (
              <div className="text-xs text-gray-600">
                {todo.points || 0} pts
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {filter === 'deleted' ? (
                // Show restore and permanent delete buttons for deleted todos
                <>
                  <button
                    onClick={() => restoreTodo(todo.id)}
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-green-400"
                    aria-label="Restore task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)} // This will call permanentlyDeleteTodo due to our logic in TodoList
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500"
                    aria-label="Permanently delete task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              ) : (
                // Show existing buttons for normal todos
                <>
                  {todo.notes && todo.notes.trim() !== '' && (
                    <button
                      onClick={() => openNoteView(todo)}
                      className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-300"
                      aria-label="View notes"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(todo)}
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-300"
                    aria-label="Edit task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500"
                    aria-label="Delete task"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TodoGrid;