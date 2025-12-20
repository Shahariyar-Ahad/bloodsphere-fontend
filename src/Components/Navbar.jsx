

import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router'; 
import { AuthContext } from '../AuthProvider/AuthProvider'; 
import toast from 'react-hot-toast'; 
import { getAuth, signOut } from 'firebase/auth'; 

const Navbar = () => {
    const { user, loading, setUser } = useContext(AuthContext); 
    const navigate = useNavigate();
    
    // ইউজার রোল ও তথ্য
    const userRole = user?.role || 'donor'; 
    const userName = user?.displayName || user?.name || 'User'; 
    const userPhoto = user?.photoURL || user?.image || 'https://i.ibb.co/6P3d5K0/default-avatar.png'; 

    // লগআউট হ্যান্ডেলার
    const handleLogOut = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                localStorage.removeItem('access-token');
                setUser(null); 
                toast.success("Successfully logged out!");
                navigate('/login');
            })
            .catch((error) => {
                console.error("Logout Error:", error);
                toast.error("Logout failed.");
            });
    };
    
    // রোলের উপর ভিত্তি করে ড্যাশবোর্ড লিংক
    const getDashboardLink = () => {
        if (userRole === 'admin') return '/dashboard/admin-home';
        if (userRole === 'volunteer') return '/dashboard/volunteer-home';
        return '/dashboard/donor-home'; 
    };

    // ১. সাধারণ ন্যাভ লিঙ্ক (Desktop & Mobile)
    const navLinks = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/donation-requests">Donation Requests</NavLink></li>
            <li><NavLink to="/blogs">Blogs</NavLink></li>
            <li><NavLink to="/funding">Funding</NavLink></li>
        </>
    );

    // ২. লগইন অবস্থায় ইউজার মেনু (ড্রপডাউনের জন্য)
    const userMenu = (
        <>
            <li><Link to={getDashboardLink()} className="font-semibold">Dashboard</Link></li>
            
            {/* এডমিন হলে আলাদা করে এই লাল বাটনটি দেখাবে */}
            {userRole === 'admin' && (
                <li>
                    <Link to="/dashboard/admin-home" className="bg-red-600 text-white font-bold hover:bg-red-700 mt-1 mb-1 shadow-md">
                        Admin Panel 🛠️
                    </Link>
                </li>
            )}

            <li><Link to="/dashboard/profile">Profile</Link></li>
            <li><button onClick={handleLogOut} className="text-red-500 font-bold hover:bg-red-50">Logout</button></li>
        </>
    );

    // ৩. লগআউট অবস্থায় Auth বাটন
    const authButtons = (
        <div className="flex gap-2">
            <Link to="/login" className="btn btn-outline btn-error btn-sm border-2">Login</Link>
            <Link to="/register" className="btn btn-error btn-sm text-white">Register</Link>
        </div>
    );

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#001F3D]/90 shadow-lg border-b border-red-900/20">
            <div className="navbar max-w-7xl mx-auto px-4 py-2">

                {/* Left Side: Logo & Mobile Menu */}
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-3 shadow-2xl bg-white text-gray-800 rounded-2xl w-64 border border-gray-100">
                            {navLinks}
                            <div className="divider my-2" />
                            {user ? userMenu : (
                                <>
                                    <li><Link to="/login">Login</Link></li>
                                    <li><Link to="/register">Register</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-1 group">
                        <span className="text-red-600 group-hover:scale-110 transition-transform duration-300">Blood</span>
                        <span className="text-white">Sphere 🩸</span>
                    </Link>
                </div>

                {/* Center Side: Desktop Navigation */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal gap-4 font-bold text-gray-100 px-1">
                        {navLinks}
                    </ul>
                </div>

                {/* Right Side: Auth & User Profile */}
                <div className="navbar-end">
                    {loading ? (
                        <span className="loading loading-spinner text-error"></span>
                    ) : user ? (
                        /* Logged In User Dropdown */
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring-2 ring-red-500 ring-offset-2 ring-offset-[#001F3D] hover:scale-105 transition-all">
                                <div className="w-10 rounded-full">
                                    <img src={userPhoto} alt={userName} />
                                </div>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-4 p-4 shadow-2xl bg-white text-gray-800 rounded-2xl w-64 border border-gray-100">
                                <li className="px-4 py-2 bg-gray-50 rounded-lg mb-2">
                                    <p className="font-bold text-gray-800 p-0 m-0">{userName}</p>
                                    <span className="text-[10px] uppercase tracking-widest text-red-600 font-black">{userRole}</span>
                                </li>
                                <div className="divider my-1" />
                                {userMenu} 
                            </ul>
                        </div>
                    ) : (
                        /* Logged Out Buttons */
                        authButtons
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;