import { useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import useAdmin from "../hooks/useAdmin";
import { Navigate, useLocation } from "react-router";

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [isAdmin, isAdminLoading] = useAdmin();
    const location = useLocation();

    // যদি অথেনটিকেশন বা অ্যাডমিন চেক লোড হতে থাকে
    if (loading || isAdminLoading) {
        return <progress className="progress w-56"></progress>;
    }

    // যদি ইউজার লগইন থাকে এবং সে অ্যাডমিন হয়, তবে তাকে পেজটি দেখতে দাও
    if (user && isAdmin) {
        return children;
    }

    // অ্যাডমিন না হলে লগআউট করে দাও অথবা হোম পেজে পাঠিয়ে দাও
    return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default AdminRoute;