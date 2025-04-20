import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { getCalendarDays, getWeekDays, isSameDay, formatDate, getTodayStart } from '../utils/dateUtils';
import { Task } from '../types';
import TaskForm from './TaskForm';

interface CalendarEventProps {
  task: Task;
  onClick: () => void;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ task, onClick }) => {
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        px-2 py-1 rounded-sm mb-1 truncate text-xs cursor-pointer
        ${task.status === 'completed' ? 'bg-gray-300 line-through' : 'bg-blue-100 text-blue-800'}
        hover:opacity-90 transition-opacity
      `}
    >
      <div className="flex items-center">
        <span className={`w-2 h-2 rounded-full ${getPriorityColor()} mr-1`}></span>
        {task.title}
      </div>
    </div>
  );
};

const CalendarView: React.FC = () => {
  const today = getTodayStart();
  const [currentDate, setCurrentDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  
  const { tasks, getTasksByDate } = useTaskContext();
  const calendarDays = getCalendarDays(currentYear, currentMonth);
  const weekDays = getWeekDays(true);
  
  const goToPreviousMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTaskClick = (task: Task) => {
    setTaskToEdit(task);
    setShowTaskForm(true);
  };

  const handleAddTask = () => {
    setTaskToEdit(undefined);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setTaskToEdit(undefined);
  };

  const getTasksForDay = (date: Date): Task[] => {
    return getTasksByDate(date.toISOString());
  };

  return (
    <div className="h-full flex flex-col">
      {/* Calendar header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {formatDate(new Date(currentYear, currentMonth, 1), 'monthYear')}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={goToPreviousMonth}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNextMonth} 
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="flex-grow grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map((day, index) => (
          <div key={index} className="text-center font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = day.getMonth() === currentMonth;
          const tasksForDay = getTasksForDay(day);
          
          return (
            <div 
              key={index}
              onClick={() => handleDayClick(day)}
              className={`
                min-h-[100px] p-1 border border-gray-200 transition-all
                ${isToday ? 'bg-blue-50' : ''}
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
                ${!isCurrentMonth ? 'opacity-40' : ''}
                hover:bg-gray-50 cursor-pointer
              `}
            >
              <div className="text-right font-medium p-1">
                <span className={`text-sm inline-flex justify-center items-center
                  ${isToday ? 'bg-blue-500 text-white w-6 h-6 rounded-full' : ''}
                `}>
                  {day.getDate()}
                </span>
              </div>
              
              {/* Tasks for this day */}
              <div className="mt-1 overflow-y-auto max-h-[calc(100%-28px)]">
                {tasksForDay.map(task => (
                  <CalendarEvent 
                    key={task.id} 
                    task={task}
                    onClick={() => handleTaskClick(task)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Selected day details */}
      {selectedDate && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{formatDate(selectedDate, 'full')}</h3>
            <button
              onClick={handleAddTask}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Task
            </button>
          </div>
          
          {getTasksForDay(selectedDate).length > 0 ? (
            <div>
              {getTasksForDay(selectedDate).map(task => (
                <div 
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="p-2 bg-white rounded-md mb-2 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      task.priority === 'high' ? 'bg-red-500' : 
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                      {task.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No tasks for this day</p>
          )}
        </div>
      )}
      
      {/* Task form */}
      {showTaskForm && (
        <TaskForm
          initialTask={taskToEdit}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default CalendarView;