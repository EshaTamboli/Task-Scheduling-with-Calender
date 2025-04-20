// Task status options
export type TaskStatus = 'todo' | 'inProgress' | 'completed';

// Task priority options
export type TaskPriority = 'low' | 'medium' | 'high';

// Main Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO string format
  category: string;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
}

// Calendar view types
export type CalendarViewType = 'month' | 'week' | 'day';

// Context types
export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByDate: (date: string) => Task[];
  filterTasks: (status?: TaskStatus, priority?: TaskPriority, category?: string, searchTerm?: string) => Task[];
}