import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="max-w-2xl w-full text-center">
               
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-20">
                        <div className="w-32 h-32 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <AlertCircle size={120} className="text-red-600 stroke-[1.5]" />
                    </div>
                </div>

                
                <h1 className="text-9xl font-black text-gray-200 mb-2">404</h1>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    Oops! Page Not Found
                </h2>
                <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
                    <span className="text-red-600 font-semibold block mt-2 italic">
                        "In our database, every drop of blood counts, but this page seems to be missing!"
                    </span>
                </p>

               
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                   
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-red-600 hover:text-red-600 transition-all duration-300 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>

                    {/* Back to Home Button */}
                    <Link 
                        to="/" 
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 font-bold text-white bg-linear-to-r from-red-600 to-rose-700 rounded-2xl shadow-xl shadow-red-200 hover:shadow-red-400 hover:scale-105 transition-all duration-300"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>
                </div>

             
                <p className="mt-16 text-gray-400 text-sm">
                    If you think this is a mistake, please contact our support team.
                </p>
            </div>
        </div>
    );
};

export default ErrorPage;