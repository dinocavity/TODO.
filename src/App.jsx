import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/layout/Header';
import ShortcutsPanel from './components/fragments/ShortcutsPanel';
import RewardsPanel from './components/fragments/RewardsPanel';
import TaskForm from './components/TaskForm';
import FilterTabs from './components/fragments/FilterTabs';
import TodoList from './components/TodoList';
import Footer from './components/layout/Footer';
import ViewToggle from './components/fragments/ViewToggle';
import Modal from './components/Modal';
import MMRRating from './components/fragments/MMRRating';

// Import all custom hooks 
import {
  useLocalStorage,
  useOverdueTasks,
  useLayoutMode,
  useKeyboardShortcuts,
  useLevelSystem,
  useTodoManagement,
  useViewMode,
  useFilteredTodos
} from './hooks/index.js';

const App = () => {
  // Persistent state using localStorage hooks
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [deletedTodos, setDeletedTodos] = useLocalStorage('deletedTodos', []);
  const [overdueTodos, setOverdueTodos] = useLocalStorage('overdueTodos', []);
  const [points, setPoints] = useLocalStorage('points', 0);
  const [mmr, setMMR] = useLocalStorage('mmr', 0);
  const [level, setLevel] = useState(1); // User level state

  // UI-related state variables
  const [showForm, setShowForm] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMmrModal, setShowMmrModal] = useState(false);
  const [filter, setFilter] = useState('all'); // Task filter state
  const [editingId, setEditingId] = useState(null); // Track editing task ID
  const [expandedId, setExpandedId] = useState(null); // Track expanded task ID

  // Using custom hooks for additional functionalities
  const layoutMode = useLayoutMode(); // Manages layout styles (compact, expanded, etc.)
  const { viewMode, setViewMode, activeNote, setActiveNote, openNoteView, closeNoteView } = useViewMode('list');

  // Check overdue tasks and update state accordingly
  const { isOverdue } = useOverdueTasks(todos, overdueTodos, setOverdueTodos, setMMR);

  // Manage leveling system based on points and MMR
  useLevelSystem(points, mmr, level, setLevel, setMMR);

  // Custom hook to handle CRUD operations for todos
  const {
    handleSubmit,
    startEdit,
    updateNote,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    toggleExpand,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    getEditingTodo,
    restoreTodo,
    permanentlyDeleteTodo
  } = useTodoManagement(
    todos, setTodos, deletedTodos, setDeletedTodos, points, setPoints,
    mmr, setMMR, expandedId, setExpandedId, editingId, setEditingId, setShowForm
  );

  // Custom hook for filtering todos
  const {
    filteredTodos,
    filteredDeletedTodos,
    activeTodoCount,
    overdueTodoCount,
    deletedTodoCount
  } = useFilteredTodos(todos, overdueTodos, deletedTodos, filter);

  // Handle keyboard shortcuts for quick actions
  useKeyboardShortcuts({
    showForm, setShowForm, showRewards, setShowRewards, expandedId, setExpandedId,
    showInfoModal, setShowInfoModal, showMmrModal, setShowMmrModal, todos, viewMode,
    setViewMode, filter, setFilter, editingId, setEditingId, activeNote, setActiveNote,
    clearCompleted
  });

  // Determines the container's width based on layout mode
  const getContainerClass = () => {
    switch(layoutMode) {
      case 'compact': return 'w-full max-w-sm px-2';
      case 'expanded': return 'w-full max-w-2xl px-4';
      default: return 'w-full max-w-md px-3';
    }
  };

  return (
    <motion.div 
      className={`min-h-screen bg-black text-white flex items-center justify-center p-4 ${layoutMode}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className={getContainerClass()}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.2 }}>
        
        {/* Header component displaying user level, points, and MMR */}
        <Header 
          level={level}
          points={points}
          mmr={mmr}
          showInfoModal={() => setShowInfoModal(true)}
          showMmrModal={() => setShowMmrModal(true)}
          showRewards={showRewards}
          setShowRewards={setShowRewards}
          layoutMode={layoutMode}
        />
        
        {/* Information modal displaying shortcut keys */}
        <Modal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)}>
          <ShortcutsPanel 
            layoutMode={layoutMode} 
            level={level} 
            onClose={() => setShowInfoModal(false)} 
          />
        </Modal>
        
        {/* MMR Rating modal */}
        <Modal isOpen={showMmrModal} onClose={() => setShowMmrModal(false)}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-light text-gray-300">MMR Rating System</h2>
              <motion.button
                onClick={() => setShowMmrModal(false)}
                className="text-gray-500 hover:text-gray-300 text-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>
            <MMRRating mmr={mmr} layoutMode={layoutMode} />
          </div>
        </Modal>

        {/* Rewards panel */}
        {showRewards && (
          <RewardsPanel level={level} points={points} layoutMode={layoutMode} />
        )}
        
        {/* Trigger button to open the task form */}
        <motion.div 
          className="mb-8 border-b border-gray-900 pb-2 group cursor-text"
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.01, borderColor: '#4B5563' }}
          whileTap={{ scale: 0.98 }}
        >
          <span>+ Add a new task</span>
        </motion.div>
        
        {/* Task form modal */}
        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <TaskForm
            showForm={showForm}
            setShowForm={setShowForm}
            handleSubmit={handleSubmit}
            editingTodo={getEditingTodo()}
            showInfoModal={showInfoModal}
            layoutMode={layoutMode}
          />
        </Modal>

        {/* View toggle and filter tabs */}
        <div className="mb-4 flex justify-between items-center">
          <FilterTabs filter={filter} setFilter={setFilter} overdueTodoCount={overdueTodoCount} deletedTodoCount={deletedTodoCount} />
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        
        {/* Todo list based on filter */}
        <TodoList
          todos={filter === 'deleted' ? filteredDeletedTodos : filteredTodos}
          viewMode={viewMode}
          filter={filter}
          expandedId={expandedId}
          toggleExpand={toggleExpand}
          toggleTodo={toggleTodo}
          startEdit={startEdit}
          deleteTodo={deleteTodo}
          restoreTodo={restoreTodo}
          permanentlyDeleteTodo={permanentlyDeleteTodo}
          addSubtask={addSubtask}
          toggleSubtask={toggleSubtask}
          deleteSubtask={deleteSubtask}
          openNoteView={openNoteView}
          layoutMode={layoutMode}
          isOverdue={isOverdue}
        />
        
        {/* Footer displaying active task count */}
        <Footer
          activeTodoCount={activeTodoCount}
          hasCompletedTodos={todos.some(todo => todo.completed)}
          clearCompleted={clearCompleted}
          layoutMode={layoutMode}
        />
      </motion.div>
    </motion.div>
  );
};

export default App;