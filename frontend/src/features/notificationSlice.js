import { createSlice } from "@reduxjs/toolkit";

const getSavedNotifications = () => {
    try {
        const stored = localStorage.getItem("vtube_notifications_cache");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return {
                    notifications: parsed,
                    unreadCount: parsed.filter((n) => n.unread || !n.isRead).length,
                };
            }
        }
    } catch (e) {
        console.error("Failed to load notifications cache:", e);
    }
    return {
        notifications: [],
        unreadCount: 0,
    };
};

const savedState = getSavedNotifications();

const initialState = {
    notifications: savedState.notifications,
    unreadCount: savedState.unreadCount,
    isLoading: false,
};

const syncToStorage = (list) => {
    try {
        localStorage.setItem("vtube_notifications_cache", JSON.stringify(list.slice(0, 50)));
    } catch (e) {
        console.error("Failed to save notifications cache:", e);
    }
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            const list = Array.isArray(action.payload)
                ? action.payload
                : (action.payload?.notifications || []);

            const formatted = list.map((item) => ({
                ...item,
                id: item.id || item._id?.toString() || (Date.now() + Math.random().toString(36).substring(2, 7)),
                unread: item.unread ?? !item.isRead,
            }));

            state.notifications = formatted;
            state.unreadCount = formatted.filter((n) => n.unread).length;
            syncToStorage(formatted);
        },
        addNotification: (state, action) => {
            const payload = action.payload;
            const notifId = payload.id || payload._id?.toString() || (Date.now() + Math.random().toString(36).substring(2, 9));

            // Prevent duplicate notification
            const exists = state.notifications.some((n) => n.id === notifId || (n._id && n._id === payload._id));
            if (exists) return;

            const newNotif = {
                ...payload,
                id: notifId,
                unread: true,
                isRead: false,
                createdAt: payload.createdAt || new Date().toISOString(),
            };

            state.notifications.unshift(newNotif);
            state.unreadCount += 1;
            syncToStorage(state.notifications);
        },
        markAllAsRead: (state) => {
            state.notifications.forEach((item) => {
                item.unread = false;
                item.isRead = true;
            });
            state.unreadCount = 0;
            syncToStorage(state.notifications);
        },
        markAsRead: (state, action) => {
            const targetId = action.payload;
            const notif = state.notifications.find((n) => n.id === targetId || n._id === targetId);
            if (notif && notif.unread) {
                notif.unread = false;
                notif.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
                syncToStorage(state.notifications);
            }
        },
        clearAllNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
            syncToStorage([]);
        },
    },
});

export const {
    setNotifications,
    addNotification,
    markAllAsRead,
    markAsRead,
    clearAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
