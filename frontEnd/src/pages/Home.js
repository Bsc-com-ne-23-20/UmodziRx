import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative">

      {/* Slanted Background Image, hidden on mobile devices(small screens) */}
      <div className="absolute top-0 right-0 bottom-0 z-0 overflow-hidden hidden md:block" 
           style={{ width: '60%', clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-100 opacity-0"></div>
        <img 
          src="/images/background-pattern.png" 
          alt="" /*screen readers skip this*/
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <Link to="/">
                <span className="ml-3 text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">UmodziRx</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4">
              <Link to="/learn" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-blue-600 transition-all">Features</Link>
              <Link to="/contact" className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all">Contact Us</Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500 hover:text-blue-600 focus:outline-none">
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link to="/learn" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-blue-600 transition-all text-center">Features</Link>
                <Link to="/contact" className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all text-center">Contact Us</Link>
              </div>
            </div>
          )}
        </nav>
        
        {/* Hero Section - Simplified */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
                  <div className="space-y-6 lg:max-w-2xl animate-fade-in-up">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl leading-tight">
                      <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 pr-1 pb-2">Secure Prescription Management with</span>
                      <span className="block mt-2 text-gray-900"><span className="text-gray-900">UmodziRx</span></span>
                    </h1>
                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg">
                    {/* <p className="mt-3 text-base text-white sm:mt-5 sm:text-lg"> */}
                      Leveraging Digital ID for secure and efficient healthcare delivery.
                    </p>
                    <div className="mt-8 sm:flex sm:justify-center lg:justify-start sm:space-x-4">
                      <Link to="/login">
                        <button className="w-full sm:w-auto mb-4 sm:mb-0 flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all">
                          Get Started
                        </button>
                      </Link>
                      <Link to="/learn">
                        <button className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all">
                          Learn More
                        </button>
                      </Link>
                    </div>
                  </div>
                  {/* <div className="mt-12 lg:mt-0">
                    <img className="w-full max-w-lg mx-auto rounded-lg shadow-xl lg:max-w-md" src="/images/prescription-hero.png" alt="UmodziRx Dashboard Preview" />
                  </div> */}
                </div>
              </main>
            </div>
          </div>
        </div>
        
        {/* Spacer to push footer down */}
        <div className="flex-grow my-16"></div>
        
        {/* Footer */}
        <footer className="bg-white py-4 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:justify-between md:items-center">
              <div className="text-center md:text-left mb-2 md:mb-0">
                <p className="text-gray-500 text-s">
                  &copy; 2025 UmodziRx. All rights reserved.
                </p>
              </div>
              <div className="flex justify-center md:justify-end space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Privacy</span>
                  <span className="text-s">Privacy</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Terms</span>
                  <span className="text-s">Terms</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
        
      </div>
    </div>
  );
}