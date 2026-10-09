import axios from "axios";
import store from "../app/store.js";
import {setAccessToken} from "../features/authSlice.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true //! to allow browser to send cookies to server
});

//! request interceptor
api.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().auth.accessToken

        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

//! response interceptor
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        const isAuthRequest =
            originalRequest?.url?.includes("/users/login") ||
            originalRequest?.url?.includes("/users/register") ||
            originalRequest?.url?.includes("/users/refresh-token");

        if (
            error.response?.status === 401 &&
            !originalRequest._retry && !isAuthRequest
        ) {
            originalRequest._retry = true;

            try {
                const response = await api.post("/users/refresh-token");

                const newAccessToken =
                    response.data?.data?.accessToken;

                if (!newAccessToken) {
                    return Promise.reject(error);
                }

                //! Save new access token in redux
                store.dispatch(setAccessToken(newAccessToken));

                //! Retry original request with the new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api