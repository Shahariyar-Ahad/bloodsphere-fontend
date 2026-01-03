import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import RequestCard from './RequestCard';

const API_BASE_URL = 'https://blood-donor-server-two.vercel.app';

const AllRequest = () => {
    const [allRequests, setAllRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]); // ফিল্টার করা ডাটা রাখার জন্য
    const [loading, setLoading] = useState(true);

    // ফিল্টার স্টেট
    const [statusFilter, setStatusFilter] = useState('');
    const [bloodFilter, setBloodFilter] = useState('');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        axios.get(`${API_BASE_URL}/all-request`)
            .then(res => {
                setAllRequests(res.data);
                setFilteredRequests(res.data); // শুরুতে সব ডাটাই দেখাবে
            })
            .catch(err => {
                console.error(err);
                toast.error("Failed to load requests");
            })
            .finally(() => setLoading(false));
    }, []);

    // ফিল্টার লজিক
    useEffect(() => {
        let temp = allRequests;

        if (statusFilter) {
            temp = temp.filter(req => req.donationStatus === statusFilter);
        }
        if (bloodFilter) {
            temp = temp.filter(req => req.bloodGroup === bloodFilter);
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilteredRequests(temp);
    }, [statusFilter, bloodFilter, allRequests]);

    if (loading) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center my-10 text-red-600">All Blood Donation Requests</h1>

            {/* filter section */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 bg-white p-6 rounded-xl shadow-sm border">
                <div className="form-control">
                    <label className="label text-xs font-bold uppercase text-black">Filter by Status</label>
                    <select
                        className="select select-bordered select-sm md:select-md"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>

                <div className="form-control">
                    <label className="label text-xs font-bold uppercase text-black">Filter by Blood Group</label>
                    <select
                        className="select select-bordered select-sm md:select-md"
                        onChange={(e) => setBloodFilter(e.target.value)}
                    >
                        <option value="">All Groups</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* data show */}
            <div className="flex justify-center items-center w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-20">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map(request => (
                            <RequestCard key={request._id} req={request} />
                        ))
                    ) : (
                        <p className="text-center col-span-full text-gray-500 font-semibold">No requests found with these filters.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllRequest;