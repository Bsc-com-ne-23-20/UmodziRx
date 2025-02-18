import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-purple-600 p-4">
            <ul className="flex space-x-4">
                <li><Link to="/" className="text-white">Home</Link></li>
                <li><Link to="/auth" className="text-white">Login/Sign Up</Link></li>
                <li><Link to="/dashboard" className="text-white">Dashboard</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;