import React, { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import Header from './components/Header';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';

function App() {
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header 
          activeView={activeView} 
          onViewChange={setActiveView} 
        />
        
        <main className="flex-grow p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto h-full">
            {activeView === 'list' ? (
              <TaskList />
            ) : (
              <CalendarView />
            )}
          </div>
        </main>
      </div>
    </TaskProvider>
  );
}

export default App;