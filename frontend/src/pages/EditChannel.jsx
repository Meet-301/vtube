import {
    ImageIcon,
    XIcon,
    CheckCircleIcon,
} from "@phosphor-icons/react";

import { Link } from "react-router-dom";

function EditChannel() {

    return (
        <main className="px-4 py-6">

            <div className="mx-auto w-full max-w-4xl py-6">

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
                        Edit channel
                    </h1>
                </div>


                {/* ================= BANNER ================= */}

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
                        Channel banner
                    </h2>

                    <div
                        className="
                            mt-5
                            overflow-hidden
                            rounded-xl
                            bg-background
                        "
                    >

                        {/* Current banner */}

                        <div
                            className="
                                aspect-3/1
                                w-full
                                bg-surface-elevated
                            "
                        >
                            <img
                                src="https://picsum.photos/seed/channel-banner-edit/1500/500"
                                alt="Channel banner"
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />
                        </div>

                        {/* Change banner */}

                        <div className="p-4">

                            <button
                                type="button"
                                className="
                                    flex
                                    w-fit
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-border
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
                                <ImageIcon size={18} />

                                Change banner
                            </button>

                            <p
                                className="
                                    mt-2
                                    text-xs
                                    text-text-muted
                                "
                            >
                                JPG, PNG or WebP
                            </p>

                        </div>

                    </div>

                </section>


                {/* ================= CHANNEL DETAILS ================= */}

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
                        Channel information
                    </h2>

                    <div className="mt-6 space-y-5">

                        {/* Username */}

                        <div>

                            <label
                                htmlFor="username"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-text-primary
                                "
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                defaultValue="vkpujara"
                                placeholder="Enter username"
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
                                    placeholder:text-text-muted
                                    focus:border-primary
                                "
                            />

                        </div>


                        {/* Description */}

                        <div>

                            <label
                                htmlFor="description"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-text-primary
                                "
                            >
                                Channel description
                            </label>

                            <textarea
                                id="description"
                                rows={6}
                                defaultValue="Welcome to my channel. Here I share videos about development, technology and things I build."
                                placeholder="Tell viewers about your channel"
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
                                    placeholder:text-text-muted
                                    focus:border-primary
                                "
                            />

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

export default EditChannel;