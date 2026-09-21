import { TrashIcon } from "@phosphor-icons/react";

import {
    CategoryBar,
    SearchButton,
    Sidebar,
    VideoCard,
} from "../components";

function History() {

    return (
        <main className="flex min-w-0">

            {/* ================= SIDEBAR ================= */}

            <Sidebar />

            {/* ================= MAIN CONTENT ================= */}

            <div className="min-w-0 flex-1 p-4">

                {/* ================= PAGE CONTENT ================= */}

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-350
                        py-6
                    "
                >

                    {/* ================= PAGE HEADER ================= */}

                    <div className="relative">

                        {/* Title */}

                        <h1
                            className="
                                text-2xl
                                font-semibold
                                text-text-primary
                                md:text-3xl
                            "
                        >
                            Watch history
                        </h1>


                        {/* ================= HISTORY CONTROLS ================= */}

                        <aside
                            className="
                                mt-6
                                rounded-2xl
                                bg-surface
                                p-4
                                xl:absolute
                                xl:right-0
                                xl:top-0
                                xl:mt-0
                                xl:w-72
                            "
                        >

                            {/* Search */}

                            <div className="group relative">

                                <input
                                    type="text"
                                    placeholder="Search watch history"
                                    className="
                                        h-11
                                        w-full
                                        rounded-full
                                        border
                                        border-border
                                        bg-background
                                        px-4
                                        pr-12
                                        text-sm
                                        text-text-primary
                                        outline-none
                                        placeholder:text-text-muted
                                        focus:border-primary
                                    "
                                />

                                <SearchButton />

                            </div>


                            {/* Divider */}

                            <div
                                className="
                                    my-4
                                    border-t
                                    border-border
                                "
                            />


                            {/* Clear history */}

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
                                    transition-all
                                    duration-200
                                    hover:bg-surface-elevated
                                    active:bg-surface-elevated
                                    active:scale-[0.99]
                                "
                            >

                                <TrashIcon
                                    size={20}
                                    weight="regular"
                                />

                                <span>
                                    Clear watch history
                                </span>

                            </button>

                        </aside>

                    </div>


                    {/* ================= HISTORY CONTENT ================= */}
                    <section
                        className="
                            mt-8
                            xl:pr-80
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
                            Today
                        </h2>

                        {/* ================= TODAY VIDEOS ================= */}
                        <div
                            className="
                                mt-5
                                w-full
                                max-w-5xl
                                space-y-6
                            "
                        >
                            <VideoCard
                                thumbnail="https://picsum.photos/seed/history1/640/360"
                                title="🔥 *FREE TEMPLATE* Create ATS Resume from Scratch | Freshers & Experienced"
                                channelName="Riya Ranjan"
                                views="5.7K views"
                                uploadedAt="2 days ago"
                                duration="8:55"
                                variant="horizontal"
                                isEditable={false}
                                onlyDelete={true}
                            />
                        </div>
                    </section>

                </div>

            </div>

        </main>
    );
}

export default History;