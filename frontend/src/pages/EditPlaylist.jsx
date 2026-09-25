import {
    BookmarkSimpleIcon,
    PencilSimpleIcon,
    ShareNetworkIcon,
    TrashIcon,
    XIcon,
    ImageIcon
} from "@phosphor-icons/react";

import { VideoCard } from "../components"
import { Link } from "react-router-dom";
import { useState } from "react";

function EditPlaylist() {

    const isOwner = true;

    const playlist = {
        name: "Backend One Shot",
        creator: "Meet Pujara",
        videoCount: 2,
        description:
            "A complete backend development playlist covering Node.js, Express, MongoDB and other essential backend concepts.",
        cover:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85",

        avatar:
            "https://i.pravatar.cc/100?img=12",
    };

    const videos = [
        {
            thumbnail: "https://picsum.photos/seed/react/640/360",
            title: "Complete React JS Tutorial for Beginners",
            avatar: "https://i.pravatar.cc/150?img=12",
            channelName: "Code With Meet",
            views: "1.2M views",
            uploadedAt: "2 weeks ago",
            duration: "18:42",
        },
        {
            thumbnail: "https://picsum.photos/seed/nodejs/640/360",
            title: "Node.js REST API with Express & MongoDB",
            avatar: "https://i.pravatar.cc/150?img=32",
            channelName: "Backend Mastery",
            views: "845K views",
            uploadedAt: "1 month ago",
            duration: "24:15",
        },
        {
            thumbnail: "https://picsum.photos/seed/mongodb/640/360",
            title: "MongoDB Aggregation Pipeline Explained",
            avatar: "https://i.pravatar.cc/150?img=45",
            channelName: "Dev Simplified",
            views: "523K views",
            uploadedAt: "3 weeks ago",
            duration: "12:36",
        },
        {
            thumbnail: "https://picsum.photos/seed/javascript/640/360",
            title: "JavaScript Async Await Deep Dive",
            avatar: "https://i.pravatar.cc/150?img=15",
            channelName: "JavaScript Daily",
            views: "2.1M views",
            uploadedAt: "2 months ago",
            duration: "16:28",
        },
        {
            thumbnail: "https://picsum.photos/seed/mern/640/360",
            title: "Build a Full Stack MERN Application",
            avatar: "https://i.pravatar.cc/150?img=51",
            channelName: "Web Dev Hub",
            views: "734K views",
            uploadedAt: "5 days ago",
            duration: "32:51",
        },
        {
            thumbnail: "https://picsum.photos/seed/git/640/360",
            title: "Git & GitHub Complete Tutorial",
            avatar: "https://i.pravatar.cc/150?img=68",
            channelName: "Code Academy",
            views: "967K views",
            uploadedAt: "3 months ago",
            duration: "21:09",
        },
    ];

    function handleEditPlaylist() {
        console.log("Edit playlist");
    }

    function handleDeletePlaylist() {
        console.log("Delete playlist");
    }

    function handleShare() {
        console.log("Share playlist");
    }

    const classes = `flex
        h-11
        w-11
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-surface-elevated
        text-text-primary
        transition-all
        duration-200
        hover:bg-border
        active:bg-border
        active:scale-95`

    const [showEditModal, setShowEditModal] = useState(false);

    const [editPlaylist, setEditPlaylist] = useState({
        name: playlist.name,
        description: playlist.description,
        cover: playlist.cover
    })

    return (

        <main className="
            min-h-[calc(100vh-64px)]
            bg-background
            text-text-primary
        ">

            <div className="
                mx-auto
                w-full
                max-w-375
                px-4
                py-6
                sm:px-6
                lg:px-8
                xl:px-10
            ">

                {/* =====================================================
                    MAIN LAYOUT
                ====================================================== */}

                <div className="
                    grid
                    grid-cols-1
                    gap-6
                    lg:grid-cols-[420px_minmax(0,1fr)]
                    xl:grid-cols-[460px_minmax(0,1fr)]
                ">


                    {/* =================================================
                        PLAYLIST INFO CARD
                    ================================================== */}

                    <section className="
                        h-fit
                        overflow-visible
                        rounded-2xl
                        border
                        border-border
                        bg-surface
                    ">


                        {/* ================= COVER ================= */}

                        <div className="
                            relative
                            w-full
                            overflow-hidden
                            rounded-t-2xl
                            bg-surface-elevated
                        ">

                            <div className="
                                aspect-video
                                w-full
                            ">

                                <img
                                    src={playlist.cover}
                                    alt={playlist.name}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                    "
                                />

                            </div>
                        </div>


                        {/* ================= PLAYLIST DETAILS ================= */}

                        <div className="
                            px-5
                            pb-5
                            pt-5
                            sm:px-6
                            sm:pb-6
                        ">


                            {/* Name */}

                            <h1 className="
                                text-2xl
                                font-semibold
                                tracking-tight
                                sm:text-3xl
                            ">
                                {playlist.name}
                            </h1>

                            {/* Description */}

                            <p className="
                                mt-3
                                text-sm
                                leading-6
                                text-text-secondary
                            ">
                                {playlist.description}
                            </p>


                            {/* Creator */}

                            <Link
                                to="/"
                                className="
                                    mt-4
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <img
                                    src={playlist.avatar}
                                    alt={playlist.creator}
                                    className="
                                        h-9
                                        w-9
                                        rounded-full
                                        object-cover
                                    "
                                />
                                <div
                                    className="
                                            text-sm
                                            font-medium
                                            text-text-primary
                                        "
                                >
                                    by {playlist.creator}
                                </div>
                            </Link>


                            {/* Metadata */}

                            <p className="
                                mt-4
                                text-sm
                                text-text-secondary
                            ">

                                Playlist


                                <span className="mx-1.5">
                                    •
                                </span>

                                {playlist.videoCount} videos

                            </p>


                            {/* ================= ACTIONS ================= */}

                            <div className="
                                mt-6
                                flex
                                items-center
                                gap-2
                            ">

                                {/* Save */}

                                {!isOwner && (
                                    <button
                                        type="button"
                                        title="Save playlist"
                                        aria-label="Save playlist"
                                        className={classes}
                                    >
                                        <BookmarkSimpleIcon
                                            size={21}
                                            weight="fill"
                                        />
                                    </button>
                                )}


                                {/* Edit */}

                                {isOwner && (
                                    <button
                                        type="button"
                                        title="Edit playlist"
                                        aria-label="Edit playlist"
                                        onClick={() => setShowEditModal(true)}
                                        className={classes}
                                    >
                                        <PencilSimpleIcon
                                            size={21}
                                            weight="regular"
                                        />
                                    </button>
                                )
                                }

                                {/* Share */}

                                <button
                                    type="button"
                                    aria-label="Share playlist"
                                    title="Share playlist"
                                    onClick={handleShare}
                                    className={classes}
                                >
                                    <ShareNetworkIcon
                                        size={21}
                                        weight="regular"
                                    />
                                </button>

                                {/* Delete */}

                                <button
                                    type="button"
                                    aria-label="Delete playlist"
                                    title="Delete playlist"
                                    onClick={handleDeletePlaylist}
                                    className={classes}
                                >
                                    <TrashIcon
                                        size={21}
                                        color="red"
                                        weight="regular"
                                    />
                                </button>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        VIDEOS
                    ================================================== */}

                    <section className="min-w-0">

                        <div className="
                            mb-4
                            flex
                            items-center
                            justify-between
                        ">
                            <h2 className="
                                text-lg
                                font-semibold
                            ">
                                Playlist videos
                            </h2>
                        </div>


                        <div
                            className="
                                flex
                                flex-col
                                gap-8
                                lg:gap-5
                            "
                        >
                            {videos.map((video, index) => (

                                <VideoCard
                                    key={index}
                                    editButton={false}
                                    saveButton={false}
                                    deleteText="Remove"
                                    {...video}
                                    variant="horizontal"
                                />

                            ))}
                        </div>

                    </section>

                </div>

            </div>

            {showEditModal && (
                <div className="
                    fixed
                    inset-0
                    z-100
                    flex
                    items-center
                    justify-center
                    bg-black/60
                    px-4
                    backdrop-blur-sm
                ">

                    <div className="
                        relative
                        w-full
                        max-w-lg
                        max-h-[90vh]
                        overflow-y-auto
                        rounded-2xl
                        border
                        border-border
                        bg-surface
                        p-5
                        shadow-xl
                        sm:p-6
                    ">

                        {/* ================= HEADER ================= */}

                        <div className="
                            mb-6
                            flex
                            items-center
                            justify-between
                        ">

                            <div>
                                <h2 className="
                                    text-xl
                                    font-semibold
                                ">
                                    Edit playlist
                                </h2>

                                <p className="
                                    mt-1
                                    text-sm
                                    text-text-secondary
                                ">
                                    Update your playlist details
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-text-secondary
                                    transition-all
                                    hover:bg-surface-elevated
                                    hover:text-text-primary
                                    active:scale-95
                                "
                            >
                                <XIcon
                                    size={21}
                                    weight="regular"
                                />
                            </button>

                        </div>


                        {/* ================= COVER ================= */}

                        <div className="mb-6">

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                            ">
                                Playlist cover
                            </label>

                            <div className="
                                relative
                                overflow-hidden
                                rounded-xl
                                border
                                border-border
                                bg-background
                            ">

                                <div className="aspect-video w-full">

                                    <img
                                        src={editPlaylist.cover}
                                        alt="Playlist cover"
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />

                                </div>

                                <button
                                    type="button"
                                    className="
                                        absolute
                                        bottom-3
                                        right-3
                                        flex
                                        items-center
                                        gap-2
                                        rounded-lg
                                        bg-black/70
                                        px-3
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white
                                        backdrop-blur-sm
                                        transition-all
                                        hover:bg-black/85
                                    "
                                >
                                    <ImageIcon
                                        size={18}
                                        weight="regular"
                                    />

                                    Change cover
                                </button>

                            </div>

                        </div>


                        {/* ================= NAME ================= */}

                        <div className="mb-5">

                            <label
                                htmlFor="playlist-name"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                "
                            >
                                Name
                            </label>

                            <input
                                id="playlist-name"
                                type="text"
                                value={editPlaylist.name}
                                onChange={(e) =>
                                    setEditPlaylist((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="
                                    h-12
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
                                    transition-all
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/20
                                "
                            />

                        </div>


                        {/* ================= DESCRIPTION ================= */}

                        <div className="mb-6">

                            <label
                                htmlFor="playlist-description"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                "
                            >
                                Description
                            </label>

                            <textarea
                                id="playlist-description"
                                value={editPlaylist.description}
                                onChange={(e) =>
                                    setEditPlaylist((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                rows={4}
                                placeholder="Enter playlist description"
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
                                    transition-all
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/20
                                "
                            />

                        </div>


                        {/* ================= ACTIONS ================= */}

                        <div className="
                            flex
                            flex-col-reverse
                            gap-3
                            sm:flex-row
                            sm:justify-end
                        ">

                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="
                                    h-11
                                    rounded-xl
                                    border
                                    border-border
                                    px-5
                                    text-sm
                                    font-medium
                                    text-text-primary
                                    transition-all
                                    hover:bg-surface-elevated
                                    active:bg-surface-elevated
                                    active:scale-[0.98]
                                "
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    console.log(
                                        "Updated playlist:",
                                        editPlaylist
                                    );

                                    setShowEditModal(false);
                                }}
                                className="
                                    h-11
                                    rounded-xl
                                    bg-primary
                                    px-5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition-all
                                    hover:bg-primary-hover
                                    active:bg-primary-hover
                                    active:scale-[0.98]
                                "
                            >
                                Save changes
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </main>
    );
}

export default EditPlaylist;