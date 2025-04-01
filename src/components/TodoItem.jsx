// components/TodoItem.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SubtaskList from './SubTaskList'; // Fixed casing of import

const TodoItem = ({
  todo,
  isExpanded,
  toggleExpand,
  toggleTodo,
  startEdit,
  deleteTodo,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  openNoteView,
  layoutMode,
  isOverdue
}) => {
  const [subtaskInput, setSubtaskInput] = useState('');
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-green-400';
      default: return 'bg-yellow-400';
    }
  };
  
  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Check if a task is overdue - use the prop first, then fallback to date check
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
  
  // Handle input keypress
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSubtask(todo.id, subtaskInput);
      setSubtaskInput('');
    }
  };
  
  // Submit subtask
  const handleAddSubtask = () => {
    addSubtask(todo.id, subtaskInput);
    setSubtaskInput('');
  };
  
  // Get font size based on layout mode
  const getFontClass = () => {
    switch(layoutMode) {
      case 'compact': return 'text-sm';
      case 'expanded': return 'text-lg';
      default: return 'text-base';
    }
  };
  
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className={`py-3 flex items-center group border-b border-gray-900 ${isExpanded ? 'bg-gray-900 bg-opacity-20' : ''}`}
        whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.2)' }}
      >
        {/* Priority indicator */}
        <div className={`${getPriorityColor(todo.priority)} w-1 h-5 rounded-full mr-2 ${todo.completed ? 'opacity-40' : ''}`} />
        
        {/* Checkbox */}
        <button
          onClick={() => toggleTodo(todo.id)}
          className={`w-4 h-4 rounded-full mr-3 border ${
            todo.completed ? 'bg-yellow-400 border-yellow-400' : 'border-gray-600'
          }`}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        />
        
        {/* Content */}
        <div className="flex-grow min-w-0 cursor-pointer" onClick={() => toggleExpand(todo.id)}>
          <div className="flex items-center">
            <span 
              className={`truncate ${getFontClass()} ${todo.completed ? 'text-gray-600 line-through' : checkIfOverdue(todo) ? 'text-red-400' : 'text-gray-300'}`}
            >
              {todo.text}
            </span>
            
            {todo.subtasks && todo.subtasks.length > 0 && (
              <span className="ml-2 text-xs bg-gray-900 px-1 rounded text-gray-500">
                {todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}
              </span>
            )}
            
            {todo.notes && todo.notes.trim() !== '' && (
              <span className="ml-1 text-yellow-400 text-xs">•</span>
            )}
          </div>
          
          {todo.dueDate && (
            <div className={`text-xs ${checkIfOverdue(todo) ? 'text-red-400' : 'text-gray-500'}`}>
              {formatDate(todo.dueDate)}
              {todo.dueTime && ` at ${todo.dueTime}`}
              {checkIfOverdue(todo) && ' (Overdue)'}
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
          {todo.notes && (
            <button
              onClick={() => openNoteView(todo)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-300"
              aria-label="View notes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <button
            onClick={() => startEdit(todo)}
            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-300"
            aria-label="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-red-500"
            aria-label="Delete task"
          >
            ×
          </button>
        </div>
      </motion.div>
      
      {/* Expanded section with subtasks */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="py-2 px-9 bg-gray-900 bg-opacity-10 space-y-2 text-sm overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Subtask list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <SubtaskList 
                subtasks={todo.subtasks || []} 
                mainTaskPriority={todo.priority || 'medium'}
                mainTaskCompleted={todo.completed}
                toggleSubtask={(subtaskId) => toggleSubtask(todo.id, subtaskId)}
                deleteSubtask={(subtaskId) => deleteSubtask(todo.id, subtaskId)}
              />
            </motion.div>
            
            {/* Add subtask form */}
            <motion.div 
              className="flex text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="text"
                className="flex-grow py-1 bg-transparent border-b border-gray-800 focus:outline-none text-gray-400 placeholder-gray-700"
                placeholder="Add a subtask..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <motion.button
                type="button"
                onClick={handleAddSubtask}
                className="ml-2 px-2 py-1 text-yellow-400"
                aria-label="Add subtask"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                +
              </motion.button>
            </motion.div>
            
            {/* Points info */}
            <motion.div 
              className="text-right text-xs text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {todo.points || 0} pts
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

export default TodoItem;