import { useEffect, useRef, useState } from "react";

import {
    BookmarkSimpleIcon,
    DotsThreeVerticalIcon,
    PencilSimpleIcon,
    PlayIcon,
    ShareNetworkIcon,
    TrashIcon
} from "@phosphor-icons/react";

import { VideoCardButton } from "./index.js";

function VideoCard({
    thumbnail,
    title,
    avatar,
    channelName,
    views,
    uploadedAt,
    duration,
    isEditable = false
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    //! Handle click outside of more menu
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

    //! Handle more button
    function handleToggleMenu() {
        if (!isMenuOpen && buttonRef.current) {
            const rect =
                buttonRef.current.getBoundingClientRect();

            const spaceBelow =
                window.innerHeight - rect.bottom;

            const estimatedMenuHeight = 120;

            setOpenUpward(
                spaceBelow < estimatedMenuHeight
            );
        }

        setIsMenuOpen((prev) => !prev);
    }

    return (
        <article
            className="
                group
                relative
                w-full
                transition-transform
                duration-150
                has-[button:active]:scale-[0.99]
            "
        >

            {/* ================= THUMBNAIL ================= */}

            <button
                type="button"
                className="
                    group
                    block
                    w-full
                    text-left
                "
            >
                <div
                    className="
                        relative
                        aspect-video
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

                    {/* Blue Play Button */}

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
                                bg-black/80
                                px-1.5
                                py-0.5
                                text-xs
                                font-medium
                                text-white
                            "
                        >
                            {duration}
                        </span>
                    )}
                </div>
            </button>


            {/* ================= VIDEO INFORMATION ================= */}

            <div
                className="
                    relative
                    mt-3
                    min-w-0
                "
            >

                {/* Main information */}

                <button
                    type="button"
                    className="
                        group
                        flex
                        w-full
                        min-w-0
                        gap-3
                        pr-11
                        text-left
                        transition-colors
                        duration-150
                    "
                >

                    {/* Avatar */}

                    {avatar && (
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
                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-5
                                    text-text-secondary
                                    sm:text-base
                                    sm:leading-6
                                "
                            >
                                {channelName}
                            </p>
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
                            {views} • {uploadedAt}
                        </p>

                    </div>

                </button>


                {/* ================= MORE BUTTON ================= */}

                <div
                    ref={menuRef}
                    className="
                        absolute
                        right-0
                        top-0
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
                            transition-colors
                            duration-200
                            hover:bg-surface-elevated
                            active:bg-surface-elevated
                            hover:text-text-primary
                            active:scale-95
                        "
                    >
                        <DotsThreeVerticalIcon
                            size={27}
                            weight="bold"
                        />
                    </button>

                    {/* ================= MORE MENU ================= */}

                    {isMenuOpen && (
                        <div
                            className={`
                                absolute
                                right-0
                                w-56
                                rounded-2xl
                                bg-surface-elevated
                                p-2
                                shadow-2xl
                                ${openUpward
                                    ? "bottom-full mb-2"
                                    : "top-full mt-2"
                                }
                            `}
                        >

                            {/* Share */}
                            <VideoCardButton icon={ShareNetworkIcon} text="Share" />

                            {/* Save */}
                            <VideoCardButton icon={BookmarkSimpleIcon} text="Save" />

                            {isEditable ? <VideoCardButton icon={PencilSimpleIcon} text="Edit" /> : null}

                            {isEditable ? <VideoCardButton icon={TrashIcon} text="Delete" /> : null}

                        </div>
                    )}

                </div>

            </div>

        </article>
    );
}

export default VideoCard;