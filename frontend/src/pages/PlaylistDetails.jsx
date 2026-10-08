import {
    PencilSimpleIcon,
    ShareNetworkIcon,
    TrashIcon,
    XIcon,
    ImageIcon,
    CheckCircleIcon,
    WarningCircleIcon,
    ListIcon,
    PlayCircleIcon,
} from "@phosphor-icons/react";

import { VideoCard } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import api from "../api/axios.js";
import { useShare } from "../hooks/useShare.jsx";

function PlaylistDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);

    const [playlist, setPlaylist] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState("");

    const coverInputRef = useRef(null);

    const isOwner =
        !!currentUser?._id &&
        !!playlist?.owner?._id &&
        String(currentUser._id) === String(playlist.owner._id);

    const classes = `flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-text-primary transition-all duration-200 hover:bg-border active:bg-border active:scale-95`;

    function showError(error) {
        notifications.show({
            title: error || "Something went wrong",
            color: "red",
            icon: <WarningCircleIcon />
        });
    }

    function showSuccess(message) {
        notifications.show({
            title: message,
            icon: <CheckCircleIcon />,
            color: "vtube",
        });
    }

    async function fetchPlaylist() {
        try {
            const res = await api.get(`/playlists/${id}`);
            setPlaylist(res.data?.data ?? null);
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPlaylist();
    }, [id]);

    //! cover ka preview URL, cleanup me memory se hatao
    useEffect(() => {
        if (!coverFile) {
            setCoverPreview("");
            return;
        }

        const url = URL.createObjectURL(coverFile);
        setCoverPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [coverFile]);

    function openEditModal() {
        setEditName(playlist?.name || "");
        setEditDescription(playlist?.description || "");
        setCoverFile(null);
        setShowEditModal(true);
    }

    function closeEditModal() {
        setShowEditModal(false);
        setCoverFile(null);
    }

    function handleCoverSelect(e) {
        const file = e.target.files?.[0];
        e.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showError("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError("Cover size must be under 5MB");
            return;
        }

        setCoverFile(file);
    }

    async function handleSaveChanges() {
        if (!editName.trim() || !editDescription.trim()) {
            showError("Name and description both are required");
            return;
        }

        const body = new FormData();
        body.append("name", editName.trim());
        body.append("description", editDescription.trim());
        if (coverFile) body.append("playlistCover", coverFile);

        try {
            setEditLoading(true);

            const res = await api.patch(`/playlists/${id}`, body);

            showSuccess(res.data?.message || "Playlist updated successfully");
            closeEditModal();
            await fetchPlaylist();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setEditLoading(false);
        }
    }

    async function handleDeletePlaylist() {
        if (!window.confirm("Delete this playlist?")) return;

        try {
            setIsLoading(true);

            const res = await api.delete(`/playlists/remove-playlist/${id}`);

            showSuccess(res.data?.message || "Playlist deleted successfully");
            navigate("/playlists");
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
            setIsLoading(false);
        }
    }

    async function handleRemoveVideo(videoId) {
        
        try {
            setIsLoading(true);

            const res = await api.delete(`/playlists/remove-video/${id}/${videoId}`);

            showSuccess(res.data?.message || "Video removed successfully");
            
            const remaining = res.data?.data?.videos?.length ?? 0;
            
            if (remaining === 0) {
                await api.delete(`/playlists/remove-playlist/${id}`);
                navigate("/playlists");
                return;
            }

            await fetchPlaylist();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const { share } = useShare();

    const videos = playlist?.videos ?? [];

    console.log(playlist);

    return (

        <main className="min-h-[calc(100vh-64px)] bg-background text-text-primary">

            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                loaderProps={{ color: "blue", type: "oval" }}
            />

            {playlist && (
                <div className="mx-auto w-full max-w-375 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_minmax(0,1fr)] xl:grid-cols-[460px_minmax(0,1fr)]">

                        {/* ================= PLAYLIST INFO CARD ================= */}

                        <section className="h-fit overflow-visible rounded-2xl border border-border bg-surface">

                            {/* Cover */}

                            <div className="relative w-full overflow-hidden rounded-t-2xl bg-surface-elevated">
                                <div className="aspect-video w-full">
                                    {playlist.playlistCover ? (
                                        <img
                                            src={playlist.playlistCover}
                                            alt={playlist.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <ListIcon size={48} className="text-text-muted" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details */}

                            <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">

                                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                    {playlist.name}
                                </h1>

                                <p className="mt-3 text-sm leading-6 text-text-secondary">
                                    {playlist.description}
                                </p>

                                <Link to={`/channel/${playlist.owner.username}`} className="mt-4 flex items-center gap-3">
                                    <img
                                        src={playlist.owner?.avatar}
                                        alt={playlist.owner?.fullName}
                                        referrerPolicy="no-referrer"
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                    <div className="text-sm font-medium text-text-primary">
                                        by {playlist.owner?.fullName}
                                    </div>
                                </Link>

                                <p className="mt-4 text-sm text-text-secondary">
                                    Playlist
                                    <span className="mx-1.5">•</span>
                                    {playlist.videoCount ?? 0} {playlist.videoCount === 1 ? "video" : "videos"}
                                </p>

                                {/* Actions */}

                                <div className="mt-6 flex items-center gap-2">

                                    {isOwner && (
                                        <button
                                            type="button"
                                            title="Edit playlist"
                                            aria-label="Edit playlist"
                                            onClick={openEditModal}
                                            className={classes}
                                        >
                                            <PencilSimpleIcon size={21} weight="regular" />
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        aria-label="Share playlist"
                                        title="Share playlist"
                                        onClick={() => share({
                                            path: `/playlists/${playlist._id}`,
                                            title: `${playlist.name}`
                                        })}
                                        className={classes}
                                    >
                                        <ShareNetworkIcon size={21} weight="regular" />
                                    </button>

                                    {isOwner && (
                                        <button
                                            type="button"
                                            aria-label="Delete playlist"
                                            title="Delete playlist"
                                            onClick={handleDeletePlaylist}
                                            className={`
                                                flex 
                                                h-11 
                                                w-11 
                                                shrink-0 
                                                items-center 
                                                justify-center 
                                                rounded-full 
                                                bg-red-500/10
                                                text-text-primary 
                                                transition-all 
                                                duration-200
                                                hover:bg-red-500/20 
                                                active:bg-red-500/20  
                                                active:scale-95
                                            `}
                                        >
                                            <TrashIcon size={21} color="red" weight="regular" />
                                        </button>
                                    )}

                                </div>

                            </div>

                        </section>


                        {/* ================= VIDEOS ================= */}

                        <section className="min-w-0">

                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Playlist videos
                                </h2>
                            </div>

                            {videos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface">
                                        <PlayCircleIcon size={48} weight="regular" className="text-text-muted" />
                                    </div>

                                    <h2 className="mt-5 text-lg font-semibold text-text-primary">
                                        No videos in this playlist
                                    </h2>

                                    <p className="mt-1 max-w-sm text-sm text-text-secondary">
                                        Videos you save here will appear in this list.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-8 lg:gap-5">
                                    {videos.map((video) => (
                                        <Link key={video._id} to={`/watch/${video._id}`}>
                                            <VideoCard
                                                channelName={video.owner?.fullName}
                                                avatar={video.owner?.avatar}
                                                editButton={false}
                                                saveButton={false}
                                                deleteButton={isOwner}
                                                deleteText="Remove"
                                                onDeleteClick={() => handleRemoveVideo(video._id)}
                                                onShareClick={() => share({
                                                    path: `/watch/${video._id}`,
                                                    title: `${video.title}`
                                                })}
                                                variant="horizontal"
                                                {...video}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            )}

                        </section>

                    </div>

                </div>
            )}

            {/* ================= EDIT MODAL ================= */}

            {showEditModal && isOwner && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">

                    <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-6">

                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Edit playlist</h2>
                                <p className="mt-1 text-sm text-text-secondary">
                                    Update your playlist details
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-all hover:bg-surface-elevated hover:text-text-primary active:scale-95"
                            >
                                <XIcon size={21} weight="regular" />
                            </button>
                        </div>

                        {/* Cover */}

                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium">
                                Playlist cover
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                ref={coverInputRef}
                                onChange={handleCoverSelect}
                                className="hidden"
                            />

                            <div className="relative overflow-hidden rounded-xl border border-border bg-background">
                                <div className="aspect-video w-full">
                                    {(coverPreview || playlist.playlistCover) ? (
                                        <img
                                            src={coverPreview || playlist.playlistCover}
                                            alt="Playlist cover"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <ListIcon size={40} className="text-text-muted" />
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => coverInputRef.current?.click()}
                                    className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-black/70 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-black/85"
                                >
                                    <ImageIcon size={18} weight="regular" />
                                    Change cover
                                </button>
                            </div>
                        </div>

                        {/* Name */}

                        <div className="mb-5">
                            <label htmlFor="playlist-name" className="mb-2 block text-sm font-medium">
                                Name
                            </label>

                            <input
                                id="playlist-name"
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary outline-none placeholder:text-text-muted transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Description */}

                        <div className="mb-6">
                            <label htmlFor="playlist-description" className="mb-2 block text-sm font-medium">
                                Description
                            </label>

                            <textarea
                                id="playlist-description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={4}
                                placeholder="Enter playlist description"
                                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-text-primary outline-none placeholder:text-text-muted transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Actions */}

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="h-11 rounded-xl border border-border px-5 text-sm font-medium text-text-primary transition-all hover:bg-surface-elevated active:bg-surface-elevated active:scale-[0.98]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={editLoading}
                                onClick={handleSaveChanges}
                                className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:bg-primary-hover active:scale-[0.98] disabled:opacity-60"
                            >
                                {editLoading ? "Saving..." : "Save changes"}
                            </button>
                        </div>

                    </div>

                </div>
            )}

        </main>
    );
}

export default PlaylistDetails;