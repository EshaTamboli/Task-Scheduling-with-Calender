import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { TaskStatus, TaskPriority, Task } from '../types';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList: React.FC = () => {
  const { tasks, filterTasks } = useTaskContext();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories from tasks
  const categories = [...new Set(tasks.map(task => task.category))].filter(Boolean);

  const filteredTasks = filterTasks(
    statusFilter,
    priorityFilter,
    categoryFilter,
    searchTerm
  );

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setCurrentTask(undefined);
  };

  const clearFilters = () => {
    setStatusFilter(undefined);
    setPriorityFilter(undefined);
    setCategoryFilter(undefined);
    setSearchTerm('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search and filter */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200 animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value as TaskStatus || undefined)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All</option>
                  <option value="todo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priorityFilter"
                  value={priorityFilter || ''}
                  onChange={(e) => setPriorityFilter(e.target.value as TaskPriority || undefined)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="categoryFilter"
                  value={categoryFilter || ''}
                  onChange={(e) => setCategoryFilter(e.target.value || undefined)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Task list */}
      <div className="flex-grow overflow-auto">
        {filteredTasks.length > 0 ? (
          <div>
            {filteredTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onEdit={handleEditTask} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No tasks found</p>
          </div>
        )}
      </div>
      
      {/* Add new task button */}
      <button
        onClick={() => setShowTaskForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 flex items-center justify-center transition-colors"
      >
        <Plus size={24} />
      </button>
      
      {/* Task form modal */}
      {showTaskForm && (
        <TaskForm 
          initialTask={currentTask} 
          onClose={handleCloseForm} 
        />
      )}
    </div>
  );
};

export default TaskList;