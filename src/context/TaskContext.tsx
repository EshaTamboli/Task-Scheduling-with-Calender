import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Task, TaskContextType, TaskStatus, TaskPriority } from '../types';
import { loadTasks, saveTasks, generateId } from '../utils/storageUtils';
import { isSameDay } from '../utils/dateUtils';

// Create the context with a default value
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider component
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = loadTasks();
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Add a new task
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Update an existing task
  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, ...updatedTask, updatedAt: new Date().toISOString() } 
          : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  // Get tasks for a specific date
  const getTasksByDate = (date: string) => {
    return tasks.filter(task => isSameDay(task.dueDate, date));
  };

  // Filter tasks based on status, priority, category, and search term
  const filterTasks = (
    status?: TaskStatus,
    priority?: TaskPriority,
    category?: string,
    searchTerm?: string
  ) => {
    return tasks.filter(task => {
      // Status filter
      if (status && task.status !== status) return false;
      
      // Priority filter
      if (priority && task.priority !== priority) return false;
      
      // Category filter
      if (category && task.category !== category) return false;
      
      // Search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)
        );
      }
      
      return true;
    });
  };

  const value: TaskContextType = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByDate,
    filterTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook to use the context
export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};