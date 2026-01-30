import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dictionaryApi } from '../actioncreator/api';

interface Dictionary {
    _id: string;
    name: string;
    language_code: string;
    is_premium: boolean;
    cover_image_url: string | null;
    created_at: string;
}

interface DictionaryState {
    dictionaries: Dictionary[];
    loading: boolean;
    error: string | null;
    updating: boolean;
}

const initialState: DictionaryState = {
    dictionaries: [],
    loading: false,
    error: null,
    updating: false,
};

export const fetchDictionaries = createAsyncThunk(
    'dictionary/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dictionaryApi.getDictionaries();
            return response.data.content;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dictionaries');
        }
    }
);

export const updateDictionary = createAsyncThunk(
    'dictionary/update',
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const response = await dictionaryApi.updateDictionary(id, data);
            return response.data.content;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update dictionary');
        }
    }
);

const dictionarySlice = createSlice({
    name: 'dictionary',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDictionaries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDictionaries.fulfilled, (state, action) => {
                state.loading = false;
                state.dictionaries = action.payload;
            })
            .addCase(fetchDictionaries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateDictionary.pending, (state) => {
                state.updating = true;
            })
            .addCase(updateDictionary.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.dictionaries.findIndex((d) => d._id === action.payload._id);
                if (index !== -1) {
                    state.dictionaries[index] = action.payload;
                }
            })
            .addCase(updateDictionary.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload as string;
            });
    },
});

export default dictionarySlice.reducer;
