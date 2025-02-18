import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Auth = () => {
    // State variables to manage input values and authentication mode
    const [isLogin, setIsLogin] = useState(true); // Tracks whether the user is in Login or Signup mode
    const [email, setEmail] = useState(""); // Stores email input value
    const [password, setPassword] = useState(""); // Stores password input value
    
    // Hook to navigate between pages
    const navigate = useNavigate();

    // Function to handle login logic when the form is submitted
    const handleLogin = (event) => {
        event.preventDefault(); // Prevents the page from refreshing on form submission

        // ✅ Check if both fields have '1' → Redirect to Doctor Dashboard
        if (email === "1" && password === "1") {
            navigate("/doctordashboard"); // Redirects to Doctor Dashboard
        } 
        // ✅ Check if both fields have '0' → Redirect to Pharmacist Dashboard
        else if (email === "0" && password === "0") {
            navigate("/pharmacistdashboard"); // Redirects to Pharmacist Dashboard
        } 
        // 🚨 If inputs are invalid, show an alert
        else {
            alert("Invalid credentials! Please enter '1' for Doctor or '0' for Pharmacist.");
        }
    };

    // Function to toggle between Login and Signup modes
    const toggleAuthMode = () => {
        setIsLogin(!isLogin); // Switch between login and signup mode
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen mx-auto">
            {/* ✅ Displays 'Login' or 'Sign Up' based on isLogin state */}
            <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
            
            {/* ✅ Form starts here */}
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md">
                
                {/* ✅ Email Input Field */}
                <input 
                    type="text"
                    value={email} // Binds state to input
                    onChange={(e) => setEmail(e.target.value)} // Updates state when user types
                    placeholder="Enter 1 for Doctor, 0 for Pharmacist" // Shows instruction
                    className="border p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required // Ensures the field is filled
                />

                {/* ✅ Password Input Field */}
                <input 
                    type="password"
                    value={password} // Binds state to input
                    onChange={(e) => setPassword(e.target.value)} // Updates state when user types
                    placeholder="Enter 1 for Doctor, 0 for Pharmacist" // Shows instruction
                    className="border p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required // Ensures the field is filled
                />

                {/* ✅ Login / Signup Button */}
                <button 
                    type="submit" // Triggers handleLogin when clicked
                    className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition"
                >
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>

            {/* ✅ Button to toggle between Login and Signup */}
            <button onClick={toggleAuthMode} className="mt-4 mx-auto hover:underline">
                {isLogin ? 'Create an account' : 'Already have an account?'}
            </button>
        </div>
    );
};

export default Auth;
