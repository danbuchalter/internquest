import { useState } from "react";
import { Link } from "wouter";
import { Bookmark, MapPin, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Internship } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface InternshipCardProps {
  internship: Internship;
  isSaved?: boolean;
}

export default function InternshipCard({ internship, isSaved = false }: InternshipCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(isSaved);
  const { toast } = useToast();
  // Temporarily hard-code user to null until we fix auth
  const user = null as any; // Using any to avoid type errors
  
  const saveInternshipMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/saved-internships", {});
      return await res.json();
    },
    onSuccess: () => {
      setIsBookmarked(true);
      queryClient.invalidateQueries({ queryKey: [`/api/saved-internships/user/${user?.id}`] });
      toast({
        title: "Internship saved",
        description: "The internship has been added to your saved list.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save internship",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const unsaveInternshipMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/saved-internships/${internship.id}`);
    },
    onSuccess: () => {
      setIsBookmarked(false);
      queryClient.invalidateQueries({ queryKey: [`/api/saved-internships/user/${user?.id}`] });
      toast({
        title: "Internship removed",
        description: "The internship has been removed from your saved list.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove internship",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleBookmarkToggle = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save internships.",
        variant: "destructive",
      });
      return;
    }
    
    if (user.role !== "student") {
      toast({
        title: "Not available",
        description: "Only students can save internships.",
        variant: "destructive",
      });
      return;
    }
    
    if (isBookmarked) {
      unsaveInternshipMutation.mutate();
    } else {
      saveInternshipMutation.mutate();
    }
  };
  
  // Function to extract skills as array
  const getSkills = () => {
    if (!internship.skills) return [];
    return internship.skills.split(',').map(skill => skill.trim());
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
            <p className="text-sm text-gray-600">{internship.companyId}</p>
          </div>
          <button 
            className={`text-gray-400 hover:text-amber-500 ${isBookmarked ? 'text-amber-500' : ''}`} 
            aria-label={isBookmarked ? "Unsave internship" : "Save internship"}
            onClick={handleBookmarkToggle}
            disabled={saveInternshipMutation.isPending || unsaveInternshipMutation.isPending}
          >
            <Bookmark className={isBookmarked ? "fill-current" : ""} />
          </button>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
            {internship.location}
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
            {internship.duration} ({internship.startDate ? new Date(internship.startDate).toLocaleDateString('en-US', { month: 'short' }) : ''} - {internship.endDate ? new Date(internship.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''})
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <DollarSign className="mr-2 h-4 w-4 text-gray-400" />
            {internship.stipend || 'Unpaid'}
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="technology">{internship.industry}</Badge>
          {getSkills().slice(0, 2).map((skill, index) => (
            <Badge key={index} variant="skill">{skill}</Badge>
          ))}
          {getSkills().length > 2 && (
            <Badge variant="outline">+{getSkills().length - 2} more</Badge>
          )}
        </div>
        
        <div className="mt-6">
          <Link href={`/internships/${internship.id}`}>
            <Button className="w-full">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
