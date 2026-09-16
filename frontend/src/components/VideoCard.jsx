function VideoCard({
    thumbnail,
    title,
    avatar,
    channelName,
    views,
    uploadedAt,
}) {
    return (
        <article className="group cursor-pointer">
            {/* Thumbnail */}
            <div className="aspect-video overflow-hidden rounded-xl bg-surface">
                <img
                    src={thumbnail}
                    alt={title}
                    className="
                        h-full w-full object-cover
                        transition-transform duration-200
                        group-hover:scale-[1.02]
                    "
                />
            </div>

            {/* Video info */}
            <div className="mt-3 flex gap-3">
                {/* Channel avatar */}
                <img
                    src={avatar}
                    alt={channelName}
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                />

                {/* Text */}
                <div className="min-w-0">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-text-primary">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm text-text-secondary">
                        {channelName}
                    </p>

                    <p className="text-sm text-text-muted">
                        {views} • {uploadedAt}
                    </p>
                </div>
            </div>
        </article>
    );
}

export default VideoCard;