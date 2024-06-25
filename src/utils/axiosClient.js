import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_API_URL;

const instance = axios.create({
    baseURL,
    timeout: 3000
});
	
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

	
instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        const {status} = error.response;
        if ( status === 401 || status === 403 ) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location = "/login";
        }
        return Promise.reject(error);
    }
);

export default instance;