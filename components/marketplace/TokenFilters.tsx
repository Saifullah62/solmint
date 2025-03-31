'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ChevronDown, X, SlidersHorizontal } from 'lucide-react';

export interface FilterOptions {
  search: string;
  sortBy: 'price' | 'volume' | 'marketCap' | 'change';
  sortDirection: 'asc' | 'desc';
  priceRange: [number, number];
  categories: string[];
}

const defaultFilterOptions: FilterOptions = {
  search: '',
  sortBy: 'volume',
  sortDirection: 'desc',
  priceRange: [0, 1000],
  categories: []
};

interface TokenFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  availableCategories: string[];
}

export const TokenFilters = ({ onFilterChange, availableCategories }: TokenFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilterOptions);
  const [showFilters, setShowFilters] = useState(false);
  const [animateFilters, setAnimateFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  
  // Focus search input on component mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  // Handle click outside to close filters panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node) && showFilters) {
        setShowFilters(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);
  
  // Handle animation timing
  useEffect(() => {
    if (showFilters) {
      setAnimateFilters(true);
    } else {
      const timer = setTimeout(() => {
        setAnimateFilters(false);
      }, 300); // Match this with CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [showFilters]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    // If clicking the same sort option, toggle direction
    const sortDirection: 'asc' | 'desc' = filters.sortBy === sortBy && filters.sortDirection === 'desc' ? 'asc' : 'desc';
    const newFilters = { ...filters, sortBy, sortDirection };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleReset = () => {
    setFilters(defaultFilterOptions);
    onFilterChange(defaultFilterOptions);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="mb-6" ref={filtersRef}>
      <div className="flex flex-col md:flex-row gap-3 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={searchInputRef}
            placeholder="Search tokens by name or symbol"
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-9 bg-solmint-black border-solmint-blackLight text-white focus:border-solmint-violet focus:ring-1 focus:ring-solmint-violet"
            aria-label="Search tokens"
          />
          {filters.search && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => {
                const newFilters = { ...filters, search: '' };
                setFilters(newFilters);
                onFilterChange(newFilters);
                if (searchInputRef.current) {
                  searchInputRef.current.focus();
                }
              }}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          className="md:w-auto gap-2 relative"
          onClick={toggleFilters}
          aria-expanded={showFilters}
          aria-controls="filter-panel"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
          {filters.categories.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-solmint-violet text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {filters.categories.length}
            </span>
          )}
        </Button>
      </div>
      
      <div 
        id="filter-panel"
        className={`overflow-hidden transition-all duration-300 ${
          animateFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } ${showFilters ? 'mb-4' : ''}`}
        aria-hidden={!showFilters}
      >
        <div className="bg-solmint-blackLight border border-solmint-blackLight rounded-lg p-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">Filter Options</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
              onClick={handleReset}
              disabled={
                filters.search === '' && 
                filters.sortBy === defaultFilterOptions.sortBy && 
                filters.categories.length === 0
              }
            >
              Reset All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Sort By</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'volume', label: 'Volume' },
                  { id: 'price', label: 'Price' },
                  { id: 'marketCap', label: 'Market Cap' },
                  { id: 'change', label: 'Price Change' }
                ].map(option => (
                  <Button
                    key={option.id}
                    variant={filters.sortBy === option.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSortChange(option.id as FilterOptions['sortBy'])}
                    className="gap-1"
                    aria-pressed={filters.sortBy === option.id}
                  >
                    {option.label}
                    {filters.sortBy === option.id && (
                      <ChevronDown 
                        className={`h-3 w-3 transition-transform duration-200 ${filters.sortDirection === 'asc' ? 'rotate-180' : ''}`} 
                        aria-label={filters.sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                      />
                    )}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(category => (
                  <Button
                    key={category}
                    variant={filters.categories.includes(category) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryToggle(category)}
                    className={filters.categories.includes(category) ? 'gap-1' : ''}
                    aria-pressed={filters.categories.includes(category)}
                  >
                    {category}
                    {filters.categories.includes(category) && (
                      <X className="h-3 w-3 ml-1" aria-hidden="true" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {filters.categories.length > 0 && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-solmint-black scrollbar-track-transparent">
          <span className="text-sm text-gray-400 whitespace-nowrap">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map(category => (
              <div 
                key={category}
                className="bg-solmint-violet/20 text-solmint-violet text-xs rounded-full px-2 py-1 flex items-center gap-1 whitespace-nowrap"
              >
                {category}
                <button 
                  onClick={() => handleCategoryToggle(category)}
                  className="hover:bg-solmint-violet/10 rounded-full p-0.5"
                  aria-label={`Remove ${category} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {filters.categories.length > 0 && (
              <button 
                className="text-xs text-gray-400 hover:text-white whitespace-nowrap"
                onClick={() => {
                  const newFilters = { ...filters, categories: [] };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                aria-label="Clear all category filters"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
