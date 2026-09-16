function NotificationItem({
    avatar,
    message,
    time,
    unread = false,
}) {
    return (
        <div
            className="
                flex items-start gap-3
                rounded-xl px-3 py-3
                transition-colors duration-200
                hover:bg-surface
            "
        >
            {/* Unread indicator */}
            <div className="flex w-2 shrink-0 justify-center items-center pt-2">
                {unread && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                )}
            </div>

            {/* Avatar */}
            <img
                src={avatar}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover"
            />

            {/* Content */}
            <div className="min-w-0 flex-1">
                <p className="text-sm leading-5 text-text-primary">
                    {message}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                    {time}
                </p>
            </div>
        </div>
    );
}

export default NotificationItem;