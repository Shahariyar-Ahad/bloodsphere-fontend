import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const CheckoutForm = ({ price, closeModal, user }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (price > 0) {
            axiosSecure.post('/create-payment-intent', { price })
                .then(res => setClientSecret(res.data.clientSecret))
                .catch(err => {
                    console.error("Stripe secret error:", err);
                    toast.error("Failed to initialize payment");
                });
        }
    }, [price, axiosSecure]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        setProcessing(true);

        // Create Payment Method
        const { error } = await stripe.createPaymentMethod({
            type: 'card',
            card,
            billing_details: {
                email: user?.email || 'anonymous@example.com',
                name: user?.displayName || 'Anonymous'
            }
        });

        if (error) {
            toast.error(error.message);
            setProcessing(false);
            return;
        }

        // Confirm Card Payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card,
                billing_details: {
                    email: user?.email || 'anonymous@example.com',
                    name: user?.displayName || 'Anonymous'
                }
            }
        });

        if (confirmError) {
            toast.error(confirmError.message);
            setProcessing(false);
            return;
        }

        if (paymentIntent?.status === 'succeeded') {
            const paymentInfo = {
                name: user?.displayName || 'Anonymous',
                email: user?.email || 'anonymous@example.com',
                amount: parseFloat(price),
                transactionId: paymentIntent.id,
                date: new Date(),
                method: 'Card'
            };

            try {
                const res = await axiosSecure.post('/payments', paymentInfo);
                if (res.data.insertedId) {
                    toast.success("Thank you for your donation! ❤️");
                    closeModal();
                } else {
                    toast.error("Payment saved failed");
                }
            } catch (err) {
                console.error("Save payment error:", err);
                toast.error("Payment saving failed");
            }
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border rounded-lg bg-gray-50 shadow-inner">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#9e2146' },
                        },
                    }}
                />
            </div>
            <button
                className="btn btn-error w-full text-white font-bold shadow-lg disabled:opacity-50"
                type="submit"
                disabled={!stripe || !clientSecret || processing}
            >
                {processing ? 'Processing...' : `Confirm Payment ৳${price}`}
            </button>
        </form>
    );
};

export default CheckoutForm;

