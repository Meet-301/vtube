import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import notificationReducer from "../features/notificationSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        notification: notificationReducer,
    },
});

export default store;