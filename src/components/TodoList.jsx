// components/TodoList.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TodoItem from './TodoItem';
import TodoGrid from './TodoGrid';

const TodoList = ({
  todos,
  viewMode,
  filter,
  expandedId,
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
  if (todos.length === 0) {
    return (
      <motion.div 
        className="py-8 text-center text-gray-600 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filter === 'all' ? 'Nothing to do' : `No ${filter} tasks`}
      </motion.div>
    );
  }
  
  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TodoGrid
          todos={todos}
          toggleTodo={toggleTodo}
          startEdit={startEdit}
          deleteTodo={deleteTodo}
          openNoteView={openNoteView}
          layoutMode={layoutMode}
          isOverdue={isOverdue}
        />
      </motion.div>
    );
  }
  
  return (
    <motion.ul 
      className="space-y-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isExpanded={expandedId === todo.id}
            toggleExpand={toggleExpand}
            toggleTodo={toggleTodo}
            startEdit={startEdit}
            deleteTodo={deleteTodo}
            addSubtask={addSubtask}
            toggleSubtask={toggleSubtask}
            deleteSubtask={deleteSubtask}
            openNoteView={openNoteView}
            layoutMode={layoutMode}
            isOverdue={isOverdue}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
};

export default TodoList;