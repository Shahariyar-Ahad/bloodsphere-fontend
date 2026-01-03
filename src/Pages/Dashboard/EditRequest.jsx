import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const API_BASE_URL = 'https://blood-donor-server-two.vercel.app';

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/donation-requests/${id}`);
                setRequest(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load request data');
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

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
            const res = await axios.patch(
                `${API_BASE_URL}/update-request/${id}`,
                updatedInfo,
                { headers: { authorization: `Bearer ${token}` } }
            );

            if (res.data.modifiedCount > 0) {
                toast.success('Request Updated Successfully!');
                navigate('/dashboard/my-requests');
            } else {
                toast('No changes detected');
            }
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            toast.error('Update failed!');
        } finally {
            setUpdating(false);
        }
    };

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

    return (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-lg border-l-8 border-red-600">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
                ✏️ Edit Blood Request
            </h2>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-5">
                <input
                    type="text"
                    name="recipientName"
                    defaultValue={request.recipientName || ''}
                    className="input input-bordered"
                    placeholder="Recipient Name"
                    required
                />

                <input
                    type="text"
                    name="hospital"
                    defaultValue={request.hospitalName || ''}
                    className="input input-bordered"
                    placeholder="Hospital Name"
                    required
                />

                <input
                    type="text"
                    name="address"
                    defaultValue={request.fullAddress || ''}
                    className="input input-bordered"
                    placeholder="Full Address"
                    required
                />

                <div className="flex gap-4">
                    <input
                        type="date"
                        name="date"
                        defaultValue={request.donationDate || ''}
                        className="input input-bordered w-full"
                        required
                    />
                    <input
                        type="time"
                        name="time"
                        defaultValue={request.donationTime || ''}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <textarea
                    name="message"
                    defaultValue={request.message || ''}
                    className="textarea textarea-bordered"
                    placeholder="Additional message (optional)"
                />

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        disabled={updating}
                        className="btn btn-error text-white flex-1"
                    >
                        {updating ? 'Updating...' : 'Update Request'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-outline flex-1"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRequest;
