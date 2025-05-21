export default function EmployerResources() {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">Employer Resources</h1>
        <p className="mb-4">
          Whether you're new to hosting interns or want to improve your program, these resources will help you create a successful internship experience.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Hosting Best Practices:</strong> Tips on onboarding, mentoring, and supporting interns effectively.</li>
          <li><strong>Legal & Compliance:</strong> Understand labor laws and regulations to ensure your internship program is compliant.</li>
          <li><strong>Maximizing Impact:</strong> Strategies for making internships valuable for both your company and the intern.</li>
          <li><strong>Feedback & Evaluation:</strong> How to provide meaningful feedback and assess intern performance.</li>
        </ul>
        <p className="mt-6">
          Learn more about how to become a great host on our <a href="/partner-benefits" className="text-green-600 hover:underline">Partner Benefits</a> page.
        </p>
      </div>
    );
  }