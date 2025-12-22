import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { CardElement, useElements, useStripe, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Funding = () => {
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("Bkash");
  const [cardAmount, setCardAmount] = useState(0);

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const fetchPayments = () => {
    axiosSecure.get("/payments").then(res => setPayments(res.data));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Mobile Payment Submit
  const handleMobilePayment = async (e) => {
    e.preventDefault();
    const form = e.target;
    const amount = form.amount.value;
    const phoneNumber = form.phoneNumber.value;

    const paymentInfo = {
      name: user?.displayName,
      email: user?.email,
      amount: parseFloat(amount),
      method: selectedMethod,
      phoneNumber,
      date: new Date(),
    };

    const res = await axiosSecure.post("/payments", paymentInfo);
    if (res.data.insertedId) {
      toast.success("Payment submitted successfully!");
      setIsModalOpen(false);
      fetchPayments();
    }
  };

  // Card Payment Submit
  const handleCardPayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    try {
      const { data } = await axiosSecure.post("/create-payment-intent", { price: parseFloat(cardAmount) });
      const clientSecret = data.clientSecret;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { name: user?.displayName, email: user?.email },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const paymentInfo = {
          name: user?.displayName,
          email: user?.email,
          amount: parseFloat(cardAmount),
          method: "Card",
          transactionId: paymentIntent.id,
          date: new Date(),
        };

        const res = await axiosSecure.post("/payments", paymentInfo);
        if (res.data.insertedId) {
          toast.success("Card payment successful!");
          setIsModalOpen(false);
          fetchPayments();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Card payment failed!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 
        bg-gradient-to-r from-red-600 to-red-800 p-10 rounded-2xl text-white shadow-lg">
        <div>
          <h2 className="text-3xl font-bold">Funding Records</h2>
          <p className="opacity-80 mt-1">All contributions made by our heroes</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn bg-white text-red-600 hover:bg-gray-100 border-none font-bold px-8 mt-4 md:mt-0"
        >
          Give Fund
        </button>
      </div>

      {/* Payment Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Phone / TxnId</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={p._id || i}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td className="text-red-600 font-bold">৳{p.amount}</td>
                <td>{p.method}</td>
                <td>{new Date(p.date).toLocaleDateString()}</td>
                <td>{p.method === "Card" ? p.transactionId : p.phoneNumber}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No payment records yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-xl text-center mb-4">Give Fund</h3>

            {/* Payment Method Selector */}
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="select select-bordered w-full mb-4"
            >
              <option value="Bkash">Bkash</option>
              <option value="Nagad">Nagad</option>
              <option value="Rocket">Rocket</option>
              <option value="Card">Card</option>
            </select>

            {/* Mobile Payment Form */}
            {["Bkash","Nagad","Rocket"].includes(selectedMethod) && (
              <form onSubmit={handleMobilePayment} className="space-y-4">
                <input type="number" name="amount" placeholder="Amount (BDT)" className="input input-bordered w-full" required />
                <input type="text" name="phoneNumber" placeholder="Your Phone Number" className="input input-bordered w-full" required />
                <div className="modal-action">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                  <button type="submit" className="btn btn-error w-full text-white font-bold">Submit Payment</button>
                </div>
              </form>
            )}

            {/* Card Payment Form */}
            {selectedMethod === "Card" && (
              <form onSubmit={handleCardPayment} className="space-y-4">
                <input type="number" placeholder="Amount (BDT)" className="input input-bordered w-full" value={cardAmount} onChange={(e)=>setCardAmount(e.target.value)} required />
                <div className="p-4 border rounded-lg bg-gray-50">
                  <CardElement />
                </div>
                <div className="modal-action">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                  <button type="submit" className="btn btn-error w-full text-white font-bold">Pay Card</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default () => (
  <Elements stripe={stripePromise}>
    <Funding />
  </Elements>
);
