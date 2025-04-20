import React from 'react';
import { CheckSquare, Calendar, User, Settings } from 'lucide-react';

interface HeaderProps {
  activeView: 'list' | 'calendar';
  onViewChange: (view: 'list' | 'calendar') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckSquare className="text-blue-500" size={24} />
          <h1 className="text-xl font-bold">TaskFlow</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => onViewChange('list')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeView === 'list'
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckSquare size={18} />
              <span>Tasks</span>
            </div>
          </button>
          
          <button
            onClick={() => onViewChange('calendar')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeView === 'calendar'
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Calendar size={18} />
              <span>Calendar</span>
            </div>
          </button>
        </div>
        
        <div className="flex md:hidden">
          <button
            onClick={() => onViewChange('list')}
            className={`p-2 rounded-md ${
              activeView === 'list' ? 'bg-blue-100 text-blue-700' : ''
            }`}
          >
            <CheckSquare size={20} />
          </button>
          
          <button
            onClick={() => onViewChange('calendar')}
            className={`p-2 rounded-md ${
              activeView === 'calendar' ? 'bg-blue-100 text-blue-700' : ''
            }`}
          >
            <Calendar size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;