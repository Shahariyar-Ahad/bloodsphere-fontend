// src/Pages/DonationRequestDetails.jsx

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router'; // URL থেকে আইডি নেওয়ার জন্য
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../AuthProvider/AuthProvider';

// আপনার ব্যাকএন্ডের বেস URL
const API_BASE_URL = 'http://localhost:3500'; 

const DonationRequestDetails = () => {
    const { user } = useContext(AuthContext); // লগইন করা ইউজার ডেটা
    const { id } = useParams(); // URL থেকে রিকোয়েস্ট আইডি নেওয়া
    const [donorPhone, setDonorPhone] = useState(user?.phone || user?.number || '');
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // মডাল স্টেট

    // ডেটা লোড করা
    
    useEffect(() => {
        const token = localStorage.getItem('access-token'); // টোকেন নেওয়া হলো
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        axios.get(`${API_BASE_URL}/donation-requests/${id}`, {
            headers: { authorization: `Bearer ${token}` } // হেডার পাঠানো হলো
        })
            .then(res => {
                setRequest(res.data);
                // toast.success("Request details loaded."); // বারবার লোড হলে এটি বিরক্তিকর হতে পারে, চাইলে রাখতে পারেন
            })
            .catch(error => {
                console.error("Error fetching request details:", error);
                toast.error("Failed to load request details.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    // ডোনেশন কনফার্মেশন লজিক (স্ট্যাটাস পরিবর্তন)
    const handleConfirmDonation = async (e) => {
    e.preventDefault();
    
    // ১. টোকেনটি লোকাল স্টোরেজ থেকে নিন
    const token = localStorage.getItem('access-token');

    if (request.donationStatus !== 'pending') {
        toast.error("This request is already in progress or completed.");
        return;
    }

    try {
        const updateData = { 
            status: 'inprogress', 
            donor: {
                name: user.displayName || user.name,
                email: user.email,
                phone: donorPhone // আপনার আগের অ্যাড করা ফোন নম্বর
            }
        };
        
        // ২. প্যাচ রিকোয়েস্টে হেডার যোগ করুন
        const res = await axios.patch(
            `${API_BASE_URL}/donation-requests/status/${id}`, 
            updateData, 
            {
                headers: { authorization: `Bearer ${token}` } // এই লাইনটি মিসিং ছিল
            }
        );
        
        if (res.data.modifiedCount > 0) {
            setRequest(prev => ({ ...prev, donationStatus: 'inprogress' })); // স্ট্যাটাস ফিল্ডের নাম চেক করুন (status না কি donationStatus)
            toast.success("Donation confirmed!");
            setIsModalOpen(false);
        }

    } catch (error) {
        console.error("Donation Confirmation Error:", error);
        toast.error("Unauthorized! Please login again.");
    }
};

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-red-600"></span>
        </div>;
    }

    if (!request) {
        return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
            Donation Request not found.
        </div>;
    }

    // প্রয়োজনীয় তথ্যের তালিকা
    const infoList = [
        { label: "Recipient Name", value: request.recipientName },
        { label: "Blood Group", value: request.bloodGroup, color: "text-red-600 font-bold text-2xl" },
        { label: "Needed Date", value: new Date(request.donationDate).toLocaleDateString() },
        { label: "Needed Time", value: request.donationTime},
        { label: "Location", value: `${request.upazila}, ${request.district}` },
        { label: "Hospital Name", value: request.hospitalName },
        { label: "Contact Person", value: request.contactName || "N/A" },
        { label: "Contact Phone", value: request.contactNumber || "N/A" },
        { label: "Reason", value: request.message|| "Urgent need." },
    ];
    
    // ডোনেট বাটন স্ট্যাটাস
    const isPending = request.donationStatus === 'pending';
    const buttonText = isPending ? "I Want to Donate" : (request.donationStatus === 'inprogress' ? "Donation In Progress" : "Request Completed");


    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Toaster position="top-left " />
            <div className="container mx-auto px-4 py-10">

                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
                    Donation Request Details
                </h1>
                
                {/* Main Details Card */}
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-2xl rounded-xl border-t-8 border-red-600 transition-all duration-500">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start border-b pb-4 mb-6">
                        <h2 className="text-3xl font-bold text-red-600">
                            {request.bloodGroup} Blood Needed
                        </h2>
                        <div className={`badge text-white font-bold p-3 text-sm ${isPending ? 'badge-error' : 'badge-success'}`}>
                            Status: {request.donationStatus.toUpperCase()}
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        {infoList.map((item, index) => (
                            <div key={index} className="flex flex-col border-b border-gray-100 pb-2">
                                <span className="text-sm font-semibold text-gray-500">{item.label}</span>
                                <span className={`text-lg font-medium text-gray-800 ${item.color || ''}`}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                    
                    {/* Reason/Notes (Full width) */}
                    <div className="mt-8 pt-4 border-t">
                         <span className="text-lg font-bold text-gray-700 block mb-2">Detailed Reason:</span>
                         <p className="text-gray-600 leading-relaxed bg-red-50 p-4 rounded-lg border border-red-200">
                             {request.reason || "No detailed reason provided."}
                         </p>
                    </div>

                    {/* Donate Button Section */}
                    <div className="mt-10 pt-6 border-t flex justify-center">
                        <button 
                            onClick={() => isPending ? setIsModalOpen(true) : null}
                            // হোম পেজের বাটন স্টাইল
                            className={`btn btn-lg font-bold shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isPending ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-400 text-white cursor-not-allowed'}`}
                            disabled={!isPending}
                        >
                            {buttonText}
                        </button>
                    </div>

                </div>
            </div>

            {/* Donation Confirmation Modal (DaisUI) */}
            {isModalOpen && (
                // backdrop-blur-sm যোগ করা হলো
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-red-500 p-8 rounded-lg w-full max-w-md shadow-2xl relative">
                        <h3 className="text-2xl font-bold text-white mb-4 border-b pb-2">Confirm Your Donation</h3>
                        
                        <form onSubmit={handleConfirmDonation} className="space-y-4">
                            
                            {/* Donor Name (Read Only) */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold text-black">Your Name (Read Only)</span>
                                </label>
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={user.displayName || user.name || 'Loading...'} 
                                    className="input input-bordered w-full bg-gray-800 cursor-not-allowed" 
                                />
                            </div>

                            {/* Donor Email (Read Only) */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold text-black">Your Email (Read Only)</span>
                                </label>
                                <input 
                                    type="email" 
                                    readOnly 
                                    value={user.email || 'Loading...'} 
                                    className="input input-bordered w-full bg-gray-800 cursor-not-allowed" 
                                />
                            </div>
                            <div>
    <label className="label">
        <span className="label-text font-semibold text-black">Your Phone Number</span>
    </label>
    <input 
        type="text" // 'number' এর বদলে 'text' ব্যবহার করা ভালো (যেমন: +880...)
        required
        value={donorPhone}
        onChange={(e) => setDonorPhone(e.target.value)}
        placeholder="Enter your contact number"
        className="input input-bordered w-full bg-white text-black border-gray-300" 
    />
</div>

                            <p className="text-sm text-text-black pt-2">
                                By confirming, the request status will change to "In Progress". Please ensure you are ready to donate.
                            </p>

                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="btn btn-ghost hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                
                                <button 
                                    type="submit" 
                                    className="btn bg-white text-black hover:bg-red-700 font-bold"
                                >
                                    Confirm Donation
                                </button>
                            </div>
                        </form>

                        <button 
                            onClick={() => setIsModalOpen(false)} 
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationRequestDetails;