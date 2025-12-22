// src/Routes/PrivateRoute.jsx

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../AuthProvider/AuthProvider';
import toast from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-red-600"></span>
            </div>
        );
    }

    
    if (!user) {
       
        toast.error("Please log in to view the details of this request.");
        
        
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    
    return children;
};

export default PrivateRoute;