import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            const newNotif = {
                id: Date.now() + Math.random().toString(36).substring(2, 9),
                ...action.payload,
                unread: true,
                createdAt: action.payload.createdAt || new Date().toISOString(),
            };
            state.notifications.unshift(newNotif);
            state.unreadCount += 1;
        },
        markAllAsRead: (state) => {
            state.notifications.forEach((item) => {
                item.unread = false;
            });
            state.unreadCount = 0;
        },
        markAsRead: (state, action) => {
            const notif = state.notifications.find((n) => n.id === action.payload);
            if (notif && notif.unread) {
                notif.unread = false;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        clearAllNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
    },
});

export const {
    addNotification,
    markAllAsRead,
    markAsRead,
    clearAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
