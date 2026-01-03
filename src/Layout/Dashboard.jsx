import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import { FaHome, FaList, FaPlusCircle, FaUser, FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../AuthProvider/AuthProvider';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const API_BASE_URL = 'https://blood-donor-server-two.vercel.app';

    // data base theke (admin/donor) role cheack korlam
    useEffect(() => {
        if (user?.email) {
            axios.get(`${API_BASE_URL}/user/${user?.email}`)
                .then(res => setUserData(res.data))
                .catch(err => console.error(err));
        }
    }, [user?.email]);

    // role check 
    const isAdmin = userData?.role === 'admin';

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-800">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-red-600 text-white p-6 shadow-xl">
                <h2 className="text-2xl font-extrabold mb-10 text-center flex items-center justify-center gap-2">
                    🩸 Blood Aid
                </h2>

                <ul className="space-y-4">
                    {/* --- conditional menu create korlam --- */}
                    {isAdmin ? (
                        <>
                            {/* only admin dekhte parbe */}
                            <p className="text-xs font-bold opacity-70 uppercase mb-2 text-white">Admin Menu</p>
                            <li>
                                <NavLink to="/dashboard/admin-home" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg hover:bg-red-700 transition ${isActive ? 'bg-red-800 shadow-inner' : ''}`}>
                                    <FaHome /> Admin Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/all-users" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg hover:bg-red-700 transition ${isActive ? 'bg-red-800 shadow-inner' : ''}`}>
                                    <FaUser /> All Users
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/all-requests" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg hover:bg-red-700 transition ${isActive ? 'bg-red-800 shadow-inner' : ''}`}>
                                    <FaList /> All Requests
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* donar eigula dekhbe */}
                            <p className="text-xs font-bold opacity-70 uppercase mb-2 text-white">Donor Menu</p>
                            <li>
                                <NavLink to="/dashboard/donor-home" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg hover:bg-red-700 transition ${isActive ? 'bg-red-800 shadow-inner' : ''}`}>
                                    <FaHome /> Donor Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/my-requests" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg hover:bg-red-700 transition ${isActive ? 'bg-red-800 shadow-inner' : ''}`}>
                                    <FaList /> My Requests
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/donation-requests" className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-700 transition">
                                    <FaPlusCircle /> Create Request
                                </NavLink>
                            </li>
                        </>
                    )}


                    <div className="divider bg-red-400 h-[1px] my-6"></div>

                    {/* common link */}
                    <li>
                        <NavLink to="/dashboard/profile" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg hover:bg-red-700 transition ${isActive ? 'bg-red-800 shadow-inner' : ''}`}>
                            <FaUserCircle /> My Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-700 transition">
                            <FaHome /> Back to Home
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;