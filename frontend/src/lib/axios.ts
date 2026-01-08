import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                return api(originalRequest);
            } catch (refreshError) {
                // Handle logout or redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
