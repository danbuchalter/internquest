import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Internship } from "@shared/schema";
import InternshipCard from "@/components/internships/internship-card";
import InternshipFilters from "@/components/internships/internship-filters";
import { Loader2 } from "lucide-react";

export default function FeaturedInternships() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDuration, setSelectedDuration] = useState("Duration");
  
  const { data: internships, isLoading } = useQuery<Internship[]>({
    queryKey: ["/api/internships"],
  });
  
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  
  useEffect(() => {
    if (internships) {
      let filtered = [...internships];
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(internship => 
          internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply industry filter
      if (selectedIndustry !== "All Industries") {
        filtered = filtered.filter(internship => 
          internship.industry === selectedIndustry
        );
      }
      
      // Apply location filter
      if (selectedLocation !== "All Locations") {
        filtered = filtered.filter(internship => 
          internship.location.includes(selectedLocation)
        );
      }
      
      // Apply duration filter
      if (selectedDuration !== "Duration") {
        filtered = filtered.filter(internship => 
          internship.duration === selectedDuration
        );
      }
      
      setFilteredInternships(filtered);
    }
  }, [internships, searchTerm, selectedIndustry, selectedLocation, selectedDuration]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
  };
  
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };
  
  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration);
  };

  return (
    <div id="listings" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Internships</h2>
          <p className="mt-4 text-xl text-gray-600">Discover opportunities that match your interests</p>
        </div>

        <InternshipFilters 
          onSearch={handleSearch}
          onIndustryChange={handleIndustryChange}
          onLocationChange={handleLocationChange}
          onDurationChange={handleDurationChange}
          selectedIndustry={selectedIndustry}
          selectedLocation={selectedLocation}
          selectedDuration={selectedDuration}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {filteredInternships && filteredInternships.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredInternships.slice(0, 3).map((internship) => (
                  <InternshipCard key={internship.id} internship={internship} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">No internships found matching your criteria.</p>
              </div>
            )}
          </>
        )}

        <div className="mt-12 text-center">
          <Link href="/internships">
            <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary/80 bg-primary/10 hover:bg-primary/20">
              Browse All Internships
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
