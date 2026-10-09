function NotificationItem({
    avatar,
    message,
    time,
    unread = false,
    thumbnail,
    onClick,
}) {
    return (
        <div
            onClick={onClick}
            className={`
                flex items-start gap-3
                rounded-xl px-3 py-3
                transition-colors duration-200
                hover:bg-surface
                cursor-pointer
                active:scale-95
                ${unread ? "bg-primary/5" : ""}
            `}
        >
            {/* Unread indicator */}
            <div className="flex w-2 shrink-0 justify-center items-center pt-2">
                {unread && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                )}
            </div>

            {/* Avatar */}
            <img
                src={avatar || "https://i.pravatar.cc/150?img=12"}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover"
            />

            {/* Content */}
            <div className="min-w-0 flex-1">
                <p className={`text-sm leading-5 ${unread ? "font-medium text-text-primary" : "text-text-secondary"}`}>
                    {message}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                    {time}
                </p>
            </div>

            {/* Video Thumbnail (if present) */}
            {thumbnail && (
                <img
                    src={thumbnail}
                    alt=""
                    className="h-10 w-16 shrink-0 rounded-lg object-cover"
                />
            )}
        </div>
    );
}

export default NotificationItem;