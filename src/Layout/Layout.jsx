import React from 'react';
import { Outlet, useNavigation } from 'react-router';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PageLoader from '../Pages/PageLoader';


const Layout = () => {
    const navigation = useNavigation();

    return (
        <div className="min-h-screen flex flex-col">
            {/* 🔴 GLOBAL ROUTE CHANGE LOADER */}
            {navigation.state === "loading" && <PageLoader />}

            <Navbar />

            <div className="flex-1">
                <Outlet />
            </div>

            <Footer />
        </div>
    );
};

export default Layout;
