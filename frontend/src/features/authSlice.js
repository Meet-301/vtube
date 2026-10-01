import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    accessToken: null,
    isInitializing: true
}

const authSlice = createSlice({
    name: "auth",   
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.isAuthenticated = false
        },
        updateUser: (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload
            }
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setInitializing: (state, action) => {
            state.isInitializing = action.payload;
        }
    }
})

export const {
    login, 
    logout, 
    updateUser, 
    setAccessToken,
    setInitializing
} = authSlice.actions;

export default authSlice.reducer;