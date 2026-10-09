import {
    PlayIcon
} from "@phosphor-icons/react";

import { MoreButton } from "./index.js";
import { formatDuration, formatViews, timeAgo } from "../utils/formatters.js";
import { getWatchProgress } from "../utils/watchProgress.js";

function VideoCard({
    _id,
    thumbnail,
    title,
    avatar,
    channelName,
    views,
    createdAt,
    duration,
    description,
    progress,
    variant = "grid",
    deleteText = "Delete",
    saveButton = true,
    shareButton = true,
    editButton = true,
    deleteButton = true,
    onSaveClick = () => {},
    onShareClick = () => {},
    onEditClick = () => {},
    onDeleteClick = () => {}
}) {

    const isHorizontal = variant === "horizontal";
    const watchProgressPercent = progress ?? (_id ? getWatchProgress(_id)?.progress : 0);

    return (
        <article
            className={`
                group
                relative
                w-full
                min-w-0
                transition-transform
                duration-150
                has-[button:active:not(.more-btn)]:scale-[0.99]

                ${isHorizontal
                    ? "flex flex-col gap-3 sm:flex-row sm:gap-4"
                    : ""
                }
            `}
        >

            {/* ================= THUMBNAIL ================= */}

            <button
                type="button"
                className={`
                    group
                    block
                    text-left

                    ${isHorizontal
                        ? "w-full shrink-0 sm:w-72 md:w-80 lg:w-84"
                        : "w-full"
                    }
                `}
            >

                <div
                    className="
                        relative
                        aspect-video
                        w-full
                        overflow-hidden
                        rounded-2xl
                        bg-surface
                    "
                >

                    {/* Thumbnail */}

                    <img
                        src={thumbnail}
                        alt={title}
                        className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-200
                            group-hover:scale-[1.02]
                        "
                    />


                    {/* Dark overlay */}

                    <div
                        className="
                            absolute
                            inset-0
                            bg-black/0
                            transition-colors
                            duration-200
                            group-hover:bg-black/10
                            group-active:bg-black/10
                        "
                    />


                    {/* Play button */}

                    <span
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            flex
                            h-14
                            w-14
                            -translate-x-1/2
                            -translate-y-1/2
                            scale-90
                            items-center
                            justify-center
                            rounded-full
                            bg-primary
                            text-white
                            opacity-0
                            shadow-xl
                            transition-all
                            duration-200
                            group-hover:scale-100
                            group-hover:opacity-100
                            group-active:scale-95
                            group-active:opacity-100
                        "
                    >

                        <PlayIcon
                            size={30}
                            weight="fill"
                        />

                    </span>


                    {/* Duration */}

                    {duration && (
                        <span
                            className="
                                absolute
                                bottom-2
                                right-2
                                rounded-md
                                bg-black/60
                                px-1.5
                                py-0.5
                                text-md
                                font-medium
                                text-white
                            "
                        >
                            {formatDuration(duration)}
                        </span>
                    )}

                    {/* Blue Watch Progress Bar */}
                    {watchProgressPercent > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden rounded-b-2xl">
                            <div
                                className="h-full bg-primary transition-all duration-200"
                                style={{ width: `${Math.min(100, Math.max(0, watchProgressPercent))}%` }}
                            />
                        </div>
                    )}

                </div>

            </button>


            {/* ================= VIDEO INFORMATION ================= */}

            <div
                className={`
                    relative
                    min-w-0

                    ${isHorizontal
                        ? "flex-1 sm:mt-0 sm:pr-12"
                        : "mt-3"
                    }
                `}
            >

                {/* Main information */}

                <button
                    type="button"
                    className={`
                        group
                        flex
                        w-full
                        min-w-0
                        gap-3
                        text-left
                        transition-colors
                        duration-150

                        ${isHorizontal
                            ? "pr-10"
                            : "pr-11"
                        }
                    `}
                >

                    {/* Avatar */}

                    {!isHorizontal && avatar && (
                        <img
                            src={avatar}
                            alt={channelName || ""}
                            className="
                                h-11
                                w-11
                                shrink-0
                                rounded-full
                                object-cover
                            "
                        />
                    )}


                    {/* Text information */}

                    <div className="min-w-0 flex-1">

                        {/* Title */}

                        <h3
                            className="
                                line-clamp-2
                                text-lg
                                font-semibold
                                leading-6
                                text-text-primary
                                transition-colors
                                duration-150
                                group-hover:text-primary-hover
                                group-active:text-primary-hover
                                sm:text-xl
                                sm:leading-7
                            "
                        >
                            {title}
                        </h3>


                        {/* Channel */}

                        {channelName && (
                            <div className="mt-1 flex items-center gap-2">
                                {isHorizontal && avatar && (
                                    <img
                                        src={avatar}
                                        alt={channelName}
                                        className="h-6 w-6 rounded-full object-cover shrink-0"
                                    />
                                )}
                                <p
                                    className="
                                        text-sm
                                        leading-5
                                        text-text-secondary
                                        sm:text-base
                                        sm:leading-6
                                    "
                                >
                                    {channelName}
                                </p>
                            </div>
                        )}


                        {/* Metadata */}

                        <p
                            className="
                                text-sm
                                leading-5
                                text-text-muted
                                sm:text-base
                                sm:leading-6
                            "
                        >
                            {views === 0 ? "No views" : formatViews(views)} • {timeAgo(createdAt)}
                        </p>
                    </div>

                </button>


                {/* More */}

                <MoreButton
                    deleteText={deleteText}
                    saveButton={saveButton}
                    shareButton={shareButton}
                    editButton={editButton}
                    deleteButton={deleteButton}
                    onDeleteClick={onDeleteClick}
                    onEditClick={onEditClick}
                    onSaveClick={onSaveClick}
                    onShareClick={onShareClick}
                />

            </div>

        </article>
    );
}

export default VideoCard;