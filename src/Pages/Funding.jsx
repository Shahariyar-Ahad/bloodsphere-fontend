import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Funding = () => {
  const [payments, setPayments] = useState([]);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Load all funding records
  useEffect(() => {
    axiosSecure.get("/payments")
      .then(res => setPayments(res.data));
  }, [axiosSecure]);

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 
        bg-gradient-to-r from-red-600 to-red-800 p-10 rounded-2xl text-white shadow-lg">

        <div>
          <h2 className="text-3xl font-bold">Funding Records</h2>
          <p className="opacity-80 mt-1">
            All contributions made by our supporters
          </p>
        </div>

        {/* Stripe Button */}
        <button
          onClick={() => navigate("/payment")}
          className="btn bg-white text-red-600 hover:bg-gray-100 
          border-none font-bold px-8 mt-4 md:mt-0"
        >
          Give Fund
        </button>
      </div>

      {/* Funding Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>#</th>
              <th>Donor Name</th>
              <th>Amount (BDT)</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id || index}>
                <td>{index + 1}</td>
                <td className="font-medium">{payment.name}</td>
                <td className="font-bold text-red-600">
                  ৳ {payment.amount}
                </td>
                <td>
                  {new Date(payment.date).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No funding records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Funding;
