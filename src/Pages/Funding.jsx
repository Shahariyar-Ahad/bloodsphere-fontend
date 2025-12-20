import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../hooks/useAxiosSecure';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Funding = () => {
    const [payments, setPayments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    // data load korlam
    const fetchPayments = () => {
        axiosSecure.get('/payments').then(res => setPayments(res.data));
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // payment submit korlam
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const amount = form.amount.value;
        const method = form.method.value;
        const  phoneNumber = form. phoneNumber.value;

        const paymentInfo = {
            name: user?.displayName,
            email: user?.email,
            amount: parseFloat(amount),
            method: method,
            phoneNumber:  phoneNumber,
            date: new Date(),
            status: 'success' 
        };

        const res = await axiosSecure.post('/payments', paymentInfo);
        if (res.data.insertedId) {
            toast.success("Payment Info Submitted! ");
            setIsModalOpen(false);
            fetchPayments();
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-gradient-to-r from-red-600 to-red-800 p-10 rounded-2xl text-white shadow-lg">
                <div>
                    <h2 className="text-3xl font-bold">Funding Records</h2>
                    <p className="opacity-80 mt-1">Total contributions from our heroes.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn bg-white text-red-600 hover:bg-gray-100 border-none font-bold px-8 mt-4 md:mt-0"
                >
                    Give Fund
                </button>
            </div>

            {/* Funding Table */}
            <div className="overflow-x-auto bg-pink-500 rounded-xl shadow-md border border-gray-200">
                <table className="table w-full">
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th>#</th>
                            <th>Donor Name</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Date</th>
                            <th>phoneNumber</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p, index) => (
                            <tr key={index} className="">
                                <td>{index + 1}</td>
                                <td className="font-medium text-gray-800">{p.name}</td>
                                <td className="text-black font-bold">৳{p.amount}</td>
                                <td><span className="badge badge-outline">{p.method}</span></td>
                                <td>{new Date(p.date).toLocaleDateString()}</td>
                                <td className="text-xs font-mono text-gray-400">{p. phoneNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Manual Payment Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-sm">
                        <h3 className="font-bold text-xl text-center mb-4">Give Funding</h3>
                        <p className="text-sm text-center text-gray-500 mb-6">
                            Send money to: <br />
                            <strong>Bkash/Nagad: 017XXXXXXXX</strong>
                        </p>
                        
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <input type="number" name="amount" placeholder="Amount (BDT)" className="input input-bordered w-full" required />
                            
                            <select name="method" className="select select-bordered w-full" required>
                                <option value="Bkash">Bkash</option>
                                <option value="Nagad">Nagad</option>
                                <option value="Rocket">Rocket</option>
                            </select>

                            <input type="text" name="phoneNumber" placeholder="your phone number" className="input input-bordered w-full" required />

                            <div className="modal-action">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-error text-white">Submit Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Funding;