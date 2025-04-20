import { Task } from '../types';

const TASKS_STORAGE_KEY = 'taskflow_tasks';

/**
 * Save tasks to local storage
 */
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

/**
 * Load tasks from local storage
 */
export const loadTasks = (): Task[] => {
  try {
    const tasksData = localStorage.getItem(TASKS_STORAGE_KEY);
    return tasksData ? JSON.parse(tasksData) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};