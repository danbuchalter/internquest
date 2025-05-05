import { useEffect, useRef } from "react";

export default function Testimonials() {
  const testimonialsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.location.hash === "#testimonials" && testimonialsRef.current) {
      testimonialsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Thandi M.",
      role: "Marketing Intern at Brand Connect",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      testimonial:
        "InternQuest helped me find an amazing marketing internship that perfectly matched my university studies. The application process was simple, and within two weeks I was starting my internship!",
    },
    {
      id: 2,
      name: "Sipho N.",
      role: "Software Development Intern at TechSA",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      testimonial:
        "As a self-taught programmer, I struggled to find opportunities. InternQuest connected me with a company that valued my skills over formal education. This internship launched my career!",
    },
    {
      id: 3,
      name: "Lerato K.",
      role: "HR Manager at Global Solutions",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjN8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      testimonial:
        "InternQuest has transformed our internship program. We've found exceptional talent that we might have missed through traditional recruitment. Many of our full-time hires started as interns from this platform.",
    },
  ];

  return (
    <div id="testimonials" ref={testimonialsRef} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Hear from students and companies who found their perfect match on InternQuest
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-14 w-14 rounded-full overflow-hidden">
                  <img
                    className="h-full w-full object-cover"
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 italic">"{testimonial.testimonial}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}