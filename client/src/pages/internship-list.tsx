import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Internship } from "@shared/schema";
import InternshipCard from "@/components/internships/internship-card";
import InternshipFilters from "@/components/internships/internship-filters";
import { Loader2 } from "lucide-react";

export default function InternshipList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDuration, setSelectedDuration] = useState("Duration");
  // Temporarily hard-code user to null until we fix auth
  const user = null as any;
  
  const { data: internships, isLoading: internshipsLoading } = useQuery<Internship[]>({
    queryKey: ["/api/internships"],
  });
  
  // Disable saved internships query for now
  const savedInternships = [] as any[];
  const savedLoading = false;
  
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
  
  // Check if an internship is saved by the current user
  const isInternshipSaved = (internshipId: number) => {
    if (!savedInternships) return false;
    return savedInternships.some(saved => saved.internshipId === internshipId);
  };
  
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
  
  const isLoading = internshipsLoading || (user?.role === "student" && savedLoading);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Browse Internships</h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Discover career-launching internship opportunities across South Africa. 
          Filter by industry, location, and duration to find your perfect match.
        </p>
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
              {filteredInternships.map(internship => (
                <InternshipCard 
                  key={internship.id} 
                  internship={internship} 
                  isSaved={isInternshipSaved(internship.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No internships found</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search filters to find more opportunities.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
