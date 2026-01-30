import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commentaryApi, getS3ProxyUrl } from '../actioncreator/api';

export { getS3ProxyUrl };

interface Commentary {
    _id: string;
    name: string;
    author: string;
    language_code: string;
    is_premium: boolean;
    cover_image_url: string | null;
    created_at: string;
}

interface CommentaryState {
    commentaries: Commentary[];
    loading: boolean;
    error: string | null;
    updating: boolean;
}

const initialState: CommentaryState = {
    commentaries: [],
    loading: false,
    error: null,
    updating: false,
};

export const fetchCommentaries = createAsyncThunk(
    'commentary/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await commentaryApi.getCommentaries();
            return response.data.content;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch commentaries');
        }
    }
);

export const updateCommentary = createAsyncThunk(
    'commentary/update',
    async ({ id, data }: { id: string; data: any }, thunkAPI) => {
        try {
            const response = await commentaryApi.updateCommentary(id, data);
            return response.data.content;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update commentary');
        }
    }
);

const commentarySlice = createSlice({
    name: 'commentary',
    initialState,
    reducers: {
        resetUpdating: (state) => {
            state.updating = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommentaries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCommentaries.fulfilled, (state, action) => {
                state.loading = false;
                state.commentaries = action.payload;
            })
            .addCase(fetchCommentaries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateCommentary.pending, (state) => {
                state.updating = true;
            })

            .addCase(updateCommentary.fulfilled, (state, action) => {
                const idx = state.commentaries.findIndex((s) => s._id === action.payload._id);
                if (idx !== -1) state.commentaries[idx] = action.payload;
                state.updating = false;
            })
            .addCase(updateCommentary.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetUpdating } = commentarySlice.actions;

export default commentarySlice.reducer;
