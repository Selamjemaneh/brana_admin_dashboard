import axios from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://209.38.221.61:3005/api';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: any[] = [];
let lastHiddenAt: number | null = null;
const MAX_INACTIVE_DURATION = 1000 * 60 * 60 * 2; // 2 hours example

if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            lastHiddenAt = Date.now();
        }
    });
}

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const handleTokenExpiry = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken'); // Also remove refresh token
        window.location.href = '/login';
    }
};

const refreshTokenCall = async () => {
    const rt = localStorage.getItem('refreshToken');
    if (!rt) throw new Error('No refresh token available');

    const response = await axios.post(`${BASE_URL}/admin/auth/refresh-token`, {
        refreshToken: rt
    });

    const { content } = response.data;
    const newToken = content.accessToken || content.token || content.access_token;
    const newRefreshToken = content.refreshToken || content.refresh_token;

    if (newToken) {
        localStorage.setItem('token', newToken);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
    }
    return newToken;
};

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                if (config.headers.set) {
                    config.headers.set('Authorization', `Bearer ${token}`);
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const errorMessage =
            error?.response?.data?.msg ||
            error?.response?.data?.error ||
            error?.message;

        const isTokenExpired =
            error.response?.status === 401 ||
            errorMessage === "Token is Expired";

        if (isTokenExpired && !originalRequest._retry) {
            if (
                typeof document !== "undefined" &&
                document.visibilityState === "visible" &&
                lastHiddenAt &&
                Date.now() - lastHiddenAt > MAX_INACTIVE_DURATION
            ) {
                console.warn("Tab was inactive too long. Redirecting to login.");
                handleTokenExpiry();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = "Bearer " + token;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshTokenCall();
                processQueue(null, newToken);
                originalRequest.headers["Authorization"] = "Bearer " + newToken;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                handleTokenExpiry();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);


export const getS3ProxyUrl = (s3Path: string) => {
    return `${BASE_URL}/audio-bible/audio-url?s3path=${s3Path}`;
};

export const authApi = {
    login: (data: any) => api.post('admin/auth/login', data),
    refreshToken: () => api.post('admin/auth/refresh-token', {
        refreshToken: localStorage.getItem('refreshToken')
    }),
};

export const commentaryApi = {
    getCommentaries: () => api.get('admin/commentary'),
    updateCommentary: (id: string | number, formData: FormData) =>
        api.patch(`admin/commentary/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),
};

export const dictionaryApi = {
    getDictionaries: () => api.get('admin/dictionary'),
    updateDictionary: (id: string, formData: FormData) =>
        api.patch(`admin/dictionary/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),
};

export default api;
