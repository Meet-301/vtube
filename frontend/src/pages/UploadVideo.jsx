import {
    CheckCircleIcon,
    ImageIcon,
    UploadSimpleIcon,
    VideoCameraIcon,
    XIcon,
} from "@phosphor-icons/react";

import { Link } from "react-router-dom";

function UploadVideo() {

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
                        Upload video
                    </h1>

                    
                </div>


                {/* ================= UPLOAD AREA ================= */}

                <section
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-dashed
                        border-border
                        bg-surface
                        p-6
                        md:p-10
                    "
                >

                    <div
                        className="
                            flex
                            min-h-72
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            bg-background
                            px-5
                            text-center
                        "
                    >

                        <div
                            className="
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-full
                                bg-surface-elevated
                                text-text-secondary
                            "
                        >
                            <VideoCameraIcon
                                size={32}
                                weight="regular"
                            />
                        </div>

                        <h2
                            className="
                                mt-5
                                text-lg
                                font-semibold
                                text-text-primary
                            "
                        >
                            Upload your video
                        </h2>

                        <p
                            className="
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-text-secondary
                            "
                        >
                            Drag and drop your video here, or select a
                            video from your device.
                        </p>

                        <button
                            type="button"
                            className="
                                mt-5
                                flex
                                items-center
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
                                active:scale-95
                            "
                        >
                            <UploadSimpleIcon
                                size={20}
                                weight="bold"
                            />

                            Select video
                        </button>

                        <p
                            className="
                                mt-3
                                text-xs
                                text-text-muted
                            "
                        >
                            MP4, WebM or MOV • Maximum 2 GB
                        </p>

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
                                placeholder="Enter video title"
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
                                    placeholder:text-text-muted
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
                                placeholder="Tell viewers about your video"
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
                                    placeholder:text-text-muted
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
                                    Add thumbnail
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
                        to="/"
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
                        <XIcon
                            size={18}
                        />

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

                        Upload video
                    </button>

                </div>

            </div>

        </main>
    );
}

export default UploadVideo;