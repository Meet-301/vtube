import { useEffect, useState } from "react";
import {
    PencilSimpleIcon,
    PlayCircleIcon,
    QueueIcon,
    WarningCircleIcon,
    CheckCircleIcon,
    TrashIcon
} from "@phosphor-icons/react";
import { ChannelPageButton, MoreButton, VideoCard, VideoCardButton } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import { LoadingOverlay } from "@mantine/core";
import { useShare } from "../hooks/useShare.jsx";
import { useSaveToPlaylist } from "../context/SaveToPlaylistContext.jsx";
import { useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";

function Channel() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [videos, setVideos] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [channel, setChannel] = useState({});

    const { share } = useShare();
    const { openSave } = useSaveToPlaylist();

    const { username } =  useParams();
    
    const currentUser = useSelector(state => state.auth.user);

    async function fetchChannelDetails() {
        try {
            setIsLoading(true);

            const res = await api.get(`/users/channel/${username}`);

            setChannel(res.data?.data ?? {});
            setVideos(res.data?.data?.videos ?? []);
            setPlaylists(res.data?.data?.playlists ?? []);

        } catch (error) {
            console.log(`Something went wrong ${error}`);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { fetchChannelDetails() }, [username]);

    const isOwner = channel._id === currentUser._id;

    //! Mobile / tablet tabs
    const [activeTab, setActiveTab] = useState("videos");

    function showError(error) {
        notifications.show({
            title: error || "Something went wrong",
            color: "red",
            icon: <WarningCircleIcon/>
        });
    }

    function showSuccess(message) {
        notifications.show({
            title: message,
            icon: <CheckCircleIcon/>,
            color: "vtube",
        });
    }

    async function handleDelete(id) {
        try {
            setIsLoading(true);
            const res = await api.delete(`/videos/videoid/${id}`);
            await fetchChannelDetails();
            showSuccess(res.data?.message ?? "Video deleted successfully");
        } catch (error) {
            showError(error?.response?.data?.message ?? "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteVideos() {
        try {
            setIsLoading(true);
            const res = await api.delete(`/videos/username/${username}`);
            await fetchChannelDetails();
            showSuccess(res.data?.message ?? "Videos deleted successfully");
        } catch (error) {
            showError(error?.response?.data?.message ?? "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    function confirmDeleteAll() {
        if (!window.confirm(`Delete all ${videos.length} videos? This cannot be undone.`)) return;

        handleDeleteVideos();
    }

    return (
        <main className="px-4 py-6">

            <LoadingOverlay 
                visible={isLoading}
                zIndex={1000}
                pos="fixed"
                inset={0}
                overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                loaderProps={{ color: "blue", type: "oval" }}
            />

            <div className="mx-auto w-full max-w-350">

                {/* ================= COVER ================= */}

                {
                    channel.coverImage &&
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
                }

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
                                    <ChannelPageButton
                                        icon={PencilSimpleIcon}
                                        text="Edit channel"
                                        linkTo={`/edit-channel/${channel._id}`}
                                    />
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
                                {channel.channelDescription ?? "No description available for this channel"}
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

                <div>
                    {/* Tabs */}

                    <div
                        className="
                            flex
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

                    {/* Videos */}

                    {activeTab === "videos" && (
                        <section className="mt-8"> 

                            {isOwner && videos.length > 0 && (
                                <div className="mb-5 flex">
                                    <button
                                        type="button"
                                        onClick={confirmDeleteAll}
                                        className="
                                            flex 
                                            items-center 
                                            gap-2 
                                            rounded-full 
                                            bg-red-500/10 
                                            px-4 
                                            py-2.5 
                                            text-sm 
                                            font-medium 
                                            text-red-500 
                                            transition-all 
                                            duration-200 
                                            hover:bg-red-500/20 
                                            active:bg-red-500/20 
                                            active:scale-95
                                        "
                                    >
                                        <TrashIcon size={18} weight="regular" />
                                        Delete all videos
                                    </button>
                                </div>
                            )}

                            {videos.length === 0
                            ? 
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface">
                                        <PlayCircleIcon
                                            size={48}
                                            weight="regular"
                                            className="text-text-muted"
                                        />
                                    </div>

                                    <h2 className="mt-5 text-lg font-semibold text-text-primary">
                                        No videos available
                                    </h2>
                                </div>
                            :
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
                                    {
                                        videos.map((video) => (
                                            <Link to={`/watch/${video._id}`}>
                                                <VideoCard
                                                    key={video._id}
                                                    uploadedAt={video.createdAt}
                                                    editButton={isOwner}
                                                    deleteButton={isOwner}
                                                    onEditClick={() => navigate(`/edit-video/${video._id}`)}
                                                    onSaveClick={() => openSave(video._id)}
                                                    onDeleteClick={() => handleDelete(video._id)}
                                                    onShareClick={() => share({
                                                        path: `/watch/${video._id}`,
                                                        title: `${video.title}`
                                                    })}
                                                    {...video}
                                                />
                                            </Link>
                                        ))
                                    }
                                </div>
                            }
                            
                        </section>
                    )}

                    {/* Playlists */}

                    {activeTab === "playlists" && (
                        <section className="mt-8">

                            {playlists.length === 0 
                            ? 
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface">
                                        <QueueIcon
                                            size={48}
                                            weight="regular"
                                            className="text-text-muted"
                                        />
                                    </div>

                                    <h2 className="mt-5 text-lg font-semibold text-text-primary">
                                        No playlists available
                                    </h2>
                                </div>
                            : 
                                <div
                                    className="
                                        mt-5
                                        grid
                                        grid-cols-1
                                        gap-x-5
                                        gap-y-8
                                        sm:grid-cols-2
                                        lg:grid-cols-3
                                        xl:grid-cols-4
                                    "
                                >
                                    {playlists.map((playlist) => (
                                        <Link to={`/playlists/${playlist._id}`}>
                                            <article
                                                key={playlist.id}
                                                className="
                                                    group
                                                    min-w-0
                                                    cursor-pointer
                                                    transition-transform
                                                    duration-150
                                                    active:scale-[0.99]
                                                "
                                            >
                                                {/* Thumbnail */}

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
                                                        src={playlist.playlistCover}
                                                        alt={playlist.name}
                                                        className="
                                                            h-full
                                                            w-full
                                                            object-cover
                                                            group-hover:scale-[1.02]
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

                                                {/* Information */}

                                                <div className="relative mt-3 pr-10">
                                                    <h3
                                                        className="
                                                            line-clamp-2
                                                            text-lg
                                                            font-semibold
                                                            text-text-primary
                                                            transition-colors
                                                            duration-150
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

                                                    <div
                                                        className="
                                                            absolute
                                                            right-0
                                                            top-0
                                                        "
                                                    >
                                                        <MoreButton 
                                                            editButton={false} 
                                                            deleteButton={false}
                                                            saveButton={false}
                                                            onShareClick={() => share({
                                                                path: `/playlists/${playlist._id}`,
                                                                title: `${playlist.name}`
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    ))}
                                </div>
                            }

                        </section>
                    )}
                </div>

            </div>
        </main>
    );
}

export default Channel;