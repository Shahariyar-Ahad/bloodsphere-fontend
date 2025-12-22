import React, { useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../AuthProvider/AuthProvider';

const SearchDonors = () => {
    const { user } = useContext(AuthContext);
    const [donors, setDonors] = useState([]);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = 'http://localhost:3500';

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const bloodGroup = form.bloodGroup.value;
        const district = form.district.value;
        const upazila = form.upazila.value;

        const res = await axios.get(`${API_BASE_URL}/search-donors`, {
            params: { bloodGroup, district, upazila }
        });
        setDonors(res.data);
        setLoading(false);
    };

   
    const handleContact = async (id) => {
        if (!user) {
            return toast.error("Please login to see contact details!");
        }
        const res = await axios.get(`${API_BASE_URL}/donor-details/${id}`);
        setSelectedDonor(res.data);
        document.getElementById('contact_modal').showModal();
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-center text-red-600 mb-8 font-serif">Find a Life Saver ❤️</h2>
            
           
            <form onSubmit={handleSearch} className="bg-white p-8 rounded-2xl shadow-xl border grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-10">
                <div className="form-control">
                    <label className="label font-bold text-gray-600">Blood Group</label>
                    <select name="bloodGroup" className="select select-bordered" required>
                        <option value="">Select Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="form-control">
                    <label className="label font-bold text-gray-600">District</label>
                    <input type="text" name="district" className="input input-bordered" placeholder="Search District" />
                </div>
                <div className="form-control">
                    <label className="label font-bold text-gray-600">Upazila</label>
                    <input type="text" name="upazila" className="input input-bordered" placeholder="Search Upazila" />
                </div>
                <button type="submit" className="btn btn-error text-white font-bold">Search Now</button>
            </form>

           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map(donor => (
                    <div key={donor._id} className="card bg-white shadow-xl border-t-4 border-red-500 hover:shadow-2xl transition-all duration-300">
                        <div className="card-body">
                            <div className="flex items-center gap-4">
                                <div className="avatar">
                                    <div className="w-16 rounded-full ring ring-red-500 ring-offset-base-100 ring-offset-2">
                                        <img src={donor.image} alt={donor.name} />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="card-title text-gray-800">{donor.name}</h2>
                                    <p className="text-sm text-gray-500">{donor.district}, {donor.upazila}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-2xl font-black text-red-600">{donor.bloodGroup}</span>
                                <button onClick={() => handleContact(donor._id)} className="btn btn-sm btn-outline btn-error">View Contact</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Contact Details Modal --- */}
            <dialog id="contact_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-blue-400">
                    <h3 className="font-bold text-2xl text-red-600 mb-4 border-b pb-2">Donor Information</h3>
                    {selectedDonor && (
                        <div className="space-y-3">
                            <p className="text-lg"><strong>Name:</strong> {selectedDonor.name}</p>
                            <p className="text-lg"><strong>Phone:</strong> <span className="text-blue-600 font-bold">{selectedDonor.phone || selectedDonor.number || 'Not Provided'}</span></p>
                            <p className="text-lg"><strong>Email:</strong> {selectedDonor.email}</p>
                            <p className="text-lg"><strong>Blood Group:</strong> <span className="badge badge-error text-white p-3 font-bold">{selectedDonor.bloodGroup}</span></p>
                            <p className="text-lg"><strong>Address:</strong> {selectedDonor.upazila}, {selectedDonor.district}</p>
                            
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mt-4">
                                <p className="text-xs text-yellow-800">⚠️ Please confirm the urgency and location before calling the donor.</p>
                            </div>
                        </div>
                    )}
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-error text-white">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default SearchDonors;