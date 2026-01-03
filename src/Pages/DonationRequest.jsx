// src/Pages/DonationRequests.jsx

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import PageLoader from './PageLoader';

const API_BASE_URL = 'https://blood-donor-server-two.vercel.app';

const DonationRequest = () => {
    const { user } = useContext(AuthContext);
    const [districts, setDistricts] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        axios.get(`${API_BASE_URL}/public/districts`)
            .then(res => setDistricts(res.data))
            .catch(err => console.error(err))
             .finally(() => setPageLoading(false));
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const requestData = {
            requesterName: user?.displayName,
            requesterEmail: user?.email,
            recipientName: form.recipientName.value,
            bloodGroup: form.bloodGroup.value,
            district: form.district.value,
            upazila: form.upazila.value,
            hospitalName: form.hospital.value,
            fullAddress: form.address.value,
            donationDate: form.date.value,
            donationTime: form.time.value,
            message: form.message.value,
            contactName: form.contactName.value,
            contactNumber: form.contactNumber.value,
        };

        try {
            const res = await axios.post(`${API_BASE_URL}/donation-requests`, requestData);
            if (res.data.insertedId) {
                toast.success("Blood Request Posted Successfully!");
                form.reset();
                navigate('/');
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };
    if (pageLoading) {
  return <PageLoader />;
}


    return (
        <div className="max-w-4xl mx-auto my-10 p-8 bg-[#FF3838] shadow-2xl rounded-2xl border-t-8 border-red-600">
            <Toaster position="top-left " />
            <h2 className="text-3xl font-bold text-center mb-8">Create Blood Request 🩸</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/*  */}
                <div className="form-control">
                    <label className="label font-semibold text-black">Requester Name</label>
                    <input type="text" value={user?.displayName} readOnly className="input input-bordered bg-[#5490e4] text-black" />
                </div>
                <div className="form-control">
                    <label className="label font-semibold text-white">Requester Email</label>
                    <input type="text" value={user?.email} readOnly className="input input-bordered bg-[#F9E7B2] text-black" />
                </div>

                {/* pt info */}
                <div className="form-control">
                    <label className="label font-semibold text-white">Recipient Name</label>
                    <input type="text" name="recipientName" placeholder="Patient Name" className="input input-bordered" required />
                </div>
                <div className="form-control">
                    <label className="label font-semibold text-white">Blood Group Needed</label>
                    <select name="bloodGroup" className="select select-bordered" required>
                        <option value="">Select Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                </div>

                {/* location */}
                <div className="form-control flex flex-col">
                    <label className="label font-semibold text-white">District</label>
                    <select name="district" className="select select-bordered" required>
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                </div>
                <div className="form-control flex flex-col">
                    <label className="label font-semibold text-white" >Upazila</label>
                    <input type="text" name="upazila" placeholder="Upazila Name" className="input input-bordered" required />
                </div>

                <div className="form-control md:col-span-2 flex flex-col">
                    <label className="label font-semibold text-white">Hospital Name</label>
                    <input type="text" name="hospital" placeholder="e.g. Dhaka Medical College" className="input input-bordered" required />
                </div>

                <div className="form-control md:col-span-2 flex flex-col">
                    <label className="label font-semibold text-white">Full Address</label>
                    <input type="text" name="address" placeholder="House no, Street, Area" className="input input-bordered" required />
                </div>

                <div className="form-control flex flex-col">
                    <label className="label font-semibold text-white">Donation Date</label>
                    <input type="date" name="date" className="input input-bordered" required />
                </div>
                <div className="form-control flex flex-col">
                    <label className="label font-semibold text-white">Donation Time</label>
                    <input type="time" name="time" className="input input-bordered" required />
                </div>

                <div className="form-control md:col-span-2 flex flex-col">
                    <label className="label font-semibold text-white">Why do you need blood? (Message)</label>
                    <textarea name="message" className="textarea textarea-bordered h-24" placeholder="Briefly describe the situation..."></textarea>
                </div>
                {/* contact info  */}
                {/* contact info */}
                <div className="form-control">
                    <label className="label font-semibold text-white">Contact name</label>
                    {/*  contactName */}
                    <input type="text" name='contactName' className="input input-bordered text-white" required />
                </div>
                <div className="form-control">
                    <label className="label font-semibold text-white">Contact number</label>
                    {/*  contactNumber  */}
                    <input type="text" name='contactNumber' className="input input-bordered text-black" required />
                </div>


                <button type="submit" className="btn btn-error w-full md:col-span-2 text-white text-lg font-bold mt-4">
                    Post Request
                </button>
            </form>
        </div>
    );
};

export default DonationRequest;