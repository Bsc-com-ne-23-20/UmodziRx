import React, { useState } from 'react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form className="bg-white p-6 rounded-lg shadow-md">
                <input type="email" placeholder="Email" className="border p-2 mb-4 w-full" required />
                <input type="password" placeholder="Password" className="border p-2 mb-4 w-full" required />
                <button type="submit" className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition">
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>
            <button onClick={toggleAuthMode} className="mt-4 text-teal-500 hover:underline">
                {isLogin ? 'Create an account' : 'Already have an account?'}
            </button>
        </div>
    );
};

export default Auth;