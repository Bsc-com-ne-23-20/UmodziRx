import React from 'react';

const LandingPage = () => {
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to UmodziRx</h1>
            <p className="text-lg mb-6">Combating drug theft through blockchain and digital identity verification.</p>
            <button className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition">
                Get Started
            </button>
        </div>
    );
};

export default LandingPage;