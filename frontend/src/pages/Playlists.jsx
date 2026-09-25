import {
    PlusIcon,
    PlayCircleIcon,
} from "@phosphor-icons/react";

import {
    MoreButton,
    Sidebar,
} from "../components";

import { Link } from "react-router-dom";

function Playlists() {

    const playlists = [
        {
            thumbnail: "https://picsum.photos/seed/playlist1/640/360",
            title: "Watch Later",
            videoCount: "12 videos",
        },
        {
            thumbnail: "https://picsum.photos/seed/playlist2/640/360",
            title: "MERN Projects",
            videoCount: "8 videos",
        },
        {
            thumbnail: "https://picsum.photos/seed/playlist3/640/360",
            title: "React",
            videoCount: "15 videos",
        },
    ];

    return (

        <main className="flex min-w-0">

            {/* ================= SIDEBAR ================= */}

            <Sidebar />

            {/* ================= MAIN CONTENT ================= */}

            <div className="min-w-0 flex-1 p-4">

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-350
                        py-6
                    "
                >

                    {/* ================= PAGE HEADER ================= */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        {/* Title */}

                        <div>

                            <h1
                                className="
                                    text-2xl
                                    font-semibold
                                    text-text-primary
                                    md:text-3xl
                                "
                            >
                                Playlists
                            </h1>

                        </div>


                        {/* Create playlist */}

                        <Link
                            to="/playlists/create"
                            className="
                                flex
                                w-fit
                                items-center
                                justify-center
                                gap-2
                                rounded-full
                                bg-primary
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                transition-all
                                duration-200
                                hover:bg-primary-hover
                                active:bg-primary-hover
                                active:scale-95
                            "
                        >

                            <PlusIcon
                                size={20}
                                weight="bold"
                            />

                            <span>
                                Create playlist
                            </span>

                        </Link>

                    </div>


                    {/* ================= PLAYLISTS ================= */}

                    <section className="mt-8">

                        <div
                            className="
                                mt-5
                                grid
                                grid-cols-1
                                gap-x-4
                                gap-y-8
                                sm:grid-cols-2
                                lg:grid-cols-3
                                xl:grid-cols-4
                            "
                        >

                            {playlists.map((playlist) => (

                                <div
                                    key={playlist.title}
                                    className="
                                        relative
                                        min-w-0
                                    "
                                >

                                    {/* ================= PLAYLIST CLICK AREA ================= */}

                                    <button
                                        type="button"
                                        className="
                                            group
                                            block
                                            w-full
                                            min-w-0
                                            text-left
                                            transition-transform
                                            duration-150
                                            active:scale-95
                                        "
                                    >

                                        {/* ================= THUMBNAIL ================= */}

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
                                                src={playlist.thumbnail}
                                                alt={playlist.title}
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                    group-hover:scale-[1.02]
                                                "
                                            />


                                            {/* ================= VIDEO COUNT ================= */}

                                            <div
                                                className="
                                                    absolute
                                                    bottom-0
                                                    right-0
                                                    flex
                                                    items-center
                                                    gap-1.5
                                                    rounded-tl-lg
                                                    bg-black/80
                                                    px-3
                                                    py-1
                                                    text-sm
                                                    font-medium
                                                    text-white
                                                "
                                            >
                                                <PlayCircleIcon
                                                    size={15}
                                                    weight="fill"
                                                />

                                                <span>
                                                    {playlist.videoCount}
                                                </span>
                                            </div>

                                        </div>


                                        {/* ================= INFORMATION ================= */}

                                        <div className="mt-3 min-w-0 pr-10">

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
                                                "
                                            >
                                                {playlist.title}
                                            </h3>

                                        </div>

                                    </button>


                                    {/* ================= MORE BUTTON ================= */}

                                    <div
                                        className="
                                            absolute
                                            right-0
                                            top-[calc(100%-2.25rem)]
                                            z-10
                                        "
                                    >

                                        <MoreButton
                                            isEditable={true}
                                        />

                                    </div>

                                </div>

                            ))}

                        </div>

                    </section>

                </div>

            </div>

        </main>
    );
}

export default Playlists;