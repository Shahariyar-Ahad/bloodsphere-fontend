import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth"; // আপনার অথ হুক
import toast from "react-hot-toast";

const CheckoutForm = ({ price, closeModal }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (price > 0) {
            axiosSecure.post('/create-payment-intent', { price })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => console.error("Stripe secret error:", err));
        }
    }, [price, axiosSecure]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (card === null) return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card });

        if (error) {
            toast.error(error.message);
        } else {
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: { 
                        email: user?.email || 'anonymous', 
                        name: user?.displayName || 'anonymous' 
                    }
                }
            });

            if (confirmError) {
                toast.error(confirmError.message);
            } else if (paymentIntent.status === 'succeeded') {
                const paymentInfo = {
                    name: user?.displayName,
                    email: user?.email,
                    amount: parseFloat(price),
                    transactionId: paymentIntent.id,
                    date: new Date(),
                };
                
                const res = await axiosSecure.post('/payments', paymentInfo);
                if (res.data.insertedId) {
                    toast.success("Thank you for your donation! ❤️");
                    closeModal();
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border rounded-lg bg-gray-50">
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
                className="btn btn-error w-full text-white font-bold shadow-lg" 
                type="submit" 
                disabled={!stripe || !clientSecret}
            >
                Confirm Payment ${price}
            </button>
        </form>
    );
};

export default CheckoutForm; // এটি নিশ্চিত করবে 'default export' এররটি আর আসবে না