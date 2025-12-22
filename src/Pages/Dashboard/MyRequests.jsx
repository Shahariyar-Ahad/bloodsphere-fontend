import React, { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import { AuthContext } from '../../AuthProvider/AuthProvider';

const MyRequests = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = 'http://localhost:3500';

    useEffect(() => {
        const fetchMyRequests = async () => {
            const token = localStorage.getItem('access-token');
            try {
                const res = await axios.get(`${API_BASE_URL}/my-requests/${user?.email}`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                setRequests(res.data);
            } catch (error) {
                console.error("Error loading requests", error);
            } finally {
                setLoading(false);
            }
        };
        if (user?.email) fetchMyRequests();
    }, [user?.email]);

    // delete handler
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this request?")) {
            const token = localStorage.getItem('access-token');
            try {
                const res = await axios.delete(`${API_BASE_URL}/donation-requests/${id}`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                if (res.data.deletedCount > 0) {
                    toast.success("Request Deleted!");
                    setRequests(requests.filter(req => req._id !== id));
                }
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                toast.error("Failed to delete.");
            }
        }
    };
    const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem('access-token');
    try {
        const res = await axios.patch(`${API_BASE_URL}/donation-requests/update-status/${id}`, 
        { status: newStatus }, 
        { headers: { authorization: `Bearer ${token}` } });

        if (res.data.modifiedCount > 0) {
            toast.success(`Request marked as ${newStatus}`);
            // for ui update request list filter or map
            setRequests(requests.map(req => req._id === id ? { ...req, donationStatus: newStatus } : req));
        }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
        toast.error("Failed to update status");
    }
};

    if (loading) return <span className="loading loading-bars loading-lg text-red-600"></span>;

    return (
        <div className="bg-red-300 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">My Donation Requests</h2>
            
            <div className="overflow-x-auto">
                <table className="table w-full">
                    {/* Table Head */}
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th>Recipient</th>
                            <th>Location</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Donor Info</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-10 text-gray-500">No requests found.</td></tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req._id} className="hover:bg-black transition">
                                    <td className="font-semibold text-red-600">{req.recipientName} <br/><span className="badge badge-sm">{req.bloodGroup}</span></td>
                                    <td>{req.upazila}, {req.district}</td>
                                    <td>{req.donationDate} <br/> {req.donationTime}</td>
                                    <td>
                                        <span className={`badge font-bold ${req.donationStatus === 'pending' ? 'badge-error' : req.donationStatus === 'inprogress' ? 'badge-warning' : 'badge-success'}`}>
                                            {req.donationStatus}
                                        </span>
                                    </td>
                                    <td>
                                        {req.donationStatus === 'inprogress' ? (
                                            <div className="text-xs">
                                                <p className="font-bold">{req.donor?.name}</p>
                                                <p>{req.donor?.email}</p>
                                            </div>
                                        ) : "N/A"}
                                    </td>
                                    <td className="flex gap-2">
                                        <Link to={`/donation-details/${req._id}`} className="btn btn-xs btn-outline">View</Link>
                                        <button onClick={() => handleDelete(req._id)} className="btn btn-xs btn-error text-white">Delete</button>
                                    </td>
                                    <td className="flex gap-2">
    {/* inprogress button */}
    {req.donationStatus === 'inprogress' && (
        <>
            <button onClick={() => handleStatusChange(req._id, 'done')} className="btn btn-xs btn-success text-white">Done</button>
            <button onClick={() => handleStatusChange(req._id, 'canceled')} className="btn btn-xs btn-warning text-white">Cancel</button>
        </>
    )}
    <Link to={`/dashboard/edit-request/${req._id}`} className="btn btn-xs btn-info text-white">Edit</Link>
    <button onClick={() => handleDelete(req._id)} className="btn btn-xs btn-error text-white">Delete</button>
</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyRequests;