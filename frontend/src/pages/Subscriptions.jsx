import { CheckIcon } from "@phosphor-icons/react";
import {
    CategoryBar,
    Sidebar,
    VideoCard,
} from "../components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LoadingOverlay } from "@mantine/core";
import api from "../api/axios.js";
import { useSaveToPlaylist } from "../context/SaveToPlaylistContext.jsx";
import { useShare } from "../hooks/useShare.jsx";

function Subscriptions() {
    const currentUser = useSelector((state) => state.auth.user);
    const [channels, setChannels] = useState([]);
    const [feedVideos, setFeedVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState("latest");

    const { openSave } = useSaveToPlaylist();
    const { share } = useShare();

    async function fetchSubscribedChannels() {
        if (!currentUser?._id) return;
        try {
            const res = await api.get(`/subscriptions/subscribed-channels/${currentUser._id}`);
            const data = res.data?.data || [];
            setChannels(data.map((item) => item.channel).filter(Boolean));
        } catch (error) {
            console.log("Failed to fetch subscribed channels:", error);
        }
    }

    async function fetchFeedVideos(sort = sortBy) {
        if (!currentUser?._id) return;
        try {
            const res = await api.get("/videos/feed/subscription", {
                params: { sortBy: sort },
            });
            const data = res.data?.data || [];
            setFeedVideos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log("Failed to fetch subscription feed videos:", error);
        }
    }

    useEffect(() => {
        if (!currentUser?._id) return;
        let isMounted = true;

        async function loadData() {
            try {
                setIsLoading(true);
                await Promise.all([
                    fetchSubscribedChannels(),
                    fetchFeedVideos(sortBy),
                ]);
            } catch (error) {
                console.log("Failed to load subscriptions data:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, [currentUser?._id, sortBy]);

    async function handleToggleSubscribe(e, channelId) {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.post(`/subscriptions/toggle/${channelId}`);
            setChannels((prev) => prev.filter((ch) => ch._id !== channelId));
            setFeedVideos((prev) => prev.filter((v) => {
                const ownerId = v.owner?._id || v.owner;
                return ownerId?.toString() !== channelId?.toString();
            }));
        } catch (error) {
            console.log("Failed to toggle subscription:", error);
        }
    }

    return (
        <main className="flex min-w-0">

            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                pos="fixed"
                inset={0}
                overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                loaderProps={{ color: "blue", type: "oval" }}
            />

            {/* ================= SIDEBAR ================= */}
            <Sidebar />

            {/* ================= MAIN CONTENT ================= */}

            <div className="min-w-0 flex-1 p-4">

                {/* ================= CATEGORY BAR ================= */}

                <div
                    className="
                        sticky
                        top-12
                        z-40
                        bg-background/75
                        backdrop-blur-xl
                        -ml-5
                        md:top-16
                    "
                >
                    <CategoryBar selected={sortBy} onSelect={setSortBy} />
                </div>


                {/* ================= PAGE CONTENT ================= */}

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-350
                        py-6
                    "
                >

                    {/* ================= PAGE TITLE ================= */}

                    <h1
                        className="
                            text-2xl
                            font-semibold
                            text-text-primary
                            md:text-3xl
                        "
                    >
                        Subscriptions
                    </h1>


                    {/* ================= CHANNELS ================= */}

                    <section className="mt-6">

                        <div
                            className="
                                flex
                                gap-4
                                overflow-x-auto
                                pb-2
                                scrollbar-none
                            "
                        >

                            {channels.length === 0 && !isLoading ? (
                                <p className="py-6 text-sm text-text-secondary">
                                    You haven't subscribed to any channels yet.
                                </p>
                            ) : (
                                channels.map((channel) => (
                                    <Link
                                        key={channel._id}
                                        to={`/channel/${channel.username}`}
                                        className="
                                            flex
                                            min-w-64
                                            shrink-0
                                            items-center
                                            gap-3
                                            rounded-2xl
                                            bg-surface
                                            hover:bg-surface-elevated
                                            cursor-pointer
                                            transition-transform
                                            duration-150
                                            active:scale-95
                                            p-3
                                        "
                                    >
                                        {/* Avatar */}
                                        <img
                                            src={channel.avatar}
                                            alt={channel.fullName || channel.username}
                                            className="
                                                h-12
                                                w-12
                                                shrink-0
                                                rounded-full
                                                object-cover
                                            "
                                        />

                                        {/* Channel information */}
                                        <div className="min-w-0 flex-1">
                                            <h2 className="truncate text-sm font-semibold text-text-primary">
                                                {channel.fullName || channel.username}
                                            </h2>

                                            <p className="mt-0.5 truncate text-xs text-text-muted">
                                                {channel.subscribersCount ?? 0} subscribers
                                            </p>
                                        </div>

                                        {/* Subscribed button */}
                                        <button
                                            type="button"
                                            onClick={(e) => handleToggleSubscribe(e, channel._id)}
                                            className="
                                                flex
                                                h-9
                                                shrink-0
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                bg-surface-elevated
                                                px-3
                                                text-xs
                                                font-medium
                                                text-text-primary
                                                transition-all
                                                duration-150
                                                hover:bg-red-500/20
                                                hover:text-red-400
                                                active:scale-95
                                            "
                                        >
                                            <CheckIcon
                                                size={16}
                                                weight="bold"
                                            />
                                            <span>Subscribed</span>
                                        </button>
                                    </Link>
                                ))
                            )}

                        </div>

                    </section>


                    {/* ================= DIVIDER ================= */}

                    <div
                        className="
                            my-7
                            border-t
                            border-border
                        "
                    />


                    {/* ================= LATEST VIDEOS ================= */}

                    <section>

                        <div
                            className="
                                mb-5
                                flex
                                items-center
                                justify-between
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
                                Latest videos
                            </h2>

                        </div>


                        {/* ================= VIDEO GRID ================= */}

                        {feedVideos.length === 0 && !isLoading ? (
                            <div className="py-16 text-center">
                                <p className="text-base text-text-secondary">
                                    No videos from your subscribed channels yet.
                                </p>
                            </div>
                        ) : (
                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-x-4
                                    gap-y-8
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                "
                            >
                                {feedVideos.map((video) => (
                                    <Link key={video._id} to={`/watch/${video._id}`}>
                                        <VideoCard
                                            channelName={video.owner?.fullName || video.owner?.username}
                                            avatar={video.owner?.avatar}
                                            editButton={false}
                                            deleteButton={false}
                                            onSaveClick={() => openSave(video._id)}
                                            onShareClick={() => share({
                                                path: `/watch/${video._id}`,
                                                title: `${video.title}`
                                            })}
                                            {...video}
                                        />
                                    </Link>
                                ))}
                            </div>
                        )}

                    </section>

                </div>

            </div>

        </main>
    );
}

export default Subscriptions;