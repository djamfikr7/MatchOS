import axios from 'axios';

const createApi = (baseURL: string) => {
    const api = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use((config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return api;
};

export const userApi = createApi('http://localhost:3001');
export const requestApi = createApi('http://localhost:3002');
export const matchingApi = createApi('http://localhost:3003');
