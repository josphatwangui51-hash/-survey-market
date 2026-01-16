
import React from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: Page.DASHBOARD, label: 'Dash' },
    { id: Page.SURVEYS, label: 'Surveys' },
    { id: Page.WITHDRAW, label: 'Withdraw' },
    { id: Page.PROFILE, label: 'Profile' },
    { id: Page.HELP, label: 'Help' },
  ];

  return (
    <nav className="bg-blue-600 p-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="max-w-4xl mx-auto flex gap-2 justify-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              currentPage === item.id 
                ? 'bg-white text-blue-700 shadow-sm' 
                : 'text-white hover:bg-blue-500'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
