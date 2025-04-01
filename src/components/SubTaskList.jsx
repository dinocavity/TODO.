// components/SubtaskList.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SubtaskList = ({ subtasks, mainTaskPriority, mainTaskCompleted, toggleSubtask, deleteSubtask }) => {
  // Get priority color based on main task
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return { light: 'bg-red-400 bg-opacity-20', border: 'border-red-500' };
      case 'medium': return { light: 'bg-yellow-400 bg-opacity-20', border: 'border-yellow-500' };
      case 'low': return { light: 'bg-green-400 bg-opacity-20', border: 'border-green-500' };
      default: return { light: 'bg-yellow-400 bg-opacity-20', border: 'border-yellow-500' };
    }
  };
  
  const priorityColors = getPriorityColor(mainTaskPriority);
  
  if (subtasks.length === 0) {
    return (
      <div className="text-xs text-gray-600 italic">
        No subtasks for this task yet
      </div>
    );
  }
  
  return (
    <motion.div className="space-y-1">
      <div className="text-xs text-gray-500 mb-2 flex items-center">
        <div className={`w-2 h-2 rounded-full mr-1 ${priorityColors.border.replace('border-', 'bg-')}`}></div>
        <span>Subtasks inherit main task's priority</span>
      </div>
      <ul className="space-y-1 ml-1 pl-3 border-l border-dashed border-gray-700">
        <AnimatePresence initial={false}>
          {subtasks.map(subtask => (
            <motion.li 
              key={subtask.id} 
              className={`flex items-center group p-1 rounded ${priorityColors.light}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => toggleSubtask(subtask.id)}
                className={`w-3 h-3 rounded-full mr-2 border flex-shrink-0 ${
                  subtask.completed 
                    ? `bg-gray-600 border-gray-600` 
                    : `border-${priorityColors.border}`
                }`}
                aria-label={subtask.completed ? "Mark as incomplete" : "Mark as complete"}
              />
              <span 
                className={`flex-grow ${subtask.completed || mainTaskCompleted ? 'text-gray-600 line-through' : 'text-gray-400'}`}
              >
                {subtask.text}
              </span>
              <motion.button
                onClick={() => deleteSubtask(subtask.id)}
                className="w-5 h-5 flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100"
                aria-label="Delete subtask"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      
      <div className="flex justify-between text-xs text-gray-600 pt-1">
        <span>
          {subtasks.filter(st => st.completed).length}/{subtasks.length} completed
        </span>
        <span>
          {Math.round((subtasks.filter(st => st.completed).length / subtasks.length) * 100)}% done
        </span>
      </div>
    </motion.div>
  );
};

export default SubtaskList;