import { createBrowserRouter } from "react-router";
import Layout from "../Layout/Layout";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import DonationRequests from "../Pages/DonationRequest";
import PrivateRoute from "./PrivateRoutes";
import DonationRequestDetails from "../Pages/DonationRequestDetails";
import SearchDonors from "../Pages/SearchDonors";
import AllRequest from "../Pages/AllRequest";
import DonorHome from "../Pages/Dashboard/DonorHome";
import MyRequests from "../Pages/Dashboard/MyRequests";
import Dashboard from "../Layout/Dashboard";
import EditRequest from "../Pages/Dashboard/EditRequest";
import Profile from "../Pages/Dashboard/Profile";
import AllUsers from "../Pages/Dashboard/AllUsers";
import AdminRoute from "./AdminRoute";
import AdminHome from "../Pages/Dashboard/AdminHome";
import Blogs from "../Pages/Blogs";
import Funding from "../Pages/Funding";
import ErrorPage from "../Pages/Error";
import Payment from "../Pages/Payment";
import About from "../Pages/About";
import Contact from "../Pages/Contact";



const router = createBrowserRouter([
    {
        path: '/',
        errorElement:<ErrorPage></ErrorPage>,
        element: <Layout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: '/donation-requests', element: <DonationRequests /> },
            { path: '/all-request', element: <AllRequest /> },
            { path: '/donation-requests/:id', element: <PrivateRoute><DonationRequestDetails /></PrivateRoute> },
            { path: '/funding', element: <PrivateRoute><Funding></Funding></PrivateRoute> },
            {path: '/payment',element:<PrivateRoute><Payment /></PrivateRoute>},
            { path: '/search-donors', element: <SearchDonors /> },
            { path: '/blogs', element: <Blogs /> },
             { path: '/about', element: <About /> },
             { path: '/contact', element: <Contact /> },
            
           
            {
                path: "dashboard",
                element: <PrivateRoute><Dashboard /></PrivateRoute>,
                children: [
                    // for donor
                    { index: true, element: <DonorHome /> },
                    { path: "donor-home", element: <DonorHome /> },
                    { path: "my-requests", element: <MyRequests /> },
                    { path: "profile", element: <Profile /> },
                    { path: "edit-request/:id", element: <EditRequest /> },
                    
                    // for admin
                    {
                        path: "admin-home",
                        element: <AdminRoute><AdminHome /></AdminRoute>
                    },
                    {
                        path: "all-users",
                        element: <AdminRoute><AllUsers /></AdminRoute>
                    }
                ]
            }
        ]
    }
]);

export default router