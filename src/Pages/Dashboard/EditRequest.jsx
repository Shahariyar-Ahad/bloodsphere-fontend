import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState({});
    const API_BASE_URL = 'https://blood-donor-server-two.vercel.app';

    useEffect(() => {

        axios.get(`${API_BASE_URL}/donation-requests/${id}`)
            .then(res => setRequest(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedInfo = {
            recipientName: form.recipientName.value,
            hospitalName: form.hospital.value,
            fullAddress: form.address.value,
            donationDate: form.date.value,
            donationTime: form.time.value,
            message: form.message.value,
        };

        const token = localStorage.getItem('access-token');
        try {
            const res = await axios.patch(`${API_BASE_URL}/update-request/${id}`, updatedInfo, {
                headers: { authorization: `Bearer ${token}` }
            });
            if (res.data.modifiedCount > 0) {
                toast.success("Request Updated Successfully!");
                navigate('/dashboard/my-requests');
            }
        } catch (error) {
            toast.error("Update failed!");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6 text-red-600">Edit Blood Request</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
                <input type="text" name="recipientName" defaultValue={request.recipientName} className="input input-bordered" placeholder="Recipient Name" />
                <input type="text" name="hospital" defaultValue={request.hospitalName} className="input input-bordered" placeholder="Hospital Name" />
                <input type="text" name="address" defaultValue={request.fullAddress} className="input input-bordered" placeholder="Full Address" />
                <div className="flex gap-4">
                    <input type="date" name="date" defaultValue={request.donationDate} className="input input-bordered w-full" />
                    <input type="time" name="time" defaultValue={request.donationTime} className="input input-bordered w-full" />
                </div>
                <textarea name="message" defaultValue={request.message} className="textarea textarea-bordered" placeholder="Message"></textarea>
                <button className="btn btn-error text-white">Update Request</button>
            </form>
        </div>
    );
};

export default EditRequest;