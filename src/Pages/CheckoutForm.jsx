import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const CheckoutForm = ({ price, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (price > 0) {
      axiosSecure.post("/create-payment-intent", { price })
        .then(res => setClientSecret(res.data.clientSecret));
    }
  }, [price, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { paymentIntent, error } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || "anonymous",
            email: user?.email || "anonymous",
          },
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
        amount: price,
        transactionId: paymentIntent.id,
        date: new Date(),
      };

      const res = await axiosSecure.post("/payments", paymentInfo);

      if (res.data.insertedId) {
        toast.success("Thank you for your donation ❤️");
        closeModal();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg bg-gray-50">
        <CardElement />
      </div>

      <button
        className="btn btn-error w-full text-white font-bold"
        type="submit"
        disabled={!stripe || !clientSecret}
      >
        Confirm Payment ৳{price}
      </button>
    </form>
  );
};

export default CheckoutForm;
