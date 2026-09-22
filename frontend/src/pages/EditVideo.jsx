import { useState } from "react";

import {
    CheckCircleIcon,
    ImageIcon,
    PlayCircleIcon,
    XIcon,
} from "@phosphor-icons/react";

import { Link } from "react-router-dom";

function EditVideo() {

    const [isPublished, setIsPublished] = useState(true);

    return (
        <main className="px-4 py-6">

            <div className="mx-auto w-full max-w-5xl py-6">

                {/* ================= PAGE HEADER ================= */}

                <div>
                    <h1
                        className="
                            text-2xl
                            font-semibold
                            text-text-primary
                            md:text-3xl
                        "
                    >
                        Edit video
                    </h1>
                </div>


                {/* ================= VIDEO PREVIEW ================= */}

                <section
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-border
                        bg-surface
                        p-5
                        md:p-6
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-text-primary
                            md:text-xl
                        "
                    >
                        Video
                    </h2>

                    <div
                        className="
                            mt-5
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                        "
                    >

                        {/* Thumbnail */}

                        <div
                            className="
                                relative
                                aspect-video
                                w-full
                                overflow-hidden
                                rounded-xl
                                bg-background
                                sm:w-64
                                md:w-72
                            "
                        >
                            <img
                                src="https://picsum.photos/seed/edit-video/640/360"
                                alt="Video thumbnail"
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />

                            <div
                                className="
                                    absolute
                                    bottom-2
                                    right-2
                                    flex
                                    items-center
                                    gap-1.5
                                    rounded-md
                                    bg-black/80
                                    px-2
                                    py-1
                                    text-xs
                                    font-medium
                                    text-white
                                "
                            >
                                <PlayCircleIcon
                                    size={15}
                                    weight="fill"
                                />

                                12:34
                            </div>
                        </div>

                        {/* Video information */}

                        <div className="min-w-0 flex-1">

                            <h3
                                className="
                                    line-clamp-2
                                    text-lg
                                    font-semibold
                                    leading-6
                                    text-text-primary
                                "
                            >
                                MongoDB Aggregation Pipeline Tutorial
                            </h3>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-text-secondary
                                "
                            >
                                Uploaded 2 days ago
                            </p>

                        </div>

                    </div>

                </section>


                {/* ================= VIDEO DETAILS ================= */}

                <section
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-border
                        bg-surface
                        p-5
                        md:p-6
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-text-primary
                            md:text-xl
                        "
                    >
                        Video details
                    </h2>

                    <div className="mt-6 space-y-5">

                        {/* Title */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-text-primary
                                "
                            >
                                Title
                            </label>

                            <input
                                type="text"
                                defaultValue="MongoDB Aggregation Pipeline Tutorial"
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-border
                                    bg-background
                                    px-4
                                    text-sm
                                    text-text-primary
                                    outline-none
                                    transition-colors
                                    focus:border-primary
                                "
                            />

                        </div>


                        {/* Description */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-text-primary
                                "
                            >
                                Description
                            </label>

                            <textarea
                                rows={5}
                                defaultValue="Learn how MongoDB aggregation pipelines work and how to build efficient queries."
                                className="
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-border
                                    bg-background
                                    px-4
                                    py-3
                                    text-sm
                                    leading-6
                                    text-text-primary
                                    outline-none
                                    transition-colors
                                    focus:border-primary
                                "
                            />

                        </div>


                        {/* Thumbnail */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-text-primary
                                "
                            >
                                Thumbnail
                            </label>

                            <button
                                type="button"
                                className="
                                    flex
                                    min-h-32
                                    w-full
                                    flex-col
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-border
                                    bg-background
                                    px-4
                                    text-center
                                    transition-colors
                                    hover:bg-surface-elevated
                                    active:bg-surface-elevated
                                    active:scale-[0.99]
                                "
                            >
                                <ImageIcon
                                    size={28}
                                    className="text-text-secondary"
                                />

                                <span
                                    className="
                                        mt-2
                                        text-sm
                                        font-medium
                                        text-text-primary
                                    "
                                >
                                    Change thumbnail
                                </span>

                                <span
                                    className="
                                        mt-1
                                        text-xs
                                        text-text-muted
                                    "
                                >
                                    JPG, PNG or WebP
                                </span>

                            </button>

                        </div>

                    </div>

                </section>


                {/* ================= PUBLISHING ================= */}

                <section
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-border
                        bg-surface
                        p-5
                        md:p-6
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-text-primary
                            md:text-xl
                        "
                    >
                        Publishing
                    </h2>

                    <div
                        className="
                            mt-5
                            flex
                            items-center
                            justify-between
                            gap-4
                            rounded-xl
                            bg-background
                            px-4
                            py-4
                        "
                    >

                        <div className="min-w-0">

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-text-primary
                                "
                            >
                                {isPublished
                                    ? "Published"
                                    : "Unpublished"}
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-text-secondary
                                "
                            >
                                {isPublished
                                    ? "This video is visible to viewers."
                                    : "This video is hidden from viewers."}
                            </p>

                        </div>

                        {/* Switch */}

                        <button
                            type="button"
                            onClick={() => setIsPublished((prev) => !prev)}
                            className={`
                                relative
                                h-7
                                w-12
                                shrink-0
                                rounded-full
                                transition-colors
                                duration-200
                                ${isPublished
                                    ? "bg-primary"
                                    : "bg-surface-elevated"
                                }
                            `}
                        >
                            <span
                                className={`
                                    absolute
                                    top-1
                                    h-5
                                    w-5
                                    rounded-full
                                    bg-white
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    ${isPublished
                                        ? "right-1"
                                        : "left-1"
                                    }
                                `}
                            />
                        </button>

                    </div>

                </section>


                {/* ================= ACTIONS ================= */}

                <div
                    className="
                        mt-6
                        flex
                        flex-col-reverse
                        gap-3
                        sm:flex-row
                        sm:justify-end
                    "
                >

                    <Link
                        to="/channel"
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-full
                            border
                            border-border
                            bg-surface
                            px-6
                            py-2.5
                            text-sm
                            font-semibold
                            text-text-primary
                            transition-all
                            duration-200
                            hover:bg-surface-elevated
                            active:bg-surface-elevated
                            active:scale-95
                        "
                    >
                        <XIcon size={18} />

                        Cancel
                    </Link>

                    <button
                        type="button"
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-full
                            bg-primary
                            px-6
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition-all
                            duration-200
                            hover:bg-primary-hover
                            active:bg-primary-hover
                            active:scale-95
                        "
                    >
                        <CheckCircleIcon
                            size={18}
                            weight="bold"
                        />

                        Save changes
                    </button>

                </div>

            </div>

        </main>
    );
}

export default EditVideo;