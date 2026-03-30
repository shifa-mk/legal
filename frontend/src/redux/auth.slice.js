import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null, // Add this
    loading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            // If your login response returns { user, token }, handle both:
            if (action.payload?.token) {
                state.token = action.payload.token;
                state.user = action.payload.user;
            } else {
                // This covers the profile update where only user info comes back
                state.user = action.payload;
            }
        },
        clearUser: (state) => {
            state.user = null;
            state.token = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;