import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Secure Prescription Management with UmodziRx
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">

          Blockchain-powered solution for secure, transparent, and accountable prescription management.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="inline-block border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-16">

        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Blockchain Security</h3>
              <p className="text-gray-600">
                Immutable and transparent record-keeping for all prescriptions.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Digital ID Verification</h3>
              <p className="text-gray-600">
                Secure authentication using MOSIP Digital ID.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Real-time Tracking</h3>
              <p className="text-gray-600">
                Monitor prescription status in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-900 py-16">

        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Prescription Management?</h2>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Start Now
          </Link>
        </div>
      </div>
    </div>
  );
}
