import { useState, useEffect, useMemo } from 'react';

// useLocalStorage hook
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

// useOverdueTasks hook
export const useOverdueTasks = (todos, overdueTodos, setOverdueTodos, setMMR) => {
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
  }, [todos, overdueTodos, setOverdueTodos, setMMR]);

  // Helper function to check if a task is overdue
  const isOverdue = (todoId) => {
    return overdueTodos.some(todo => todo.id === todoId);
  };

  return { isOverdue };
};

// useLayoutMode hook
export const useLayoutMode = () => {
  const [layoutMode, setLayoutMode] = useState('default');

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

  return layoutMode;
};

// useKeyboardShortcuts hook
export const useKeyboardShortcuts = ({
  showForm,
  setShowForm,
  showRewards,
  setShowRewards,
  expandedId,
  setExpandedId,
  showInfoModal,
  setShowInfoModal,
  showMmrModal, 
  setShowMmrModal,
  todos,
  viewMode,
  setViewMode,
  filter,
  setFilter,
  editingId,
  setEditingId,
  activeNote,
  setActiveNote,
  clearCompleted
}) => {
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
            setViewMode('list');
            setActiveNote(null);
          }
          break;
        case 'escape': // Close modals/forms
          if (viewMode === 'note') {
            setViewMode('list');
            setActiveNote(null);
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
  }, [
    showForm, 
    setShowForm, 
    showRewards, 
    setShowRewards, 
    expandedId, 
    setExpandedId, 
    showInfoModal, 
    setShowInfoModal, 
    showMmrModal, 
    setShowMmrModal, 
    todos, 
    viewMode, 
    setViewMode, 
    filter, 
    setFilter, 
    editingId, 
    setEditingId, 
    activeNote, 
    setActiveNote, 
    clearCompleted
  ]);
};

// useLevelSystem hook
export const useLevelSystem = (points, mmr, level, setLevel, setMMR) => {
  useEffect(() => {
    // Initialize MMR to 100 if it's 0 (for new users)
    if (mmr === 0) {
      setMMR(100);
    }
    
    const newLevel = Math.floor(points / 100) + 1;
    
    // Special case for highest level - can be deranked if MMR drops below 0
    if (level === 10 && mmr < 0) {
      setLevel(9); // Derank to level 9
      setMMR(100); // Reset MMR to a positive value
    } else {
      // Cap level at 10 (Mythic rank)
      setLevel(Math.min(newLevel, 10));
    }
  }, [points, mmr, level, setLevel, setMMR]);
};

// useTodoManagement hook
export const useTodoManagement = (
  todos, 
  setTodos, 
  deletedTodos, 
  setDeletedTodos, 
  points, 
  setPoints, 
  mmr, 
  setMMR, 
  expandedId, 
  setExpandedId, 
  editingId, 
  setEditingId, 
  setShowForm
) => {
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
            const isTaskOverdue = deletedTodos.some(t => t.id === id);
            
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

  // Get the editing todo object
  const getEditingTodo = () => {
    if (!editingId) return null;
    return todos.find(todo => todo.id === editingId);
  };
  
  /**
   * Restores a deleted todo back to the active todos list
   * @param {number} id - The ID of the deleted todo to restore
   */
  const restoreTodo = (id) => {
    // Find the deleted todo by ID
    const todoToRestore = deletedTodos.find(todo => todo.id === id);
    
    if (todoToRestore) {
      // Remove from deleted todos list
      setDeletedTodos(deletedTodos.filter(todo => todo.id !== id));
      
      // Add back to active todos list with default values for missing properties
      setTodos([...todos, {
        id: todoToRestore.id,
        text: todoToRestore.text,
        completed: false,
        dueDate: todoToRestore.dueDate,
        dueTime: todoToRestore.dueTime,
        priority: todoToRestore.priority || 'medium',
        subtasks: [],
        notes: "",
        points: todoToRestore.priority === 'high' ? 15 : 
                (todoToRestore.priority === 'medium' ? 10 : 5)
      }]);
      
      // Increase MMR (reverse the penalty that was applied when task was deleted)
      setMMR(currentMMR => currentMMR + 15);
    }
  };
  
  /**
   * Permanently removes a todo from the deleted todos list
   * @param {number} id - The ID of the deleted todo to permanently remove
   */
  const permanentlyDeleteTodo = (id) => {
    // Simply remove the todo from the deletedTodos array
    setDeletedTodos(deletedTodos.filter(todo => todo.id !== id));
  };

  return {
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
    restoreTodo,           // Add the new restore function
    permanentlyDeleteTodo  // Add the new permanent delete function
  };
};

// useViewMode hook
export const useViewMode = (initialMode = 'list') => {
  const [viewMode, setViewMode] = useState(initialMode);
  const [activeNote, setActiveNote] = useState(null);
  
  const openNoteView = (todo) => {
    setActiveNote(todo.id);
    setViewMode('note');
  };
  
  const closeNoteView = () => {
    setViewMode(viewMode === 'note' ? 'list' : viewMode);
    setActiveNote(null);
  };

  return {
    viewMode,
    setViewMode,
    activeNote,
    setActiveNote,
    openNoteView,
    closeNoteView
  };
};

// useFilteredTodos hook
export const useFilteredTodos = (todos, overdueTodos, deletedTodos, filter) => {
  // Use useMemo to avoid unnecessary recalculations
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // Ensure every todo has a subtasks array
      if (!todo.subtasks) todo.subtasks = [];
      
      if (filter === 'all') return true;
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      if (filter === 'overdue') return overdueTodos.some(t => t.id === todo.id);
      return true;
    });
  }, [todos, overdueTodos, filter]);
  
  // Get filtered deleted todos
  const filteredDeletedTodos = useMemo(() => {
    return filter === 'deleted' ? deletedTodos : [];
  }, [deletedTodos, filter]);
  
  // Calculate counts
  const activeTodoCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);
  
  const overdueTodoCount = useMemo(() => {
    return overdueTodos.filter(t => !todos.find(todo => todo.id === t.id)?.completed).length;
  }, [overdueTodos, todos]);
  
  const deletedTodoCount = useMemo(() => {
    return deletedTodos.length;
  }, [deletedTodos]);

  return {
    filteredTodos,
    filteredDeletedTodos,
    activeTodoCount,
    overdueTodoCount,
    deletedTodoCount
  };
};