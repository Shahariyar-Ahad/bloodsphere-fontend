import React, { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import { FaUsers, FaClipboardList, FaTint } from 'react-icons/fa';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import { Link } from 'react-router';
import { ArrowRight, Users } from 'lucide-react';

const AdminHome = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = 'http://localhost:3500';

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('access-token');
            try {
                const res = await axios.get(`${API_BASE_URL}/admin-stats`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (error) {
                console.error("Stats load failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <span className="loading loading-dots loading-lg text-red-600"></span>;

    return (
        <div className="p-4 md:p-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 uppercase tracking-wider">
                Admin Overview 🚀
            </h1>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1: Total Users */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 rounded-3xl shadow-2xl flex items-center justify-between transform hover:scale-105 transition">
                    <div>
                        <p className="text-lg font-medium opacity-80">Total Users</p>
                        <h3 className="text-5xl font-extrabold">{stats.totalUsers}</h3>
                    </div>
                    <FaUsers className="text-6xl opacity-30" />
                </div>

                {/* Card 2: Total Blood Requests */}
                <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-8 rounded-3xl shadow-2xl flex items-center justify-between transform hover:scale-105 transition">
                    <div>
                        <p className="text-lg font-medium opacity-80">Total Requests</p>
                        <h3 className="text-5xl font-extrabold">{stats.totalRequests}</h3>
                    </div>
                    <FaTint className="text-6xl opacity-30" />
                </div>

                {/* Card 3: Pending Requests */}
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-8 rounded-3xl shadow-2xl flex items-center justify-between transform hover:scale-105 transition">
                    <div>
                        <p className="text-lg font-medium opacity-80">Pending Tasks</p>
                        <h3 className="text-5xl font-extrabold">{stats.pendingRequests}</h3>
                    </div>
                    <FaClipboardList className="text-6xl opacity-30" />
                </div>
            </div> 
            <div className="flex justify-center my-10">
            <Link to="/dashboard/all-users">
                <button className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 focus:outline-none overflow-hidden">
                    
                    {/* Background Animation Effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

                    {/* Button Content */}
                    <span className="relative flex items-center gap-4 text-xl lg:text-2xl tracking-wide">
                        <Users className="w-8 h-8 transition-transform group-hover:rotate-12" />
                        <span>See All Users</span>
                        <ArrowRight className="w-6 h-6 transform translate-x-0 group-hover:translate-x-2 transition-transform" />
                    </span>
                    
                </button>
            </Link>
        </div>

            
            <div className="mt-12 bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-700">Hello, {user?.displayName}!</h2>
                <p className="text-gray-500 mt-2 italic">"Managing a community of heroes (donors) is a big responsibility. Keep up the good work!"</p>
            </div>
        </div>
    );
};

export default AdminHome;