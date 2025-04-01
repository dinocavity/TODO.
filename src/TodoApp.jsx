// TodoApp.jsx - Main component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ShortcutsPanel from './components/ShortcutsPanel';
import RewardsPanel from './components/RewardsPanel';
import TaskForm from './components/TaskForm';
import FilterTabs from './components/FilterTabs';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import ViewToggle from './components/ViewToggle';
import Modal from './components/Modal';
import MMRRating from './components/MMRRating';

const TodoApp = () => {
  // Main states
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  const [deletedTodos, setDeletedTodos] = useState(() => {
    const savedDeletedTodos = localStorage.getItem('deletedTodos');
    return savedDeletedTodos ? JSON.parse(savedDeletedTodos) : [];
  });
  
  const [overdueTodos, setOverdueTodos] = useState(() => {
    const savedOverdueTodos = localStorage.getItem('overdueTodos');
    return savedOverdueTodos ? JSON.parse(savedOverdueTodos) : [];
  });
  
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints) : 0;
  });
  
  const [mmr, setMMR] = useState(() => {
    const savedMMR = localStorage.getItem('mmr');
    return savedMMR ? parseInt(savedMMR) : 0;
  });
  
  const [level, setLevel] = useState(1);
  
  // UI states
  const [showForm, setShowForm] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMmrModal, setShowMmrModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid', or 'note'
  const [activeNote, setActiveNote] = useState(null);
  const [layoutMode, setLayoutMode] = useState('default'); // 'default', 'compact', 'expanded'
  
  // Check if a task is overdue
  const isOverdue = (todoId) => {
    return overdueTodos.some(todo => todo.id === todoId);
  };
  
  // Calculate level based on points and check for level deranking
  useEffect(() => {
    const newLevel = Math.floor(points / 100) + 1;
    
    // Special case for highest level - can be deranked if MMR drops below 0
    if (level === 10 && mmr < 0) {
      setLevel(9); // Derank to level 9
      setMMR(100); // Reset MMR to a positive value
    } else {
      setLevel(newLevel);
    }
  }, [points, mmr, level]);
  
  // Check for overdue tasks
  useEffect(() => {
    const checkForOverdueTasks = () => {
      const now = new Date();
      let isChanged = false;
      
      todos.forEach(todo => {
        if (!todo.completed && todo.dueDate) {
          const dueDate = new Date(todo.dueDate);
          
          if (todo.dueTime) {
            const [hours, minutes] = todo.dueTime.split(':');
            dueDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
          } else {
            dueDate.setHours(23, 59, 59);
          }
          
          // Check if the task is overdue and not already in overdueTodos
          if (now > dueDate && !overdueTodos.some(t => t.id === todo.id)) {
            // Add the task to overdueTodos
            setOverdueTodos(prev => [...prev, { 
              id: todo.id, 
              text: todo.text, 
              priority: todo.priority,
              dueDate: todo.dueDate,
              dueTime: todo.dueTime,
              becameOverdueAt: now.toISOString() 
            }]);
            
            // Decrease MMR for overdue task
            setMMR(currentMMR => Math.max(-100, currentMMR - 30));
            
            isChanged = true;
          }
        }
      });
      
      return isChanged;
    };
    
    // Check immediately
    checkForOverdueTasks();
    
    // Check every minute
    const intervalId = setInterval(checkForOverdueTasks, 60000);
    
    return () => clearInterval(intervalId);
  }, [todos, overdueTodos]);
  
  // Save todos, deleted todos, overdue todos, points, and mmr to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  
  useEffect(() => {
    localStorage.setItem('deletedTodos', JSON.stringify(deletedTodos));
  }, [deletedTodos]);
  
  useEffect(() => {
    localStorage.setItem('overdueTodos', JSON.stringify(overdueTodos));
  }, [overdueTodos]);
  
  useEffect(() => {
    localStorage.setItem('points', points.toString());
  }, [points]);
  
  useEffect(() => {
    localStorage.setItem('mmr', mmr.toString());
  }, [mmr]);
  
  // Detect screen size and set layout mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setLayoutMode('compact');
      } else if (window.innerWidth > 1024) {
        setLayoutMode('expanded');
      } else {
        setLayoutMode('default');
      }
    };
    
    // Set initial layout mode
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case 'n': // New task
          if (viewMode !== 'note') {
            setShowForm(true);
          }
          break;
        case 'a': // All tasks
          setFilter('all');
          break;
        case 'c': // Completed tasks
          setFilter('completed');
          break;
        case 'v': // Active tasks (using 'v' since 'a' is already used)
          setFilter('active');
          break;
        case 'o': // Overdue tasks
          setFilter('overdue');
          break;
        case 'd': // Deleted tasks
          setFilter('deleted');
          break;
        case 'g': // Toggle grid/list view
          setViewMode(viewMode === 'list' ? 'grid' : 'list');
          break;
        case 'r': // Toggle rewards
          setShowRewards(!showRewards);
          break;
        case 'i': // Show info modal
          setShowInfoModal(true);
          break;
        case 'm': // Show MMR modal
          setShowMmrModal(true);
          break;
        case 'x': // Clear completed
          if (todos.some(todo => todo.completed) && viewMode !== 'note') {
            clearCompleted();
          }
          break;
        case 'l': // Toggle view mode
          if (viewMode === 'note') {
            closeNoteView();
          }
          break;
        case 'escape': // Close modals/forms
          if (viewMode === 'note') {
            closeNoteView();
          } else {
            if (showForm) {
              setShowForm(false);
              setEditingId(null);
            }
            if (expandedId) {
              setExpandedId(null);
            }
            if (showInfoModal) {
              setShowInfoModal(false);
            }
            if (showMmrModal) {
              setShowMmrModal(false);
            }
          }
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showForm, showRewards, expandedId, showInfoModal, showMmrModal, todos, viewMode]);
  
  // Handle task submission
  const handleSubmit = (task) => {
    if (editingId) {
      // Update existing todo
      setTodos(
        todos.map(todo => 
          todo.id === editingId ? {
            ...todo,
            text: task.text,
            dueDate: task.dueDate,
            dueTime: task.dueTime,
            priority: task.priority,
            subtasks: task.subtasks || todo.subtasks || []
          } : todo
        )
      );
      setEditingId(null);
    } else {
      // Create new todo
      const newTodo = {
        id: Date.now(),
        text: task.text,
        completed: false,
        dueDate: task.dueDate,
        dueTime: task.dueTime,
        priority: task.priority,
        subtasks: task.subtasks || [],
        notes: "",
        points: task.priority === 'high' ? 15 : (task.priority === 'medium' ? 10 : 5)
      };
      
      setTodos([...todos, newTodo]);
    }
    
    setShowForm(false);
  };
  
  // Start editing a todo
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setShowForm(true);
  };
  
  // Handle note editing
  const updateNote = (todoId, noteText) => {
    setTodos(
      todos.map(todo => 
        todo.id === todoId ? {
          ...todo,
          notes: noteText
        } : todo
      )
    );
  };
  
  // Open note view
  const openNoteView = (todo) => {
    setActiveNote(todo.id);
    setViewMode('note');
  };
  
  // Return to previous view
  const closeNoteView = () => {
    setViewMode(viewMode === 'note' ? 'list' : viewMode);
    setActiveNote(null);
  };
  
  // Toggle todo completion status
  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          // Award points and MMR when completing a task
          if (!todo.completed) {
            // Award base points
            const basePoints = todo.points || 0;
            const bonusPoints = todo.subtasks.every(st => st.completed) ? 5 : 0;
            setPoints(points + basePoints + bonusPoints);
            
            // Check if task is overdue
            const isTaskOverdue = overdueTodos.some(t => t.id === id);
            
            // Award MMR based on priority if not overdue
            if (!isTaskOverdue) {
              const mmrGain = todo.priority === 'high' ? 20 : 
                             todo.priority === 'medium' ? 10 : 5;
              setMMR(currentMMR => currentMMR + mmrGain);
            }
          }
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };
  
  // Delete a todo
  const deleteTodo = (id) => {
    // Find the todo before deleting it
    const todoToDelete = todos.find(todo => todo.id === id);
    
    // Remove from todos list
    setTodos(todos.filter(todo => todo.id !== id));
    
    // Add to deleted todos list if not completed
    if (todoToDelete && !todoToDelete.completed) {
      setDeletedTodos(prev => [...prev, {
        id: todoToDelete.id,
        text: todoToDelete.text,
        priority: todoToDelete.priority,
        dueDate: todoToDelete.dueDate,
        dueTime: todoToDelete.dueTime,
        deletedAt: new Date().toISOString()
      }]);
      
      // Decrease MMR for deleted task
      setMMR(currentMMR => currentMMR - 15);
    }
    
    // Clean up UI state
    if (expandedId === id) setExpandedId(null);
    if (editingId === id) {
      setEditingId(null);
      setShowForm(false);
    }
  };
  
  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };
  
  // Toggle expanded view for a todo
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  // Add a subtask
  const addSubtask = (todoId, subtaskText) => {
    if (!subtaskText.trim()) return;
    
    setTodos(
      todos.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: [
              ...todo.subtasks,
              {
                id: Date.now(),
                text: subtaskText,
                completed: false
              }
            ]
          };
        }
        return todo;
      })
    );
  };
  
  // Toggle subtask completion
  const toggleSubtask = (todoId, subtaskId) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: todo.subtasks.map(subtask => {
              if (subtask.id === subtaskId) {
                if (!subtask.completed) {
                  setPoints(points + 2);
                }
                return { ...subtask, completed: !subtask.completed };
              }
              return subtask;
            })
          };
        }
        return todo;
      })
    );
  };
  
  // Delete a subtask
  const deleteSubtask = (todoId, subtaskId) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: todo.subtasks.filter(subtask => subtask.id !== subtaskId)
          };
        }
        return todo;
      })
    );
  };
  
  // Filter todos based on filters
  const filteredTodos = todos.filter(todo => {
    // Ensure every todo has a subtasks array
    if (!todo.subtasks) todo.subtasks = [];
    
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    if (filter === 'overdue') return overdueTodos.some(t => t.id === todo.id);
    return true;
  });
  
  // Get filtered deleted todos
  const filteredDeletedTodos = filter === 'deleted' ? deletedTodos : [];
  
  // Counts for different types of tasks
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const overdueTodoCount = overdueTodos.filter(t => !todos.find(todo => todo.id === t.id)?.completed).length;
  const deletedTodoCount = deletedTodos.length;
  
  // Get the editing todo object
  const getEditingTodo = () => {
    if (!editingId) return null;
    return todos.find(todo => todo.id === editingId);
  };
  
  // Main app container class based on layout mode
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
        {/* Header with level indicator and shortcuts */}
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
        
        {/* Information modal */}
        <Modal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)}>
          <ShortcutsPanel 
            layoutMode={layoutMode} 
            level={level} 
            onClose={() => setShowInfoModal(false)} 
          />
        </Modal>
        
        {/* MMR modal */}
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
        
        {/* Task form trigger */}
        <motion.div 
          className="mb-8 border-b border-gray-900 pb-2 group cursor-text"
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.01, borderColor: '#4B5563' }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-gray-600 group-hover:text-gray-500 transition-colors duration-300 flex items-center">
            <span>+ Add a new task</span>
            {showInfoModal && <span className="ml-2 text-gray-800 text-xs">[N]</span>}
          </div>
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
        
        {/* View toggle (List/Grid) */}
        <div className="mb-4 flex justify-between items-center">
          <FilterTabs 
            filter={filter} 
            setFilter={setFilter} 
            showInfoModal={showInfoModal}
            overdueTodoCount={overdueTodoCount}
            deletedTodoCount={deletedTodoCount}
          />
          
          <ViewToggle 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            showInfoModal={showInfoModal}
          />
        </div>
        
        {/* Todo list/grid */}
        <div className="mb-6">
          {filter === 'deleted' ? (
            <div className="space-y-2">
              {filteredDeletedTodos.length > 0 ? (
                <ul className="space-y-2">
                  {filteredDeletedTodos.map(todo => (
                    <li key={todo.id} className="flex items-center bg-gray-900 bg-opacity-20 p-3 rounded border-l-2 border-red-500">
                      <div className="flex-grow">
                        <div className="text-gray-400 line-through">{todo.text}</div>
                        <div className="text-xs text-gray-600">
                          Deleted {new Date(todo.deletedAt).toLocaleString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-8 text-center text-gray-600 italic">
                  No deleted tasks
                </div>
              )}
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              viewMode={viewMode}
              filter={filter}
              expandedId={expandedId}
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
          )}
        </div>
        
        {/* Footer */}
        <Footer
          activeTodoCount={activeTodoCount}
          hasCompletedTodos={todos.some(todo => todo.completed)}
          clearCompleted={clearCompleted}
          showInfoModal={showInfoModal}
          layoutMode={layoutMode}
        />
        
        {/* Vertical progress bar */}
        <div className="fixed top-0 left-0 h-full w-1">
          <div 
            className="bg-yellow-400 h-full transition-all duration-700 ease-out" 
            style={{ 
              transform: `scaleY(${todos.length > 0 ? (todos.length - activeTodoCount) / todos.length : 0})`,
              transformOrigin: 'bottom'
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TodoApp;