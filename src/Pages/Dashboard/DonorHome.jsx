import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import axios from 'axios';

const DonorHome = () => {
    const API_BASE_URL = 'http://localhost:3500'; // আপনার সার্ভার পোর্ট অনুযায়ী (৪০০০ বা ৩৫০০)
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]); // আপনার তৈরি করা রিকোয়েস্ট
    const [myDonations, setMyDonations] = useState([]); // আপনার কনফার্ম করা ডোনেশন
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('access-token');
            try {
                // ১. আপনার তৈরি করা রিকোয়েস্টগুলো আনুন
                const resRequests = await axios.get(`${API_BASE_URL}/my-requests/${user?.email}`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                setRequests(resRequests.data);

                // ২. আপনার কনফার্ম করা ডোনেশনগুলো (Donations accepted by you) আনুন
                const resDonations = await axios.get(`${API_BASE_URL}/my-donations/${user?.email}`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                setMyDonations(resDonations.data);

            } catch (error) {
                console.error("Error loading stats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchStats();
        }
    }, [user?.email]);

    return (
        <div className="bg-white p-10 rounded-2xl shadow-lg border-l-8 border-red-600">
            <h1 className="text-4xl font-bold text-gray-800">
                Welcome, <span className="text-red-600">{user?.displayName}</span>! 
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {/* কার্ড ১: আপনার করা মোট রিকোয়েস্ট (আপনি রক্ত চেয়েছেন) */}
                <div className="stat bg-red-50 border border-red-200 rounded-box p-5 shadow">
                    <div className="stat-title text-red-600 font-bold uppercase">My Requests</div>
                    <div className="stat-value text-red-600">
                        {loading ? <span className="loading loading-spinner"></span> : requests.length}
                    </div>
                    <div className="stat-desc font-medium text-gray-500 mt-1">Blood you requested</div>
                </div>

                {/* কার্ড ২: আপনার কনফার্ম করা ডোনেশন (আপনি রক্ত দিতে চেয়েছেন) */}
                <div className="stat bg-green-50 border border-green-200 rounded-box p-5 shadow">
                    <div className="stat-title text-green-600 font-bold uppercase">Donations Confirmed</div>
                    <div className="stat-value text-green-600">
                        {loading ? <span className="loading loading-spinner"></span> : myDonations.length}
                    </div>
                    <div className="stat-desc font-medium text-gray-500 mt-1">Lives you are helping to save</div>
                </div>

                {/* কার্ড ৩: পেন্ডিং ডোনেশন (যদি ইন-প্রগ্রেসগুলো আলাদা দেখাতে চান) */}
                <div className="stat bg-blue-50 border border-blue-200 rounded-box p-5 shadow">
                    <div className="stat-title text-blue-600 font-bold uppercase">In Progress</div>
                    <div className="stat-value text-blue-600">
                        {myDonations.filter(d => d.donationStatus === 'inprogress').length}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorHome;