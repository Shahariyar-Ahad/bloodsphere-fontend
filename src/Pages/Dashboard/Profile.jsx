import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = 'http://localhost:3500';

    // ডেটা লোড করা
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${API_BASE_URL}/user/${user?.email}`, {
                headers: { authorization: `Bearer ${token}` }
            });
            setUserData(res.data);
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) fetchUserData();
    }, [user?.email]);

    
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedInfo = {
            name: form.name.value,
            phone: form.phone.value,
            district: form.district.value,
            upazila: form.upazila.value,
            bloodGroup: form.bloodGroup.value,
        };

        try {
            const token = localStorage.getItem('access-token');
            const res = await axios.patch(`${API_BASE_URL}/user/update/${user?.email}`, updatedInfo, {
                headers: { authorization: `Bearer ${token}` }
            });

            if (res.data.modifiedCount > 0) {
                toast.success("Profile Updated Successfully!");
                fetchUserData(); 
                document.getElementById('edit_profile_modal').close(); 
            }
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-ring loading-lg text-red-600"></span></div>;

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden mt-10 border border-gray-100 mb-20">
            <Toaster />
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 h-32 flex justify-center items-end">
                <div className="avatar -mb-12">
                    <div className="w-32 rounded-full border-4 border-white shadow-lg">
                        <img src={userData?.image || "https://i.ibb.co/v3p693F/user-placeholder.png"} alt="User profile" />
                    </div>
                </div>
            </div>
            
            <div className="pt-16 pb-10 px-10 text-center">
                <h2 className="text-3xl font-extrabold text-gray-800">{userData?.name}</h2>
                <span className="badge badge-error text-white mt-2 font-bold p-3">Blood Group: {userData?.bloodGroup}</span>
                
                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 text-left">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-semibold text-black">{userData?.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-semibold text-blue-600 ">{userData?.phone || 'Not Added Yet'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500">District</p>
                        <p className="font-semibold text-black">{userData?.district}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500">Upazila</p>
                        <p className="font-semibold text-black">{userData?.upazila}</p>
                    </div>
                </div>

                <button 
                    onClick={() => document.getElementById('edit_profile_modal').showModal()}
                    className="btn btn-error mt-10 text-white w-full max-w-xs shadow-lg"
                >
                    Edit Profile
                </button>
            </div>

            {/* --- Edit Profile Modal --- */}
            <dialog id="edit_profile_modal" className="modal">
                <div className="modal-box bg-white max-w-2xl">
                    <h3 className="font-bold text-2xl text-red-600 border-b pb-2 mb-4">Update Profile Information</h3>
                    
                    <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label font-bold text-black">Full Name</label>
                            <input type="text" name="name" defaultValue={userData?.name} className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label font-bold text-black">Phone Number</label>
                            <input type="text" name="phone" defaultValue={userData?.phone} placeholder="017XXXXXXXX" className="input input-bordered text-blue-600 font-bold" required />
                        </div>
                        <div className="form-control">
                            <label className="label font-bold text-black">Blood Group</label>
                            <select name="bloodGroup" defaultValue={userData?.bloodGroup} className="select select-bordered">
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label font-bold text-black">District</label>
                            <input type="text" name="district" defaultValue={userData?.district} className="input input-bordered" required />
                        </div>
                        <div className="form-control md:col-span-2 text-black">
                            <label className="label font-bold">Upazila:</label>
                            <input type="text" name="upazila" defaultValue={userData?.upazila} className="input input-bordered text-white" required />
                        </div>

                        <div className="modal-action md:col-span-2">
                            <button type="submit" className="btn btn-error text-white">Save Changes</button>
                            <button type="button" onClick={() => document.getElementById('edit_profile_modal').close()} className="btn bg-red-500 ">Cancel</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default Profile;