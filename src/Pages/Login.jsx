

import React, { useContext } from 'react';

import { Link, useNavigate, useLocation } from 'react-router'; 
import { AuthContext } from '../AuthProvider/AuthProvider';
import toast, { Toaster } from 'react-hot-toast'; 
import axios from 'axios';


const API_BASE_URL = 'http://localhost:3500'; 

const Login = () => {
   
    const { loginWithEmailAndPassword, setLoading, setUser } = useContext(AuthContext); 
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"; 

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const pass = e.target.password.value;
        setLoading(true);

        // ১. Firebase Login (Email/Password)
        loginWithEmailAndPassword(email, pass)
            .then(async () => {
             
                const userData = { email, password: pass }; 

                try {
                   
                    const res = await axios.post(`${API_BASE_URL}/users/login`, userData);
                    
                    
                    const { token, user: backendUser } = res.data; 
                    
                   
                    localStorage.setItem('access-token', token);
                    
                   
                    setUser(backendUser); 
                    
                    toast.success(`Login successful! Welcome back, ${backendUser.name || backendUser.email}.`);
                    navigate(from, { replace: true });

                } catch (apiError) {
                    
                    console.error("Backend Login Failed:", apiError.response?.data?.message || apiError.message);
                    
                    
                    
                    toast.error(apiError.response?.data?.message || "Login failed. Check server status!");
                }
            })
            .catch((err) => {
               
                console.error("Firebase Login Failed:", err);
                toast.error("Login failed. Check your email or password!");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 bg-gray-900 overflow-hidden">
            <Toaster position="top-center" />

            {/* Background Effects (Geometric/Blood Splatter Inspired) */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute w-96 h-96 bg-red-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-10 left-1/4"></div>
                <div className="absolute w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 bottom-20 right-1/4"></div>
            </div>
            
            {/* Login Card (Center piece) */}
            <div className='relative z-10 max-w-md w-full p-10 bg-white/5 backdrop-blur-md border border-red-500/30 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.2)] text-white transform transition-all duration-500 hover:scale-[1.01]'>
                
                {/* Header */}
                <h1 className='text-4xl font-extrabold font-sans text-center mb-3 text-red-500 drop-shadow-lg'>
                    Welcome Back 
                </h1>
                <p className='text-center text-gray-300 mb-8 font-light'>
                    Sign in to your BloodSphere Donor Account
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Email Input */}
                    <div className="relative">
                        <label className="block text-sm font-medium mb-1 text-red-100">Email</label>
                        <input type="email" name="email" placeholder="you@donate.org"
                            className="input input-lg w-full bg-transparent border-b-2 border-red-500/50 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition duration-300 hover:border-red-400"
                            required />
                        {/* Custom focus effect below the input */}
                        <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-500 group-focus-within:w-full'></div>
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <label className="block text-sm font-medium mb-1 text-red-100">Password</label>
                        <input type='password' name="password" placeholder="••••••••"
                            className="input input-lg w-full bg-transparent border-b-2 border-red-500/50 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition duration-300 hover:border-red-400"
                            required />
                        <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-500 group-focus-within:w-full'></div>
                    </div>

                    {/* Login Button */}
                    <button type="submit" 
                        className="w-full bg-red-600 text-white px-5 py-3 rounded-full font-bold text-lg tracking-wider shadow-xl 
                                 hover:bg-red-700 hover:shadow-red-500/50 transition-all duration-300 transform hover:-translate-y-1 mt-8">
                        Login to Save Lives
                    </button>

                    {/* Register Link */}
                    <div className="text-center pt-4">
                        <p className="text-sm text-gray-400">
                            Don’t have an account? 
                            <Link to='/register' 
                                className="text-red-300 hover:text-red-500 font-semibold ml-2 transition-colors">
                                Register here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;