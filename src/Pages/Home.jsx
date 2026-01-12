import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import RequestCard from "./RequestCard";
import { AuthContext } from "../AuthProvider/AuthProvider";
import PageLoader from "./PageLoader";

const API_BASE_URL = "https://blood-donor-server-two.vercel.app";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [featuredRequests, setFeaturedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/donation-requests/featured`)
      .then(res => setFeaturedRequests(res.data))
      .catch(() => toast.error("Failed to load data"))
       .finally(() => setLoading(false));
  }, []);
  

  return (
    <div className="bg-base-100 text-base-content">
      <Toaster position="top-right" />

      {/* HERO SECTION */}
      <section className="bg-red-600 text-white min-h-[70vh] flex items-center">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10">
          <div>
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">
              Give Blood, <br /> Save a Life
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Join Bangladesh’s trusted blood donation network and help patients
              in urgent need.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/all-request" className="btn btn-lg bg-white text-red-600">
                View Requests
              </Link>

              {!user ? (
                <Link to="/register" className="btn btn-lg btn-outline text-white">
                  Become a Donor
                </Link>
              ) : (
                <Link to="/dashboard" className="btn btn-lg btn-outline text-white">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200 p-6">
              <h3 className="font-bold text-xl mb-2">Register</h3>
              <p>Create an account as a donor or requester</p>
            </div>
            <div className="card bg-base-200 p-6">
              <h3 className="font-bold text-xl mb-2">Find Match</h3>
              <p>Search donors or blood requests easily</p>
            </div>
            <div className="card bg-base-200 p-6">
              <h3 className="font-bold text-xl mb-2">Save Life</h3>
              <p>Donate blood and help someone survive</p>
            </div>
          </div>
        </div>
      </section>

      {/* URGENT REQUESTS */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Urgent Blood Requests
          </h2>
          <p className="text-center mb-12 opacity-70">
            Patients who need immediate blood support
          </p>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-60 w-full"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRequests.map(req => (
                <div key={req._id} className="min-h-[260px]">
                  <RequestCard req={req} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STATISTICS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="card bg-base-200 p-6">
              <h3 className="text-4xl font-bold text-red-600">5K+</h3>
              <p>Registered Donors</p>
            </div>
            <div className="card bg-base-200 p-6">
              <h3 className="text-4xl font-bold text-red-600">2K+</h3>
              <p>Requests Fulfilled</p>
            </div>
            <div className="card bg-base-200 p-6">
              <h3 className="text-4xl font-bold text-red-600">64</h3>
              <p>District Coverage</p>
            </div>
            <div className="card bg-base-200 p-6">
              <h3 className="text-4xl font-bold text-red-600">24/7</h3>
              <p>Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">What People Say</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-base-100 p-6">
              <p>"I found a donor within 30 minutes!"</p>
              <h4 className="font-bold mt-4">— Patient Family</h4>
            </div>
            <div className="card bg-base-100 p-6">
              <p>"Easy and trustworthy platform."</p>
              <h4 className="font-bold mt-4">— Voluntary Donor</h4>
            </div>
            <div className="card bg-base-100 p-6">
              <p>"This platform saves lives every day."</p>
              <h4 className="font-bold mt-4">— Hospital Staff</h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-red-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Save a Life?
        </h2>
        <Link to="/register" className="btn btn-lg bg-white text-red-600">
          Join as Donor
        </Link>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-10">FAQ</h2>

          <div className="space-y-4">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                Is blood donation safe?
              </div>
              <div className="collapse-content">
                <p>Yes, blood donation is completely safe.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                How often can I donate?
              </div>
              <div className="collapse-content">
                <p>Every 3–4 months depending on health.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
