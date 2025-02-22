import React, { useEffect } from 'react';
import { Link } from 'react-scroll';

export default function LearnMore() {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white"> Blockchain Digital ID Prescription System</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        Revolutionizing Prescription Management
        </p>

        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Key Features</h2>
        <ul className="mt-4 list-disc list-inside text-lg text-gray-600 dark:text-gray-300">
          <li>Secure and tamper-proof prescription records</li>
          <li>Instant verification of prescription authenticity</li>
          <li>Decentralized storage for enhanced security</li>
          <li>Real-time tracking of prescription status</li>
          <li>Interoperability across healthcare providers</li>
        </ul>
        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Benefits for Patients</h2>
        <ul className="mt-4 list-disc list-inside text-lg text-gray-600 dark:text-gray-300">
          <li>Easy access to prescription history</li>
          <li>Reduced risk of prescription fraud</li>
          <li>Improved medication management</li>
          <li>Enhanced privacy and data security</li>
        </ul>
        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Benefits for Healthcare Providers</h2>
        <ul className="mt-4 list-disc list-inside text-lg text-gray-600 dark:text-gray-300">
          <li>Streamlined prescription verification process</li>
          <li>Reduced administrative burden</li>
          <li>Improved patient safety and care quality</li>
          <li>Enhanced data security and compliance</li>
        </ul>
        
        <div id="top"></div>
      </div>
    </div>
  );
}
