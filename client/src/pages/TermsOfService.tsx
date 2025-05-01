export default function TermsOfService() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-amber-500 mb-6">Terms of Service</h1>
      <p className="text-xl text-gray-700 mb-6">
        Please read these terms carefully before using InternQuest.
      </p>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">1. Agreement</h2>
        <p className="text-gray-600">
          By using our services, you agree to the terms and conditions outlined in this document.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800">2. Use of Services</h2>
        <p className="text-gray-600">
          You agree to use InternQuest solely for lawful purposes and not to engage in any activities that could harm the platform or other users.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800">3. Limitation of Liability</h2>
        <p className="text-gray-600">
          We are not responsible for any damages or losses that occur while using the platform. Your use of InternQuest is at your own risk.
        </p>
      </div>
    </div>
  );
}