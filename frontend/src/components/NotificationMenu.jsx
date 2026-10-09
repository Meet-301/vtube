import { BellIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NotificationItem } from ".";
import { markAllAsRead, markAsRead, clearAllNotifications } from "../features/notificationSlice.js";
import { timeAgo } from "../utils/formatters.js";
import api from "../api/axios.js";

function NotificationMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { notifications: notificationsList, unreadCount } = useSelector(
        (state) => state.notification
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    async function handleItemClick(item) {
        const notifId = item.id || item._id;
        if (notifId) {
            dispatch(markAsRead(notifId));
            try {
                await api.patch(`/notifications/${notifId}/read`);
            } catch (err) {
                console.log("Failed to mark notification read on backend:", err);
            }
        }

        setIsOpen(false);

        if (item.videoId) {
            navigate(`/watch/${item.videoId}`);
        } else if (item.subscriberUsername) {
            navigate(`/channel/${item.subscriberUsername}`);
        }
    }

    async function handleMarkAllAsRead() {
        dispatch(markAllAsRead());
        try {
            await api.patch("/notifications/read-all");
        } catch (err) {
            console.log("Failed to mark all notifications read on backend:", err);
        }
    }

    async function handleClearAll() {
        dispatch(clearAllNotifications());
        try {
            await api.delete("/notifications/clear");
        } catch (err) {
            console.log("Failed to clear notifications on backend:", err);
        }
    }

    return (
        <div ref={menuRef} className="relative">
            {/* Notification button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
                title="Notifications"
                className="
                    flex
                    h-10 w-10 items-center justify-center
                    rounded-full
                    text-text-primary
                    transition-all duration-200
                    hover:bg-surface-elevated
                    active:scale-95
                    relative
                "
            >
                <BellIcon size={35} weight="regular" />

                {/* Badge Counter */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-md animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification popup */}
            {isOpen && (
                <div
                    className="
                    absolute right-0 top-full z-50 mt-2
                    w-[calc(100vw-1rem)]
                    max-w-96
                    sm:w-96
                    "
                >
                    <div className="rounded-2xl bg-surface-elevated p-2 shadow-2xl border border-white/10">

                        <div className="flex items-center justify-between px-3 py-2">
                            <h2 className="text-lg font-semibold text-text-primary">
                                Notifications
                            </h2>
                            {notificationsList.length > 0 && (
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleMarkAllAsRead}
                                            className="text-xs font-medium text-primary hover:underline cursor-pointer"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleClearAll}
                                        title="Clear all"
                                        className="text-xs text-text-muted hover:text-red-400 transition-colors cursor-pointer"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-border my-1" />

                        <div className="max-h-[70vh] overflow-y-auto space-y-1 scrollbar-none">
                            {notificationsList.length === 0 ? (
                                <div className="py-8 text-center text-xs text-text-muted">
                                    No notifications yet
                                </div>
                            ) : (
                                notificationsList.map((item) => (
                                    <NotificationItem
                                        key={item.id || item._id}
                                        avatar={item.avatar}
                                        thumbnail={item.thumbnail}
                                        message={item.message}
                                        time={timeAgo(item.createdAt) || "just now"}
                                        unread={item.unread}
                                        onClick={() => handleItemClick(item)}
                                    />
                                ))
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationMenu;