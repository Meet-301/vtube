import { useEffect, useRef, useState } from "react";
import {
    ThumbsUpIcon,
    ShareNetworkIcon,
    BookmarkSimpleIcon,
    DotsThreeIcon,
    ChatTextIcon
} from "@phosphor-icons/react";

function Watch() {
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);

    const moreRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                moreRef.current &&
                !moreRef.current.contains(event.target)
            ) {
                setIsMoreOpen(false);
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

    //! Handling code of more button's pop-up
    function handleToggleMenu() {
        if (!isMoreOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const estimatedMenuHeight = 100; //! approx height of 2 items

            setOpenUpward(spaceBelow < estimatedMenuHeight);
        }

        setIsMoreOpen((prev) => !prev);
    }

    return (
        <main className="px-4 py-6">
            <div className="mx-auto w-full max-w-350">

                <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">

                    {/* ================= MAIN CONTENT ================= */}
                    <section className="min-w-0">

                        {/* Video Player */}
                        <div className="aspect-video overflow-hidden rounded-2xl bg-surface">
                            <video
                                className="h-full w-full"
                                controls
                                poster="https://picsum.photos/seed/watch-video/1280/720"
                            >
                                <source
                                    src=""
                                    type="video/mp4"
                                />
                            </video>
                        </div>

                        {/* Video Title */}
                        <h1 className="mt-5 text-2xl font-semibold leading-8 text-text-primary">
                            MongoDB Aggregation Pipeline Tutorial
                        </h1>

                        {/* Views + Date */}
                        <p className="mt-2 text-base text-text-secondary">
                            21K views • 1 week ago
                        </p>

                        {/* ================= CHANNEL + ACTIONS ================= */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                            {/* Channel */}
                            <div className="flex min-w-0 items-center gap-3">

                                <img
                                    src="https://i.pravatar.cc/150?img=45"
                                    alt="Backend Lab"
                                    className="
                                        h-12
                                        w-12
                                        shrink-0
                                        rounded-full
                                        object-cover
                                    "
                                />

                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-text-primary">
                                        Backend Lab
                                    </p>

                                    <p className="text-sm text-text-secondary">
                                        12.4K subscribers
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="
                                        ml-2
                                        shrink-0
                                        rounded-full
                                        bg-primary
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition-all
                                        hover:bg-primary-hover
                                        active:bg-primary-hover
                                        active:scale-95
                                    "
                                >
                                    Subscribe
                                </button>

                            </div>

                            {/* ================= ACTIONS ================= */}
                            <div className="flex shrink-0 items-center gap-2">

                                {/* Like + Count */}
                                <button
                                    type="button"
                                    aria-label="Like video"
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        bg-surface
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-text-primary
                                        transition-all
                                        duration-200
                                        hover:bg-surface-elevated
                                        active:bg-surface-elevated
                                        active:scale-95
                                    "
                                >
                                    <ThumbsUpIcon
                                        size={21}
                                        weight="regular"
                                    />

                                    <span>
                                        1.2K
                                    </span>
                                </button>

                                {/* Comments Count */}
                                <button
                                    type="button"
                                    aria-label="Like video"
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        bg-surface
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-text-primary
                                        transition-all
                                        duration-200
                                        hover:bg-surface-elevated
                                        active:bg-surface-elevated
                                        active:scale-95
                                    "
                                >
                                    <ChatTextIcon
                                        size={21}
                                        weight="regular"
                                    />

                                    <span>
                                        1.2K
                                    </span>
                                </button>

                                {/* More */}
                                <div
                                    ref={moreRef}
                                    className="relative"
                                >
                                    <button
                                        ref={buttonRef}
                                        type="button"
                                        aria-label="More actions"
                                        aria-expanded={isMoreOpen}
                                        onClick={handleToggleMenu}
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-surface
                                            text-text-primary
                                            transition-all
                                            duration-200
                                            hover:bg-surface-elevated
                                            active:bg-surface-elevated
                                            active:scale-95
                                        "
                                    >
                                        <DotsThreeIcon
                                            size={24}
                                            weight="bold"
                                        />
                                    </button>

                                    {/* More Popup */}
                                    {isMoreOpen && (
                                        <div
                                            className={`
                                                absolute
                                                right-0
                                                ${openUpward ? "bottom-full" : "top-full"}
                                                z-30
                                                mt-2
                                                w-48
                                                overflow-hidden
                                                rounded-2xl
                                                border
                                                border-border
                                                bg-surface
                                                p-1.5
                                                shadow-2xl
                                            `}
                                        >

                                            {/* Share */}
                                            <button
                                                type="button"
                                                className="
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    rounded-xl
                                                    px-3
                                                    py-3
                                                    text-left
                                                    text-sm
                                                    font-medium
                                                    text-text-primary
                                                    transition-transform
                                                    duration-150
                                                    hover:bg-surface-elevated
                                                    active:bg-surface-elevated
                                                    active:scale-95
                                                "
                                            >
                                                <ShareNetworkIcon
                                                    size={21}
                                                    weight="regular"
                                                />

                                                <span>
                                                    Share
                                                </span>
                                            </button>



                                            {/* Save */}
                                            <button
                                                type="button"
                                                className="
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    rounded-xl
                                                    px-3
                                                    py-3
                                                    text-left
                                                    text-sm
                                                    font-medium
                                                    text-text-primary
                                                    transition-transform
                                                    duration-150
                                                    hover:bg-surface-elevated
                                                    active:bg-surface-elevated
                                                    active:scale-95
                                                "
                                            >
                                                <BookmarkSimpleIcon
                                                    size={21}
                                                    weight="regular"
                                                />

                                                <span>
                                                    Save
                                                </span>
                                            </button>

                                        </div>
                                    )}
                                </div>

                            </div>

                        </div>



                        {/* Description */}
                        <div className="mt-6 rounded-2xl bg-surface p-5">

                            <p className="text-sm font-semibold text-text-primary">
                                21K views • 1 week ago
                            </p>

                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-text-secondary">
                                In this video, we build and understand a complete
                                MongoDB aggregation pipeline with lookup, match,
                                grouping and sorting.
                            </p>

                        </div>

                    </section>



                    {/* ================= TIMESTAMP NOTES ================= */}
                    <aside className="min-w-0">

                        <div className="sticky top-24 rounded-2xl bg-surface p-5">

                            <div className="flex items-center justify-between gap-3">

                                <h2 className="text-xl font-semibold text-text-primary">
                                    Timestamp Notes
                                </h2>

                                <button
                                    type="button"
                                    className="
                                        shrink-0
                                        rounded-full
                                        bg-primary
                                        px-4
                                        py-2
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition-all
                                        hover:bg-primary-hover
                                        active:bg-primary-hover
                                        active:scale-95
                                    "
                                >
                                    + Add Note
                                </button>

                            </div>



                            <div className="my-4 border-t border-border" />



                            {/* Dummy Notes */}
                            <div className="space-y-3">

                                <button
                                    type="button"
                                    className="
                                        w-full
                                        rounded-xl
                                        p-3
                                        text-left
                                        transition-colors
                                        hover:bg-surface-elevated
                                        active:bg-surface-elevated
                                        active:scale-[0.99]
                                    "
                                >
                                    <span className="text-sm font-semibold text-primary">
                                        02:14
                                    </span>

                                    <p className="mt-1 text-sm leading-5 text-text-secondary">
                                        Important concept explained here.
                                    </p>
                                </button>



                                <button
                                    type="button"
                                    className="
                                        w-full
                                        rounded-xl
                                        p-3
                                        text-left
                                        transition-colors
                                        hover:bg-surface-elevated
                                        active:bg-surface-elevated
                                        active:scale-[0.99]
                                    "
                                >
                                    <span className="text-sm font-semibold text-primary">
                                        05:37
                                    </span>

                                    <p className="mt-1 text-sm leading-5 text-text-secondary">
                                        MongoDB aggregation pipeline starts.
                                    </p>
                                </button>



                                <button
                                    type="button"
                                    className="
                                        w-full
                                        rounded-xl
                                        p-3
                                        text-left
                                        transition-colors
                                        hover:bg-surface-elevated
                                        active:bg-surface-elevated
                                        active:scale-[0.99]
                                    "
                                >
                                    <span className="text-sm font-semibold text-primary">
                                        11:42
                                    </span>

                                    <p className="mt-1 text-sm leading-5 text-text-secondary">
                                        Error handling explanation.
                                    </p>
                                </button>

                            </div>

                        </div>
                    </aside>

                    {/* ================= COMMENTS ================= */}
                    <section className="min-w-0 xl:col-start-1">

                        {/* Comments Header */}
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold text-text-primary">
                                248 Comments
                            </h2>
                        </div>


                        {/* Add Comment */}
                        <div className="mt-5 rounded-2xl bg-surface p-5">

                            <div className="flex gap-3">

                                {/* Current User Avatar */}
                                <img
                                    src="https://i.pravatar.cc/150?img=12"
                                    alt="Your profile"
                                    className="
                                        h-10
                                        w-10
                                        shrink-0
                                        rounded-full
                                        object-cover
                                    "
                                />

                                {/* Input + Button */}
                                <div className="min-w-0 flex-1">

                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="
                                            w-full
                                            border-b
                                            border-border
                                            bg-transparent
                                            px-1
                                            py-2
                                            text-sm
                                            text-text-primary
                                            outline-none
                                            placeholder:text-text-muted
                                            transition-colors
                                            focus:border-primary
                                        "
                                    />

                                    <div className="mt-3 flex justify-end">

                                        <button
                                            type="button"
                                            className="
                                                rounded-full
                                                bg-primary
                                                px-5
                                                py-2.5
                                                text-sm
                                                font-semibold
                                                text-white
                                                transition-all
                                                hover:bg-primary-hover
                                                active:bg-primary-hover
                                                active:scale-95
                                            "
                                        >
                                            Comment
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Comments List */}
                        <div className="mt-6 space-y-6">

                            {/* Dummy Comment 1 */}
                            <div className="flex gap-3">

                                <img
                                    src="https://i.pravatar.cc/150?img=45"
                                    alt="Code With Meet"
                                    className="
                    h-10
                    w-10
                    shrink-0
                    rounded-full
                    object-cover
                "
                                />

                                <div className="min-w-0 flex-1">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <p className="text-sm font-semibold text-text-primary">
                                            Code With Meet
                                        </p>

                                        <span className="text-xs text-text-muted">
                                            2 hours ago
                                        </span>

                                    </div>

                                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                                        This aggregation pipeline explanation was really helpful.
                                        The way lookup and match were explained made it much easier
                                        to understand.
                                    </p>

                                </div>

                            </div>


                            {/* Dummy Comment 2 */}
                            <div className="flex gap-3">

                                <img
                                    src="https://i.pravatar.cc/150?img=32"
                                    alt="Rahul"
                                    className="
                    h-10
                    w-10
                    shrink-0
                    rounded-full
                    object-cover
                "
                                />

                                <div className="min-w-0 flex-1">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <p className="text-sm font-semibold text-text-primary">
                                            Rahul
                                        </p>

                                        <span className="text-xs text-text-muted">
                                            5 hours ago
                                        </span>

                                    </div>

                                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                                        Great explanation! The aggregation examples were easy
                                        to follow.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>

                </div>

            </div>
        </main>
    );
}

export default Watch;