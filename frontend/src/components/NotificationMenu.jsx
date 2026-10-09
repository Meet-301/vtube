import { BellIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NotificationItem } from ".";
import { markAllAsRead, markAsRead, clearAllNotifications } from "../features/notificationSlice.js";
import { timeAgo } from "../utils/formatters.js";
import api from "../api/axios.js";

const MOBILE_QUERY = "(max-width: 639px)";

function NotificationMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches
    );

    const menuRef = useRef(null);
    const popupRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { notifications: notificationsList, unreadCount } = useSelector(
        (state) => state.notification
    );

    // Responsive check for mobile screen (< 640px)
    useEffect(() => {
        const mq = window.matchMedia(MOBILE_QUERY);
        const onChange = (event) => setIsMobile(event.matches);
        setIsMobile(mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    // Outside click / Escape handler
    useEffect(() => {
        if (!isOpen) return;

        function handleClick(event) {
            const target = event.target;
            if (
                menuRef.current?.contains(target) ||
                popupRef.current?.contains(target)
            ) {
                return;
            }
            setIsOpen(false);
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    // Lock background scroll when mobile bottom sheet is open
    useEffect(() => {
        if (!isOpen || !isMobile) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen, isMobile]);

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
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Notifications"
                aria-expanded={isOpen}
                title="Notifications"
                className="
                    flex
                    h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12
                    shrink-0 items-center justify-center
                    rounded-full
                    text-text-primary
                    transition-all duration-200
                    hover:bg-surface-elevated
                    active:bg-surface-elevated
                    active:scale-95
                    relative
                "
            >
                <BellIcon
                    size={24}
                    weight="regular"
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                />

                {/* Badge Counter */}
                {unreadCount > 0 && (
                    <span className="
                        absolute
                        top-1 right-1
                        sm:top-1.5 sm:right-1.5
                        md:top-2 md:right-2
                        flex h-4 min-w-4
                        items-center justify-center
                        rounded-full bg-red-600 px-1
                        text-[10px] font-bold text-white shadow-md animate-pulse
                    ">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification UI */}
            {isOpen && (
                isMobile ? (
                    createPortal(
                        <div
                            ref={popupRef}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Backdrop */}
                            <div
                                aria-hidden="true"
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 z-90 bg-black/60 backdrop-blur-xs transition-opacity"
                            />

                            {/* Mobile Bottom Sheet Drawer */}
                            <div
                                role="dialog"
                                aria-modal="true"
                                aria-label="Notifications"
                                className="
                                    fixed
                                    inset-x-0
                                    bottom-0
                                    z-100
                                    flex
                                    max-h-[85dvh]
                                    flex-col
                                    rounded-t-3xl
                                    bg-surface-elevated
                                    shadow-2xl
                                    border-t border-white/10
                                    pb-[calc(1rem+env(safe-area-inset-bottom))]
                                "
                            >
                                {/* Drag Pill */}
                                <div className="pt-3 pb-1 flex justify-center shrink-0">
                                    <div className="h-1.5 w-12 rounded-full bg-text-muted/40" />
                                </div>

                                {/* Sheet Header */}
                                <div className="flex items-center justify-between px-4 py-2.5 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-text-primary">
                                            Notifications
                                        </h2>
                                        {unreadCount > 0 && (
                                            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {notificationsList.length > 0 && (
                                            <>
                                                {unreadCount > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={handleMarkAllAsRead}
                                                        className="text-xs font-semibold text-primary hover:underline cursor-pointer"
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
                                            </>
                                        )}
                                        <button
                                            type="button"
                                            aria-label="Close"
                                            onClick={() => setIsOpen(false)}
                                            className="
                                                flex
                                                h-8 w-8
                                                touch-manipulation
                                                items-center justify-center
                                                rounded-full
                                                text-text-secondary
                                                transition-colors duration-150
                                                hover:bg-surface
                                                active:scale-95
                                                active:bg-surface
                                            "
                                        >
                                            <XIcon size={20} weight="bold" />
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-border shrink-0" />

                                {/* Notifications List */}
                                <div className="overflow-y-auto overscroll-contain flex-1 p-2 space-y-1">
                                    {notificationsList.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center text-text-muted">
                                            <BellIcon size={44} weight="light" className="mb-2 opacity-50" />
                                            <p className="text-sm font-semibold text-text-primary">No notifications yet</p>
                                            <p className="text-xs text-text-secondary mt-1">We'll notify you when someone subscribes or uploads a video.</p>
                                        </div>
                                    ) : (
                                        notificationsList
                                            .filter((item) => Boolean(item && (item._id || item.id)))
                                            .map((item) => (
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
                        </div>,
                        document.body
                    )
                ) : (
                    /* Desktop Dropdown */
                    <div
                        className="
                            absolute right-0 top-full z-50 mt-2
                            w-96
                            rounded-2xl bg-surface-elevated p-2 shadow-2xl border border-white/10
                        "
                    >
                        <div className="flex items-center justify-between px-3 py-2">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-text-primary">
                                    Notifications
                                </h2>
                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
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
                                <div className="flex flex-col items-center justify-center py-10 text-center text-text-muted">
                                    <BellIcon size={36} weight="light" className="mb-2 opacity-50" />
                                    <p className="text-sm font-medium">No notifications yet</p>
                                </div>
                            ) : (
                                notificationsList
                                    .filter((item) => Boolean(item && (item._id || item.id)))
                                    .map((item) => (
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
                )
            )}
        </div>
    );
}

export default NotificationMenu;