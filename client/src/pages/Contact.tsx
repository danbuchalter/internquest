export default function Contact() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-amber-500 mb-6">Contact Us</h1>
      <p className="text-xl text-gray-700 mb-6">
        Reach out to us anytime! We’re here to assist you with your questions and concerns.
      </p>
      <p className="text-gray-700 mb-4">
        For general inquiries, email us at:{" "}
        <a href="mailto:support@internquest.co.za" className="text-amber-500 underline">
          support@internquest.co.za
        </a>
      </p>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Follow us on Social Media:</h2>
        <div className="flex space-x-4">
          <a href="#" className="text-amber-500 hover:text-amber-700">Facebook</a>
          <a href="#" className="text-amber-500 hover:text-amber-700">Twitter</a>
          <a href="#" className="text-amber-500 hover:text-amber-700">Instagram</a>
          <a href="#" className="text-amber-500 hover:text-amber-700">LinkedIn</a>
        </div>
      </div>
    </div>
  );
}