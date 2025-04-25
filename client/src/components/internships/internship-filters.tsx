 import { useState } from "react";
import { Search } from "lucide-react";

interface InternshipFiltersProps {
  onSearch: (term: string) => void;
  onIndustryChange: (industry: string) => void;
  onLocationChange: (location: string) => void;
  onDurationChange: (duration: string) => void;
  selectedIndustry: string;
  selectedLocation: string;
  selectedDuration: string;
}

export default function InternshipFilters({ 
  onSearch, 
  onIndustryChange, 
  onLocationChange, 
  onDurationChange,
  selectedIndustry,
  selectedLocation,
  selectedDuration
}: InternshipFiltersProps) {
  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };
  
  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onIndustryChange(e.target.value);
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLocationChange(e.target.value);
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDurationChange(e.target.value);
  };
  
  return (
    <div className="mb-8 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
      <div className="flex-1">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search internships..."
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <select 
          className="block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          value={selectedIndustry}
          onChange={handleIndustryChange}
        >
          <option>All Industries</option>
          <option>Technology</option>
          <option>Finance</option>
          <option>Marketing</option>
          <option>Healthcare</option>
          <option>Education</option>
        </select>
        
        <select 
          className="block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          value={selectedLocation}
          onChange={handleLocationChange}
        >
          <option>All Locations</option>
          <option>Johannesburg</option>
          <option>Cape Town</option>
          <option>Durban</option>
          <option>Pretoria</option>
          <option>Remote</option>
        </select>
        
        <select 
          className="block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          value={selectedDuration}
          onChange={handleDurationChange}
        >
          <option>Duration</option>
          <option>1-3 months</option>
          <option>3-6 months</option>
          <option>6+ months</option>
        </select>
      </div>
    </div>
  );
}
