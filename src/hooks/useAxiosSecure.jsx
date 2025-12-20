import axios from "axios";

const axiosSecure = axios.create({
    baseURL: 'http://localhost:3500' 
});

const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;