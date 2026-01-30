import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../actioncreator/api';

interface AuthState {
    user: any | null;
    token: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            const { content } = response.data;
            const token = content.accessToken || content.token || content.access_token;
            const refreshToken = content.refreshToken || content.refresh_token;
            const user = content.user;

            if (token) {
                localStorage.setItem('token', token);
                if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));
                return { token, refreshToken, user };
            } else {
                return rejectWithValue('No token found in response');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const refreshTokenThunk = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.refreshToken();
            const { content } = response.data;
            const token = content.accessToken || content.token || content.access_token;
            const refreshToken = content.refreshToken || content.refresh_token;

            if (token) {
                localStorage.setItem('token', token);
                if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
                return { token, refreshToken };
            } else {
                return rejectWithValue('No token found in response');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken || null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(refreshTokenThunk.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken || state.refreshToken;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
