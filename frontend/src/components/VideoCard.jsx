import { useEffect, useRef, useState } from "react";

import {
    BookmarkSimpleIcon,
    DotsThreeVerticalIcon,
    FlagIcon,
    PlayIcon,
    ShareNetworkIcon,
    ThumbsDownIcon,
} from "@phosphor-icons/react";

function VideoCard({
    thumbnail,
    title,
    avatar,
    channelName,
    views,
    uploadedAt,
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    function handleToggleMenu() {
        if (!isMenuOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const estimatedMenuHeight = 100; //! approx height of 4 items

            setOpenUpward(spaceBelow < estimatedMenuHeight);
        }

        setIsMenuOpen((prev) => !prev);
    }

    return (
        <article className="relative w-full">

            {/* Main video card */}
            <button
                type="button"
                className="
                    group
                    block
                    w-full
                    text-left
                    active:scale-[0.99]
                    transition-transform duration-150
                "
            >
                {/* Thumbnail */}
                <div
                    className="
                        relative
                        aspect-video
                        overflow-hidden
                        rounded-2xl
                        bg-surface
                    "
                >
                    <img
                        src={thumbnail}
                        alt={title}
                        className="
                            h-full
                            w-full
                            object-cover
                            transition-transform duration-200
                            group-hover:scale-[1.02]
                        "
                    />

                    {/* Play */}
                    <span
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            flex
                            h-16
                            w-16
                            -translate-x-1/2
                            -translate-y-1/2
                            items-center
                            justify-center
                            rounded-full
                            bg-primary
                            text-white
                            opacity-0
                            scale-90
                            shadow-xl
                            transition-all duration-200
                            group-hover:opacity-100
                            group-hover:scale-100
                            group-active:opacity-100
                            group-active:scale-95
                        "
                    >
                        <PlayIcon
                            size={32}
                            weight="fill"
                        />
                    </span>
                </div>

                {/* Video information */}
                <div className="mt-4 flex gap-4 px-1">

                    {/* Avatar */}
                    <img
                        src={avatar}
                        alt={channelName}
                        className="
                            h-11
                            w-11
                            shrink-0
                            rounded-full
                            object-cover
                        "
                    />

                    {/* Information */}
                    <div className="min-w-0 flex-1 pr-8">

                        {/* Title */}
                        <h3
                            className="
                                line-clamp-2
                                text-xl
                                font-semibold
                                leading-7
                                text-text-primary
                            "
                        >
                            {title}
                        </h3>

                        {/* Channel */}
                        <p
                            className="
                                mt-1
                                text-base
                                leading-6
                                text-text-secondary
                            "
                        >
                            {channelName}
                        </p>

                        {/* Metadata */}
                        <p
                            className="
                                text-base
                                leading-6
                                text-text-muted
                            "
                        >
                            {views} • {uploadedAt}
                        </p>
                    </div>
                </div>
            </button>

            {/* More button */}
            <div
                ref={menuRef}
                className="
                    absolute
                    right-0
                    top-[calc(100%-105px)]
                    z-20
                "
            >
                <button
                    ref={buttonRef}
                    type="button"
                    aria-label="More options"
                    title="More"
                    onClick={handleToggleMenu}
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        text-text-secondary
                        transition-colors duration-200
                        hover:bg-surface-elevated
                        active:bg-surface-elevated
                        hover:text-text-primary
                        active:scale-95
                    "
                >
                    <DotsThreeVerticalIcon
                        size={28}
                        weight="bold"
                    />
                </button>

                {/* More menu */}
                {isMenuOpen && (
                    <div
                        className={`
                            absolute right-0
                            w-56
                            rounded-2xl
                            bg-surface-elevated
                            p-2
                            shadow-2xl
                            ${openUpward ? "bottom-full mb-2" : "top-full mt-2"}
                        `}
                    >
                        <button
                            type="button"
                            className="
                                flex w-full items-center gap-4
                                rounded-xl px-4 py-3
                                text-base text-text-primary
                                hover:bg-surface
                                active:bg-surface
                            "
                        >
                            <ShareNetworkIcon size={22} />
                            <span>Share</span>
                        </button>

                        <button
                            type="button"
                            className="
                                flex w-full items-center gap-4
                                rounded-xl px-4 py-3
                                text-base text-text-primary
                                hover:bg-surface
                                active:bg-surface
                            "
                        >
                            <BookmarkSimpleIcon size={22} />
                            <span>Save</span>
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}

export default VideoCard;