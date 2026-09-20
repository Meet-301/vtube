import { useState } from "react";

import {
    PencilSimpleIcon,
    PlayCircleIcon,
    PlusIcon,
    UploadSimpleIcon
} from "@phosphor-icons/react";

import { ChannelPageButton, VideoCard } from "../components";

function Channel() {

    //! Dummy data — baad mein API se aayega
    const channel = {
        fullName: "Viraj thakkar",
        username: "vkpujara",
        channelDescription:
            "Welcome to my channel. Here I share videos about development, technology and things I build.",
        avatar:
            "https://i.pravatar.cc/300?img=12",
        coverImage:
            "https://picsum.photos/seed/channel-cover/1600/500",
        subscribersCount: 0,
        subscribedToCount: 0,
        isSubscribed: false,
    };

    const videos = [
        {
            _id: 1,
            thumbnail:
                "https://picsum.photos/seed/channel1/640/360",
            title: "App Development Cost",
            views: 0,
            createdAt: "2026-08-10",
            duration: "0:41",
        },
        {
            _id: 2,
            thumbnail:
                "https://picsum.photos/seed/channel2/640/360",
            title: "MongoDB Aggregation Pipeline Tutorial",
            views: 21,
            createdAt: "2026-08-10",
            duration: "12:34",
        },
        {
            _id: 3,
            thumbnail:
                "https://picsum.photos/seed/channel3/640/360",
            title: "Building a Full Stack Video Platform",
            views: 12000,
            createdAt: "2026-08-08",
            duration: "18:21",
        },
    ];

    const playlists = [
        {
            id: 1,
            name: "Random Playlist",
            description:
                "Just curious about how playlists will be created",
            playlistCover:
                "https://picsum.photos/seed/playlist1/640/360",
            videoCount: 1,
        },
        {
            id: 2,
            name: "Web Development",
            description:
                "Web development related videos",
            playlistCover:
                "https://picsum.photos/seed/playlist2/640/360",
            videoCount: 5,
        },
    ];

    //! Temporary:
    //! Baad mein current logged-in user aur channel ID compare karenge.
    const isOwner = true;

    //! Mobile / tablet tabs
    const [activeTab, setActiveTab] = useState("videos");

    return (
        <main className="px-4 py-6">
            <div className="mx-auto w-full max-w-350">

                {/* ================= COVER ================= */}

                <div className="overflow-hidden rounded-2xl bg-surface">
                    <div
                        className="
                            h-40
                            w-full
                            bg-surface-elevated
                            sm:h-48
                            md:h-56
                            lg:h-64
                            xl:h-72
                        "
                    >
                        <img
                            src={channel.coverImage}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>

                {/* ================= CHANNEL INFO ================= */}

                <section className="mt-5">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

                        {/* Avatar */}

                        <img
                            src={channel.avatar}
                            alt={channel.fullName}
                            className="
                                h-24
                                w-24
                                shrink-0
                                rounded-full
                                object-cover
                                ring-4
                                ring-background
                            "
                        />

                        {/* Info */}

                        <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-3">

                                <h1
                                    className="
                                        text-2xl
                                        font-semibold
                                        text-text-primary
                                        md:text-3xl
                                    "
                                >
                                    {channel.fullName}
                                </h1>

                                {isOwner && (
                                    <ChannelPageButton icon={PencilSimpleIcon} text="Edit channel" />
                                )}

                            </div>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-text-secondary
                                    md:text-base
                                "
                            >
                                {channel.username}
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-text-secondary
                                "
                            >
                                {channel.subscribersCount} subscribers
                                {" • "}
                                {channel.subscribedToCount} subscriptions
                            </p>

                            <p
                                className="
                                    mt-4
                                    max-w-2xl
                                    whitespace-pre-line
                                    text-sm
                                    leading-6
                                    text-text-secondary
                                "
                            >
                                {channel.channelDescription}
                            </p>

                            {!isOwner && (
                                <button
                                    type="button"
                                    className="
                                        mt-5
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
                                    {channel.isSubscribed
                                        ? "Subscribed"
                                        : "Subscribe"}
                                </button>
                            )}

                        </div>

                    </div>

                </section>

                {/* ================= DIVIDER ================= */}

                <div className="my-8 border-t border-border" />

                {/* ==================================================
                    MOBILE / TABLET TABS (below lg screens)
                ================================================== */}

                <div className="lg:hidden">

                    {/* Tabs */}

                    <div
                        className="
                        flex
                            sticky
                            z-50
                            sm:top-14
                            md:top-20
                            rounded-xl
                            bg-surface
                            p-1
                        "
                    >

                        <button
                            type="button"
                            onClick={() => setActiveTab("videos")}
                            className={`
                                flex-1
                                rounded-lg
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                transition-all
                                duration-200
                                ${activeTab === "videos"
                                    ? "bg-surface-elevated text-text-primary"
                                    : "text-text-secondary hover:text-text-primary"
                                }
                            `}
                        >
                            Videos
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("playlists")}
                            className={`
                                flex-1
                                rounded-lg
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                transition-all
                                duration-200
                                ${activeTab === "playlists"
                                    ? "bg-surface-elevated text-text-primary"
                                    : "text-text-secondary hover:text-text-primary"
                                }
                            `}
                        >
                            Playlists
                        </button>

                    </div>

                    {/* ================= MOBILE VIDEOS ================= */}

                    {activeTab === "videos" && (
                        <section className="mt-8">

                            <div className="mt-5 space-y-8">

                                {videos.map((video) => (
                                    <VideoCard
                                        key={video._id}
                                        thumbnail={video.thumbnail}
                                        title={video.title}
                                        views={video.views}
                                        uploadedAt={video.createdAt}
                                        isEditable={true}
                                    />
                                ))}

                            </div>

                        </section>
                    )}

                    {/* ================= MOBILE PLAYLISTS ================= */}

                    {activeTab === "playlists" && (
                        <section className="mt-8">

                        <ChannelPageButton icon={PlusIcon} text="Add playlist" />

                            <div className="mt-5 space-y-5">

                                {playlists.map((playlist) => (

                                    <article
                                        key={playlist.id}
                                        className="
                                            group
                                            flex
                                            cursor-pointer
                                            gap-4
                                            rounded-2xl
                                            p-2
                                            transition-all
                                            duration-200
                                            hover:bg-surface
                                            active:scale-[0.99]
                                        "
                                    >

                                        {/* Playlist thumbnail */}

                                        <div
                                            className="
                                                relative
                                                aspect-video
                                                w-40
                                                shrink-0
                                                overflow-hidden
                                                rounded-xl
                                                bg-surface
                                                sm:w-48
                                            "
                                        >

                                            <img
                                                src={playlist.playlistCover}
                                                alt={playlist.name}
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                    transition-transform
                                                    duration-300
                                                    group-hover:scale-105
                                                "
                                            />

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
                                                    px-2.5
                                                    py-1.5
                                                    text-xs
                                                    font-medium
                                                    text-white
                                                "
                                            >
                                                <PlayCircleIcon
                                                    size={15}
                                                    weight="fill"
                                                />

                                                {playlist.videoCount}
                                            </div>

                                        </div>

                                        {/* Playlist information */}

                                        <div className="min-w-0 py-1">

                                            <h3
                                                className="
                                                    line-clamp-2
                                                    text-base
                                                    font-semibold
                                                    leading-6
                                                    text-text-primary
                                                    transition-colors
                                                    group-hover:text-primary-hover
                                                "
                                            >
                                                {playlist.name}
                                            </h3>

                                            <p
                                                className="
                                                    mt-1
                                                    line-clamp-2
                                                    text-sm
                                                    leading-5
                                                    text-text-secondary
                                                "
                                            >
                                                {playlist.description}
                                            </p>

                                            <p
                                                className="
                                                    mt-2
                                                    text-xs
                                                    text-text-muted
                                                "
                                            >
                                                {playlist.videoCount} videos
                                            </p>
                                        </div>

                                    </article>

                                ))}

                            </div>

                        </section>
                    )}

                </div>

                {/* ==================================================
                    DESKTOP lg layout
                ================================================== */}

                <div className="hidden lg:block">

                    {/* ================= VIDEOS ================= */}

                    <section className="mt-10">

                        <div className="flex items-center justify-between">

                            <h2
                                className="
                                    text-xl
                                    font-semibold
                                    text-text-primary
                                    md:text-2xl
                                "
                            >
                                Videos
                            </h2>

                        </div>

                        <div
                            className="
                                mt-5
                                grid
                                grid-cols-3
                                gap-x-4
                                gap-y-8
                                xl:grid-cols-4
                            "
                        >

                            {videos.map((video) => (

                                <VideoCard
                                    key={video._id}
                                    thumbnail={video.thumbnail}
                                    title={video.title}
                                    views={video.views}
                                    uploadedAt={video.createdAt}
                                    isEditable={true}
                                />

                            ))}

                        </div>
                    </section>

                    {/* ================= PLAYLISTS ================= */}

                    <section className="mt-10">

                        <div className="flex gap-3">
                            <h2
                            className="
                                text-xl
                                font-semibold
                                text-text-primary
                                md:text-2xl
                            "
                        >
                            Playlists
                        </h2>

                        <ChannelPageButton icon={PlusIcon} text="Add playlist" />
                        </div>

                        <div
                            className="
                                mt-5
                                grid
                                grid-cols-3
                                gap-5
                                xl:grid-cols-4
                            "
                        >

                            {playlists.map((playlist) => (

                                <article
                                    key={playlist.id}
                                    className="
                                        group
                                        min-w-0
                                        cursor-pointer
                                        transition-transform
                                        duration-200
                                        active:scale-[0.99]
                                    "
                                >

                                    <div
                                        className="
                                            relative
                                            aspect-video
                                            overflow-hidden
                                            rounded-xl
                                            bg-surface
                                        "
                                    >

                                        <img
                                            src={playlist.playlistCover}
                                            alt={playlist.name}
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                                transition-transform
                                                duration-300
                                                group-hover:scale-105
                                            "
                                        />



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
                                                py-2
                                                text-sm
                                                font-medium
                                                text-white
                                            "
                                        >
                                            <PlayCircleIcon
                                                size={16}
                                                weight="fill"
                                            />

                                            {playlist.videoCount} videos
                                        </div>

                                    </div>



                                    <h3
                                        className="
                                            mt-3
                                            line-clamp-2
                                            text-lg
                                            font-semibold
                                            text-text-primary
                                            transition-colors
                                            group-hover:text-primary-hover
                                            group-active:text-primary-hover
                                        "
                                    >
                                        {playlist.name}
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            line-clamp-2
                                            text-sm
                                            leading-5
                                            text-text-secondary
                                        "
                                    >
                                        {playlist.description}
                                    </p>

                                </article>

                            ))}

                        </div>

                    </section>

                </div>

            </div>
        </main>
    );
}

export default Channel;