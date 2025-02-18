import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

    const Auth = () => {
        const [isLogin, setIsLogin] = useState(true);

        const navigate = useNavigate();

        const handleDoctorLogin = (event) => {
            event.preventDefault();  // ✅ Prevent form refresh
            navigate("/doctordashboard"); 
        };
        
        const toggleAuthMode = () => {
            setIsLogin(!isLogin);
        };
        //container mx-auto p-8 text-center
        return (
            <div className="flex flex-col items-center justify-center h-screen mx-auto">
                <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form className="bg-white p-6 rounded-lg shadow-md">
                    <input type="email" placeholder="Email" className="border p-2 mb-4 w-full" required />
                    <input type="password" placeholder="Password" className="border p-2 mb-4 w-full" required />
                    <button onClick={ handleDoctorLogin} type="submit" className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <button onClick={toggleAuthMode } className="mt-4 mx-auto hover:underline">
                    {isLogin ? 'Create an account' : 'Already have an account?'}
                </button>
            </div>
        );
    };

    export default Auth;
    