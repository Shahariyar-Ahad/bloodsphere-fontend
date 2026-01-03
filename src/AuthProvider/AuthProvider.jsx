// AuthProvider.jsx

import React, { createContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import axios from 'axios'; // ব্যাকএন্ড থেকে তথ্য আনার জন্য
import auth from '../Firebase/Firebase.config';
import toast from 'react-hot-toast';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// আপনার ব্যাকএন্ডের বেস URL
const API_BASE_URL = 'https://blood-donor-server-two.vercel.app';

const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);
    // user স্টেটে Firebase ইউজার + ব্যাকএন্ডের role, status থাকবে
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null); // ব্যাকএন্ড থেকে আসা user ডেটা (role, status সহ)

    // 1. Register
    const registerWithEmailAndPassword = (email, pass) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, pass);
    };

    // 2. Login 
    const loginWithEmailAndPassword = (email, pass) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, pass);
    };

    // 3. Logout 
    const logOut = () => {
        setLoading(true);
        // JWT টোকেন লোকাল স্টোরেজ থেকে মুছে ফেলা
        localStorage.removeItem('access-token');
        setDbUser(null);
        return signOut(auth);
    };

    // ---------------- Google Login ----------------
    const googleProvider = new GoogleAuthProvider();
    const handleGoogleSignin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            // backend call for JWT & role/status
            const res = await axios.post(`${API_BASE_URL}/users/login`, {
                email: firebaseUser.email,
                socialLogin: true
            });

            const { token, user: backendUser } = res.data;
            localStorage.setItem('access-token', token);

            setDbUser(backendUser);
            setUser({ ...firebaseUser, ...backendUser });
            toast.success("Login Successful with Google!");
        } catch (err) {
            console.error("Google Login Error:", err);
            toast.error(err.message || "Google Login Failed!");
        } finally {
            setLoading(false);
        }
    };

    // 4. State Observer & JWT Token Handler
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // যদি Firebase এ ইউজার লগইন করা থাকে
            if (currentUser) {
                setUser(currentUser);

                // ব্যাকএন্ড থেকে রোল/স্ট্যাটাস ডেটা লোড করার ফাংশন
                const fetchUserRoleAndStatus = async (email) => {
                    const token = localStorage.getItem('access-token');

                    if (!token) {
                        // টোকেন না থাকলে, ব্যাকএন্ডের ডেটা লোড করার চেষ্টা করা হবে না
                        setLoading(false);
                        return;
                    }

                    try {
                        const res = await axios.get(`${API_BASE_URL}/users/${email}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        // ব্যাকএন্ডের ডেটা (role, status, district, ইত্যাদি) সেভ করা
                        setDbUser(res.data);

                    } catch (error) {
                        console.error("Error fetching user data/role:", error.response?.data?.message || error.message);
                        // টোকেন অবৈধ হলে বা সার্ভার এরর হলে লগআউট করে দেওয়া
                        if (error.response?.status === 401 || error.response?.status === 403) {
                            logOut(); // লগআউট ফাংশন কল করা
                        }
                    } finally {
                        setLoading(false);
                    }
                };

                // Firebase ইউজার পেলে ব্যাকএন্ডের ডেটা লোড করা
                fetchUserRoleAndStatus(currentUser.email);

            } else {
                // ইউজার লগআউট করা থাকলে বা টোকেন না থাকলে
                setUser(null);
                setDbUser(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []); // Dependency হিসেবে কিছু নেই, কারণ এটি শুধুমাত্র মাউন্টের সময় একবার রান হবে

    // Final consolidated user object
    const finalUser = user && dbUser ? {
        ...user,
        ...dbUser, // ব্যাকএন্ডের role, status, etc. যুক্ত করা
        role: dbUser.role, // নিশ্চিত করা
        status: dbUser.status, // নিশ্চিত করা
    } : null;

    // AuthProvider.jsx এর ভেতরে 

const authData = {
    registerWithEmailAndPassword,
    handleGoogleSignin,
    loginWithEmailAndPassword,
    logOut,
    setUser,
    setDbUser, // এটি নতুন যোগ করুন
    user: finalUser, 
    loading,
    setLoading,
};

    return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;