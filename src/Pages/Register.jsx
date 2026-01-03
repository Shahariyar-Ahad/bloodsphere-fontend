

import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 'react-router' থেকে 'react-router-dom' ভালো
import { AuthContext } from '../AuthProvider/AuthProvider';
import { updateProfile } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const API_BASE_URL = 'https://blood-donor-server-two.vercel.app';
const IMGBB_API_KEY = '1d55c827ddad96e5d5e8911d31ae9e2e';

const Register = () => {
    // ১. সব Hook এবং Context উপরে ডিক্লেয়ার করা হয়েছে
    const { registerWithEmailAndPassword, setLoading, setDbUser, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [allDistricts, setAllDistricts] = useState([]);
    const [districtLoading, setDistrictLoading] = useState(true);
    const [selectedDistrict, setSelectedDistrict] = useState('');

    // ২. ডিস্ট্রিক্ট ডাটা ফেচ করা
    useEffect(() => {
        setDistrictLoading(true);
        axios.get(`${API_BASE_URL}/public/districts`)
            .then(res => {
                setAllDistricts(res.data);
            })
            .catch(error => {
                console.error("Error fetching districts data:", error);
                toast.error("Failed to load district data.");
            })
            .finally(() => {
                setDistrictLoading(false);
            });
    }, []);

    // ৩. ডিস্ট্রিক্ট অনুযায়ী উপজেলা ফিল্টার
    const upazilas = selectedDistrict
        ? allDistricts.find(d => d.name === selectedDistrict)?.upazilla || []
        : [];

    const isFormDisabled = districtLoading;

    // ৪. সাবমিট হ্যান্ডলার (কম্পোনেন্টের ভেতরে)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirm_password.value;
        const photoFile = e.target.photo.files[0];
        const bloodGroup = e.target.bloodGroup.value;
        const district = e.target.district.value;
        const upazila = e.target.upazila.value;

        // ভ্যালিডেশন
        if (password !== confirmPassword) return toast.error("Password and Confirm Password do not match.");
        if (password.length < 6) return toast.error("Password must be at least 6 characters.");
        if (!/[A-Z]/.test(password)) return toast.error("Must contain an uppercase letter.");
        if (!/[a-z]/.test(password)) return toast.error("Must contain a lowercase letter.");
        if (!photoFile) return toast.error("Please upload an avatar image.");
        if (!district || !upazila) return toast.error("Select both District and Upazila.");

        setLoading(true);
        let avatarUrl = '';

        try {
            // ৫. ImgBB ইমেজ আপলোড
            const formData = new FormData();
            formData.append('image', photoFile);

            const imgbbRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                formData
            );

            if (!imgbbRes.data.success) {
                throw new Error("Image upload failed.");
            }
            avatarUrl = imgbbRes.data.data.display_url;

            // ৬. Firebase রেজিস্ট্রেশন
            const userCredential = await registerWithEmailAndPassword(email, password);
            
            // ৭. প্রোফাইল আপডেট
            await updateProfile(userCredential.user, { 
                displayName: name, 
                photoURL: avatarUrl 
            });

            // ৮. ব্যাকএন্ড ডাটাবেজে সেভ
            const backendFormData = {
                email,
                name,
                avatar: avatarUrl,
                bloodGroup,
                district,
                upazila,
                role: 'donor',
                status: 'active'
            };

            const backendRes = await axios.post(`${API_BASE_URL}/users/register`, backendFormData);

            // ৯. গ্লোবাল স্টেট আপডেট
            if (backendRes.data.token) {
                localStorage.setItem('access-token', backendRes.data.token);
                setDbUser(backendRes.data.user);
                setUser(userCredential.user);
            }

            toast.success("Registration successful!");
            navigate("/");

        } catch (err) {
            console.error("Registration failed:", err);
            const errorMessage = err.response?.data?.message || err.message;
            toast.error(errorMessage || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 flex items-center justify-center p-6 lg:p-10 min-h-screen bg-gray-100">
            <Toaster position="top-center" />
            <div className='max-w-md w-full p-8 bg-white rounded-xl shadow-2xl text-gray-800'>
                <h1 className='text-3xl font-bold font-sans text-center mb-6 text-red-600'>Join BloodSphere 🩸</h1>
                <p className="text-center text-sm text-gray-600 mb-6">Become a donor and help save lives.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input type="text" name="name" placeholder="Your Name"
                            className="input input-bordered w-full bg-gray-50 border-gray-300 focus:ring-red-500" required />
                    </div>

                    {/* Avatar */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Avatar Photo</label>
                        <input type="file" name="photo"
                            className="file-input file-input-bordered file-input-error w-full bg-gray-50" required />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" name="email" placeholder="example@donate.org"
                            className="input input-bordered w-full bg-gray-50 border-gray-300" required />
                    </div>

                    {/* Blood Group */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Blood Group</label>
                        <select name="bloodGroup" required className="select select-bordered w-full bg-gray-50">
                            <option value="">Select Blood Group</option>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                    </div>

                    {/* District */}
                    <div>
                        <label className="block text-sm font-medium mb-1">District</label>
                        <select name="district" required
                            disabled={isFormDisabled}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="select select-bordered w-full bg-gray-50 disabled:bg-gray-200">
                            <option value="">
                                {districtLoading ? 'Loading Districts...' : 'Select District'}
                            </option>
                            {allDistricts.map(d => (
                                <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Upazila */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Upazila</label>
                        <select name="upazila" required disabled={!selectedDistrict || isFormDisabled}
                            className="select select-bordered w-full bg-gray-50 disabled:bg-gray-200">
                            <option value="">
                                {selectedDistrict ? 'Select Upazila' : 'Select a District first'}
                            </option>
                            {upazilas.map(u => (
                                <option key={u.id} value={u.name}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input type='password' name="password" placeholder="••••••••"
                            className="input input-bordered w-full bg-gray-50 border-gray-300" required />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm Password</label>
                        <input type='password' name="confirm_password" placeholder="Confirm Password"
                            className="input input-bordered w-full bg-gray-50 border-gray-300" required />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isFormDisabled}
                        className="w-full bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors mt-6 disabled:bg-gray-400">
                        {districtLoading ? 'Processing...' : 'Register as Donor'}
                    </button>

                    <div className="text-center mt-3">
                        <p className="text-sm text-gray-600">
                            Already have an account? <Link to="/login" className="text-red-500 hover:text-red-700 font-medium underline">Login here</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;