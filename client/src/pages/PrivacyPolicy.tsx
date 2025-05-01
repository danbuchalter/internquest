export default function PrivacyPolicy() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-amber-500 mb-6">Privacy Policy</h1>
      <p className="text-xl text-gray-700 mb-6">
        We value your privacy. Learn how we collect, use, and protect your information.
      </p>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Data Collection</h2>
        <p className="text-gray-600">
          We collect personal information when you sign up for our platform. This includes your name, email address, and other details necessary for providing our services.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800">Data Protection</h2>
        <p className="text-gray-600">
          We use encryption and other security measures to protect your personal information from unauthorized access.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800">Your Rights</h2>
        <p className="text-gray-600">
          You have the right to access, correct, and delete your personal information. For any concerns, contact us at the provided email address.
        </p>
      </div>
    </div>
  );
}