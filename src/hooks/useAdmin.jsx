import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import axios from "axios";

const useAdmin = () => {
    const { user, loading } = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminLoading, setIsAdminLoading] = useState(true);
    const API_BASE_URL = 'http://localhost:3500';

    useEffect(() => {
        const checkAdmin = async () => {
            if (user?.email) {
                try {
                    const token = localStorage.getItem('access-token');
                    const res = await axios.get(`${API_BASE_URL}/users/admin/${user?.email}`, {
                        headers: { authorization: `Bearer ${token}` }
                    });
                    setIsAdmin(res.data?.admin);
                } catch (error) {
                    console.error("Admin check failed", error);
                } finally {
                    setIsAdminLoading(false);
                }
            }
        };
        if (!loading) {
            checkAdmin();
        }
    }, [user?.email, loading]);

    return [isAdmin, isAdminLoading];
};

export default useAdmin;