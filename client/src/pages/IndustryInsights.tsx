export default function IndustryInsights() {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">Industry Insights</h1>
        <p className="mb-4">
          Stay up to date with the latest trends in internships, skills development, and workforce needs across various industries.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Emerging Skills:</strong> Discover which skills employers are seeking in interns and graduates.</li>
          <li><strong>Internship Trends:</strong> Insights into how internship programs are evolving in different sectors.</li>
          <li><strong>Workforce Development:</strong> The role of internships in shaping the future workforce in South Africa.</li>
          <li><strong>Success Stories:</strong> Case studies and examples of effective internship programs.</li>
        </ul>
        <p className="mt-6">
          Explore more about internships on our <a href="/" className="text-green-600 hover:underline">Home</a> page.
        </p>
      </div>
    );
  }