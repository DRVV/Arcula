'use client';

import clsx from 'clsx';
import HamburgerMenu from '@/components/HamburgerMenu';
import FilterPanel from '@/components/FilterPanel';

interface HeaderProps {
  filterOpen: boolean;
  toggleFilter: () => void;
  controlsVisible: boolean;
  toggleControls: () => void;
}

export default function Header({ filterOpen, toggleFilter, controlsVisible, toggleControls }: HeaderProps) {
  return (
    <header className="fixed top-0 z-50 w-full bg-gray-900 bg-opacity-70 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Chronoscape
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            <span className="bg-gray-800 px-2 py-1 rounded-md">1973 - 2024</span>
          </div>
          
          {/* Timeline Controls Button */}
          <button 
            onClick={toggleControls}
            className={clsx(
              'p-2 rounded-md text-gray-300 hover:text-white transition-colors',
              controlsVisible ? 'bg-blue-600' : 'hover:bg-gray-800'
            )}
            aria-label="Toggle timeline controls"
            title="Timeline Controls"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </button>
          
          {/* Search/Filter Button */}
          <div className="relative">
            <button 
              onClick={toggleFilter}
              className={clsx(
                'p-2 rounded-md text-gray-300 hover:text-white transition-colors',
                filterOpen ? 'bg-blue-600' : 'hover:bg-gray-800'
              )}
              aria-label="Search and filter"
              id="filter-button"
              aria-expanded={filterOpen}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
            
            {/* Filter Panel Dropdown */}
            {filterOpen && (
              <div 
                className="absolute right-0 mt-2 z-50 transition-all"
                role="menu"
                aria-labelledby="filter-button"
              >
                <FilterPanel inHeader={true} />
              </div>
            )}
          </div>
          
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}
