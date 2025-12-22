import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import CheckoutForm from "./CheckoutForm"; 
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// ------------------- Stripe -------------------
const stripePromise = loadStripe("your_stripe_publishable_key_here"); // publishable key

const Funding = () => {
  const [payments, setPayments] = useState([]);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const fetchPayments = () => {
    axiosSecure.get("/payments").then((res) => setPayments(res.data));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ---------------- Manual Payment ----------------
  const handleManualPayment = async (e) => {
    e.preventDefault();
    const form = e.target;
    const paymentInfo = {
      name: user?.displayName,
      email: user?.email,
      amount: parseFloat(form.amount.value),
      method: form.method.value,
      phoneNumber: form.phoneNumber.value,
      date: new Date(),
    };

    try {
      const res = await axiosSecure.post("/payments", paymentInfo);
      if (res.data.insertedId) {
        toast.success("Payment Submitted!");
        setIsManualModalOpen(false);
        fetchPayments();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit payment");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-gradient-to-r from-red-600 to-red-800 p-10 rounded-2xl text-white shadow-lg">
        <div>
          <h2 className="text-3xl font-bold">Funding Records</h2>
          <p className="opacity-80 mt-1">Total contributions from our heroes.</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="btn bg-white text-red-600 hover:bg-gray-100 border-none font-bold px-6"
          >
            Manual Fund
          </button>
          <button
            onClick={() => setIsCardModalOpen(true)}
            className="btn bg-white text-red-600 hover:bg-gray-100 border-none font-bold px-6"
          >
            Card Payment
          </button>
        </div>
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
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{p.name}</td>
                <td>৳{p.amount}</td>
                <td>{p.method}</td>
                <td>{new Date(p.date).toLocaleDateString()}</td>
                <td>{p.phoneNumber || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- Manual Payment Modal ---------------- */}
      {isManualModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-xl text-center mb-4">Manual Funding</h3>
            <form onSubmit={handleManualPayment} className="space-y-4">
              <input
                type="number"
                name="amount"
                placeholder="Amount (BDT)"
                className="input input-bordered w-full"
                required
              />
              <select name="method" className="select select-bordered w-full" required>
                <option value="Bkash">Bkash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
              </select>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Your phone number"
                className="input input-bordered w-full"
                required
              />
              <div className="modal-action justify-between">
                <button
                  onClick={() => setIsManualModalOpen(false)}
                  type="button"
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-error text-white">
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- Card Payment Modal ---------------- */}
      {isCardModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-2xl text-center mb-4 text-red-600">Card Payment</h3>

            <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
              <p className="text-gray-700 font-medium">Paying as:</p>
              <p className="text-gray-900 font-semibold">{user?.displayName || "Anonymous"}</p>
              <p className="text-gray-600 text-sm">{user?.email || "No email available"}</p>
            </div>

            <input
              type="number"
              placeholder="Amount (BDT)"
              className="input input-bordered w-full mb-4"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {amount > 0 && (
              <Elements stripe={stripePromise}>
                <CheckoutForm price={parseFloat(amount)} closeModal={() => setIsCardModalOpen(false)} />
              </Elements>
            )}

            <div className="modal-action justify-between">
              <button
                onClick={() => setIsCardModalOpen(false)}
                type="button"
                className="btn btn-ghost"
              >
                Cancel
              </button>
              {amount > 0 && (
                <span className="text-gray-500 text-sm mt-1">
                  Your card will be charged only after confirming payment.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funding;


