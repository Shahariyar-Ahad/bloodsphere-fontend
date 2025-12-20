// src/Routes/PrivateRoute.jsx

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../AuthProvider/AuthProvider';
import toast from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // লোডিং অবস্থায় স্পিনার দেখানো
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-red-600"></span>
            </div>
        );
    }

    // ইউজার যদি লগইন করা না থাকে
    if (!user) {
        // টোস্ট নোটিফিকেশন দেখানো
        toast.error("Please log in to view the details of this request.");
        
        // লগইন পেজে রিডাইরেক্ট করা এবং বর্তমান লোকেশনটি স্টেট হিসেবে পাস করা
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // ইউজার লগইন করা থাকলে
    return children;
};

export default PrivateRoute;