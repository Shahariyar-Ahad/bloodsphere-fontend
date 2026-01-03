import axios from "axios";

const axiosSecure = axios.create({
    baseURL: 'https://blood-donor-server-two.vercel.app'
});

const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;