import { createSlice } from "@reduxjs/toolkit";

const getSavedUser = () => {
    try {
        const raw = localStorage.getItem("vtube_user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const getSavedToken = () => {
    try {
        return localStorage.getItem("vtube_accessToken") || null;
    } catch {
        return null;
    }
};

const savedUser = getSavedUser();
const savedToken = getSavedToken();

const initialState = {
    user: savedUser,
    isAuthenticated: !!(savedUser && savedToken),
    accessToken: savedToken,
    isInitializing: true,
};

const authSlice = createSlice({
    name: "auth",   
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;

            try {
                if (action.payload.user) {
                    localStorage.setItem("vtube_user", JSON.stringify(action.payload.user));
                }
                if (action.payload.accessToken) {
                    localStorage.setItem("vtube_accessToken", action.payload.accessToken);
                }
                if (action.payload.refreshToken) {
                    localStorage.setItem("vtube_refreshToken", action.payload.refreshToken);
                }
            } catch (e) {
                console.error("Failed to save auth to localStorage:", e);
            }
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;

            try {
                localStorage.removeItem("vtube_user");
                localStorage.removeItem("vtube_accessToken");
                localStorage.removeItem("vtube_refreshToken");
            } catch (e) {
                console.error("Failed to clear auth from localStorage:", e);
            }
        },
        updateUser: (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload,
            };
            try {
                localStorage.setItem("vtube_user", JSON.stringify(state.user));
            } catch (e) {
                console.error("Failed to update user in localStorage:", e);
            }
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            try {
                if (action.payload) {
                    localStorage.setItem("vtube_accessToken", action.payload);
                } else {
                    localStorage.removeItem("vtube_accessToken");
                }
            } catch (e) {
                console.error("Failed to update token in localStorage:", e);
            }
        },
        setInitializing: (state, action) => {
            state.isInitializing = action.payload;
        },
    },
});

export const {
    login, 
    logout, 
    updateUser, 
    setAccessToken,
    setInitializing,
} = authSlice.actions;

export default authSlice.reducer;