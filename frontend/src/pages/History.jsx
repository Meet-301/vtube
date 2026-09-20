import { TrashIcon } from "@phosphor-icons/react";

import { SearchButton } from "../components";

function History() {
    return (
        <main className="px-4 py-6">
            <div className="mx-auto w-full max-w-350">

                {/* ================= PAGE HEADER ================= */}
                <div className="relative">

                    {/* ================= TITLE ================= */}
                    <div>
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
                    </div>


                    {/* ================= HISTORY CONTROLS ================= */}
                    <aside
                        className="
                            mt-6
                            rounded-2xl
                            bg-surface
                            p-4

                            lg:absolute
                            lg:right-0
                            lg:top-0
                            lg:mt-0
                            lg:w-72
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
                        <div className="my-4 border-t border-border" />


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


                {/* ================= TODAY ================= */}
                <section className="mt-8">

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


                    {/* History videos will come here */}

                </section>

            </div>
        </main>
    );
}

export default History;