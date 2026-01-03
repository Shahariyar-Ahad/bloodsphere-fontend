import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import RequestCard from './RequestCard';
import { AuthContext } from '../AuthProvider/AuthProvider';

// my server link
const API_BASE_URL = 'https://blood-donor-server-two.vercel.app';

const Home = () => {
    const { user } = useContext(AuthContext)
    const [featuredRequests, setFeaturedRequests] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // featured donation request load
        const fetchFeaturedRequests = axios.get(`${API_BASE_URL}/donation-requests/featured`);

        // ২. জেলা ডেটা লোড (আপনার সার্ভার অনুযায়ী সঠিক পাথ: /public/districts)
        const fetchDistricts = axios.get(`${API_BASE_URL}/public/districts`);

        Promise.all([fetchFeaturedRequests, fetchDistricts])
            .then(([reqRes, distRes]) => {
                setFeaturedRequests(reqRes.data);
                setDistricts(distRes.data);
            })
            .catch(error => {
                console.error("Error loading home data:", error);

                console.log("Failed URL:", error.config?.url);
                toast.error("Failed to load data from server.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-red-600"></span>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Toaster position="top-left " />

            {/* Banner Section */}
            <section className="bg-red-500 text-white py-20 lg:py-32 relative overflow-hidden">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between">
                    <div className="lg:w-1/2 mb-10 lg:mb-0 z-10">
                        <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-4">
                            Give Blood. <br /> <span className="text-white drop-shadow-md">Save a Life.</span>
                        </h1>
                        <p className="text-xl lg:text-2xl font-light mb-8 opacity-90">
                            Join the largest network of voluntary blood donors in Bangladesh. Every donation counts.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/all-request" className="btn btn-lg bg-white text-red-600 hover:bg-gray-100 border-none shadow-xl font-bold">
                                See All Requests
                            </Link>
                            <div>
                                {!user ? <Link to="/register" className="btn btn-lg btn-outline text-white hover:bg-red-700 border-white">
                                    Become a Donor
                                </Link> : <Link to='/blogs' className=" m-4 btn btn-lg btn-outline bg-blue-950 text-white border-white ">
                                    welcome to blood sphere
                                    <br />
                                    Read our blogs
                                </Link>}
                            </div>
                            <Link to='/search-donors' className="btn btn-lg bg-white text-red-600 hover:bg-gray-100 border-none shadow-xl font-bold">
                                Search Donors
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Urgent Donation Requests Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
                        Urgent Donation Needs
                    </h2>
                    <p className="text-center text-gray-600 mb-12">
                        These patients need immediate blood support. Your help can save them.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredRequests.length > 0 ? (
                            featuredRequests.map((req) => (
                                <RequestCard key={req._id} req={req} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500 py-10">
                                No urgent requests found right now.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;