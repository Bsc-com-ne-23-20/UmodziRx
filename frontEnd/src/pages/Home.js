import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Secure Prescription Management with
            <span className="block text-blue-600 dark:text-blue-400 mt-3">
            UmodziRx   
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Secure, efficient, and accessible prescription management powered by blockchain technology and MOSIP Digital ID
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white text-center">
              Secure & Tamper-Proof
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
              Blockchain technology ensures the integrity and security of all prescriptions
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white text-center">
              Role-Based Access
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
              Tailored interfaces for doctors, pharmacists, and patients
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white text-center">
              MOSIP Digital ID
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
              MOSIP Digital ID provides a secure and efficient way to manage identities in the prescription system.
            </p>
          </div>

        </div>

        <div className="mt-10 text-center">


          <div className="flex justify-center space-x-4">
            <div className="flex justify-center space-x-4">
            <div className="flex justify-center space-x-4">
              <Link
                to="/learn-more"
                className="inline-flex items-center px-8 py-4 border border-transparent text-xl font-semibold rounded-full text-blue-600 bg-white hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                Learn More
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 border border-transparent text-xl font-semibold rounded-full text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-colors duration-200 shadow-lg"
              >
                Get Started
                <svg className="ml-3 -mr-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
