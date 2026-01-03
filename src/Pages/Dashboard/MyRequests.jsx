import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const MyRequests = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = 'https://blood-donor-server-two.vercel.app';

    // Fetch user's requests
    useEffect(() => {
        const fetchMyRequests = async () => {
            const token = localStorage.getItem('access-token');
            try {
                const res = await axios.get(`${API_BASE_URL}/my-requests/${user?.email}`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                setRequests(res.data || []);
            } catch (err) {
                console.error("Error loading requests", err);
                toast.error("Failed to load requests");
            } finally {
                setLoading(false);
            }
        };
        if (user?.email) fetchMyRequests();
    }, [user?.email]);

    // Delete request
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this request?")) return;

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
        } catch (err) {
            toast.error("Failed to delete request");
        }
    };

    // Update status
    const handleStatusChange = async (id, newStatus) => {
        const token = localStorage.getItem('access-token');
        try {
            const res = await axios.patch(
                `${API_BASE_URL}/donation-requests/update-status/${id}`,
                { status: newStatus },
                { headers: { authorization: `Bearer ${token}` } }
            );
            if (res.data.modifiedCount > 0) {
                toast.success(`Request marked as ${newStatus}`);
                setRequests(requests.map(req => req._id === id ? { ...req, donationStatus: newStatus } : req));
            }
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <span className="loading loading-bars loading-lg text-red-600"></span>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">My Donation Requests</h2>

            <div className="overflow-x-auto">
                <table className="table w-full">
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
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500">
                                    No requests found.
                                </td>
                            </tr>
                        ) : (
                            requests.map(req => (
                                <tr key={req._id} className="hover:bg-gray-100 transition">
                                    <td className="font-semibold text-red-600">
                                        {req.recipientName} <br />
                                        <span className="badge badge-sm">{req.bloodGroup}</span>
                                    </td>
                                    <td>{req.upazila}, {req.district}</td>
                                    <td>{req.donationDate} <br /> {req.donationTime}</td>
                                    <td>
                                        <span className={`badge font-bold ${
                                            req.donationStatus === 'pending' ? 'badge-error' :
                                            req.donationStatus === 'inprogress' ? 'badge-warning' :
                                            'badge-success'
                                        }`}>
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
                                    <td className="flex flex-wrap gap-2">
                                        <Link to={`/donation-details/${req._id}`} className="btn btn-xs btn-outline">View</Link>
                                        <Link to={`/dashboard/edit-request/${req._id}`} className="btn btn-xs btn-info text-white">Edit</Link>
                                        {req.donationStatus === 'inprogress' && (
                                            <>
                                                <button onClick={() => handleStatusChange(req._id, 'done')} className="btn btn-xs btn-success text-white">Done</button>
                                                <button onClick={() => handleStatusChange(req._id, 'canceled')} className="btn btn-xs btn-warning text-white">Cancel</button>
                                            </>
                                        )}
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
