import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import commentaryReducer from './slice/commentarySlice';
import dictionaryReducer from './slice/dictionarySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        commentary: commentaryReducer,
        dictionary: dictionaryReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Often needed for axios response objects or file uploads
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
