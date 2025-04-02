// components/TaskForm.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskForm = ({
  showForm,
  setShowForm,
  handleSubmit,
  editingTodo,
  showInfoModal,
  layoutMode
}) => {
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [showSubtasks, setShowSubtasks] = useState(false);

  // Set form values when editing a todo
  useEffect(() => {
    if (editingTodo) {
      setInputValue(editingTodo.text || '');
      setDueDate(editingTodo.dueDate || '');
      setDueTime(editingTodo.dueTime || '');
      setPriority(editingTodo.priority || 'medium');
      setSubtasks(editingTodo.subtasks || []);
      // Show subtasks section if there are subtasks
      if (editingTodo.subtasks && editingTodo.subtasks.length > 0) {
        setShowSubtasks(true);
      }
    } else {
      setInputValue('');
      setDueDate('');
      setDueTime('');
      setPriority('medium');
      setSubtasks([]);
      setShowSubtasks(false);
    }
  }, [editingTodo]);

  // Get priority color
  const getPriorityColor = (p) => {
    switch (p) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-green-400';
      default: return 'bg-yellow-400';
    }
  };

  // Get responsive form classes
  const getFormClasses = () => {
    switch (layoutMode) {
      case 'compact':
        return {
          container: 'space-y-3',
          inputText: 'text-sm',
          inputDate: 'text-xs',
          buttons: 'text-xs py-1'
        };
      case 'expanded':
        return {
          container: 'space-y-5',
          inputText: 'text-lg',
          inputDate: 'text-base',
          buttons: 'text-base py-3'
        };
      default:
        return {
          container: 'space-y-4',
          inputText: 'text-base',
          inputDate: 'text-sm',
          buttons: 'text-sm py-2'
        };
    }
  };

  const formClasses = getFormClasses();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    handleSubmit({
      text: inputValue,
      dueDate,
      dueTime,
      priority,
      subtasks
    });
  };

  // Handle adding subtasks
  const addSubtask = () => {
    if (!subtaskInput.trim()) return;

    const newSubtask = {
      id: Date.now(),
      text: subtaskInput,
      completed: false
    };

    setSubtasks([...subtasks, newSubtask]);
    setSubtaskInput('');
  };

  // Handle removing subtasks
  const removeSubtask = (id) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  // Handle subtask key press (Enter to add)
  const handleSubtaskKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubtask();
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setInputValue('');
    setDueDate('');
    setDueTime('');
    setPriority('medium');
  };

  // We'll use the modal for our form, so just return the form content
  return (
    <div className="p-6">
      <h2 className="text-xl font-light text-gray-300 mb-4">
        {editingTodo ? 'Edit Task' : 'Add New Task'}
      </h2>

      <form onSubmit={onSubmit} className={formClasses.container}>
        <div>
          <motion.input
            type="text"
            className={`w-full p-2 bg-transparent focus:outline-none text-gray-300 placeholder-gray-600 border-b border-gray-700 ${formClasses.inputText}`}
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            autoFocus
          />
        </div>

        <motion.div
          className="grid grid-cols-3 gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="date"
            className={`col-span-2 p-2 bg-transparent border-b border-gray-700 focus:outline-none text-gray-400 placeholder-gray-700 ${formClasses.inputDate}`}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Due date"
          />
          <input
            type="time"
            className={`p-2 bg-transparent border-b border-gray-700 focus:outline-none text-gray-400 placeholder-gray-700 ${formClasses.inputDate}`}
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </motion.div>

        <motion.div
          className="flex space-x-1 text-xs"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {['low', 'medium', 'high'].map((p) => (
            <motion.button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`py-1 px-2 rounded uppercase ${priority === p
                ? `${getPriorityColor(p)} bg-opacity-20 border border-${p === 'high' ? 'red' : p === 'medium' ? 'yellow' : 'green'}-400`
                : 'bg-gray-900 text-gray-500'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {p}
            </motion.button>
          ))}
        </motion.div>

        {/* Subtasks section toggle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <motion.button
            type="button"
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="bg-yellow-400 text-gray-900 flex items-center py-1 px-3 rounded text-xs"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {showSubtasks ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 15l7-7 7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              )}
            </svg>
            {showSubtasks ? 'Hide Subtasks' : 'Add Subtasks'}
          </motion.button>
        </motion.div>

        {/* Subtasks input and list */}
        <AnimatePresence>
          {showSubtasks && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <motion.div
                className="space-y-2 p-2 rounded bg-gray-900 bg-opacity-40 border border-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-xs text-gray-400 mb-1">
                  {subtasks.length > 0
                    ? `${subtasks.length} subtask${subtasks.length > 1 ? 's' : ''}`
                    : 'Break down your task into smaller steps'}
                </div>

                {/* Subtasks list */}
                {subtasks.length > 0 && (
                  <ul className="space-y-1 ml-1 pl-3 border-l border-dashed border-gray-700">
                    {subtasks.map((subtask) => (
                      <motion.li
                        key={subtask.id}
                        className="flex items-center group text-xs bg-gray-900 bg-opacity-30 p-1 rounded"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="flex-grow text-gray-400">
                          {subtask.text}
                        </span>
                        <motion.button
                          type="button"
                          onClick={() => removeSubtask(subtask.id)}
                          className="text-gray-500 hover:text-red-400 w-5 h-5 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ×
                        </motion.button>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {/* New subtask input */}
                <div className="flex text-xs">
                  <input
                    type="text"
                    className="flex-grow py-1 px-2 bg-gray-800 rounded-l border-b border-gray-700 focus:outline-none text-gray-300 placeholder-gray-600"
                    placeholder="Add a subtask..."
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyPress={handleSubtaskKeyPress}
                  />
                  <motion.button
                    type="button"
                    onClick={addSubtask}
                    className="bg-gray-800 text-yellow-400 py-1 px-2 rounded-r"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    +
                  </motion.button>
                </div>

                <div className="text-xs text-gray-600 italic">
                  Subtasks inherit the priority of the main task
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="flex space-x-2 pt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            type="submit"
            className={`flex-1 ${formClasses.buttons} bg-transparent border border-yellow-400 text-yellow-400 rounded hover:bg-yellow-400 hover:bg-opacity-10 transition-colors duration-300`}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(251, 191, 36, 0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            {editingTodo ? 'Update' : 'Add Task'}
          </motion.button>
          <motion.button
            type="button"
            onClick={cancelForm}
            className={`${formClasses.buttons} px-4 bg-transparent border border-gray-800 text-gray-500 rounded hover:bg-gray-900 transition-colors duration-300`}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(75, 85, 99, 0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};

export default TaskForm;