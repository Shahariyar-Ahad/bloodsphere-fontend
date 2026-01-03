import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import axios from 'axios';
import { Droplet, HeartHandshake, Clock } from 'lucide-react';

const DonorHome = () => {
    const API_BASE_URL = 'https://blood-donor-server-two.vercel.app';
    const { user } = useContext(AuthContext);

    const [requests, setRequests] = useState([]);
    const [myDonations, setMyDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user?.email) return;

        const fetchStats = async () => {
            const token = localStorage.getItem('access-token');
            setLoading(true);
            setError('');

            try {
                const [resRequests, resDonations] = await Promise.all([
                    axios.get(`${API_BASE_URL}/my-requests/${user.email}`, {
                        headers: { authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_BASE_URL}/my-donations/${user.email}`, {
                        headers: { authorization: `Bearer ${token}` }
                    })
                ]);

                setRequests(resRequests.data || []);
                setMyDonations(resDonations.data || []);
            } catch (err) {
                console.error(err);
                setError('Failed to load your dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user?.email]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-60">
                <span className="loading loading-spinner loading-lg text-red-600"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 font-semibold">
                {error}
            </div>
        );
    }

    const inProgressCount = myDonations.filter(
        d => d.donationStatus === 'inprogress'
    ).length;

    return (
        <div className="p-6 md:p-10">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-800">
                    Welcome back,
                    <span className="text-red-600"> {user?.displayName}</span> ❤️
                </h1>
                <p className="text-gray-500 mt-2">
                    Your kindness is saving lives. Here’s your activity overview.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* My Requests */}
                <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-8 rounded-3xl shadow-xl flex justify-between items-center">
                    <div>
                        <p className="text-lg opacity-80">My Requests</p>
                        <h3 className="text-5xl font-extrabold">
                            {requests.length}
                        </h3>
                        <p className="text-sm mt-1 opacity-80">
                            Blood you requested
                        </p>
                    </div>
                    <Droplet className="w-16 h-16 opacity-30" />
                </div>

                {/* Donations Confirmed */}
                <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-8 rounded-3xl shadow-xl flex justify-between items-center">
                    <div>
                        <p className="text-lg opacity-80">Donations Confirmed</p>
                        <h3 className="text-5xl font-extrabold">
                            {myDonations.length}
                        </h3>
                        <p className="text-sm mt-1 opacity-80">
                            Lives you helped
                        </p>
                    </div>
                    <HeartHandshake className="w-16 h-16 opacity-30" />
                </div>

                {/* In Progress */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 rounded-3xl shadow-xl flex justify-between items-center">
                    <div>
                        <p className="text-lg opacity-80">In Progress</p>
                        <h3 className="text-5xl font-extrabold">
                            {inProgressCount}
                        </h3>
                        <p className="text-sm mt-1 opacity-80">
                            Pending donations
                        </p>
                    </div>
                    <Clock className="w-16 h-16 opacity-30" />
                </div>
            </div>

            {/* Footer Message */}
            <div className="mt-12 bg-white p-8 rounded-3xl shadow border border-gray-100">
                <p className="text-gray-700 text-lg italic">
                    “A single donation can save up to three lives.
                    Thank you for being a hero.”
                </p>
            </div>
        </div>
    );
};

export default DonorHome;
