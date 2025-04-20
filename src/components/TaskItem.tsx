import React, { useState } from 'react';
import { Calendar, Clock, Edit, Trash2, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Task, TaskPriority } from '../types';
import { formatDate } from '../utils/dateUtils';
import { useTaskContext } from '../context/TaskContext';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useTaskContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = () => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    updateTask(task.id, { status: newStatus });
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'medium':
        return <AlertCircle className="text-yellow-500" size={16} />;
      case 'low':
        return <AlertCircle className="text-green-500" size={16} />;
    }
  };

  const getPriorityClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusIcon = () => {
    return task.status === 'completed' ? (
      <CheckCircle className="text-green-500 cursor-pointer" size={20} />
    ) : (
      <Circle className="text-gray-400 cursor-pointer" size={20} />
    );
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border p-4 mb-3 transition-all duration-300
        hover:shadow-md
        ${task.status === 'completed' ? 'opacity-70' : 'opacity-100'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Status toggle */}
        <div onClick={handleStatusChange} className="mt-1">
          {getStatusIcon()}
        </div>
        
        {/* Task content */}
        <div className="flex-grow" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityClass(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>
          
          {/* Task details (expandable) */}
          <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 mt-2' : 'max-h-0'}`}>
            {task.description && (
              <p className="text-gray-600 mb-3">{task.description}</p>
            )}
            
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(task.dueDate, 'short')}</span>
              </div>
              
              {task.category && (
                <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                  {task.category}
                </div>
              )}
            </div>
          </div>
          
          {/* Due date (always visible) */}
          {!isExpanded && (
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(task.dueDate, 'short')}</span>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2 ml-2">
          <button 
            onClick={() => onEdit(task)} 
            className="text-gray-500 hover:text-blue-500 transition-colors p-1"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => deleteTask(task.id)} 
            className="text-gray-500 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;