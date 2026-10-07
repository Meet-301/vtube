import { useEffect, useState, useRef } from "react";
import {
    XIcon,
    PlusIcon,
    CheckIcon,
    CheckCircleIcon,
    WarningCircleIcon,
    ListIcon,
    ImageIcon,
    QueueIcon
} from "@phosphor-icons/react";
import { Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import api from "../api/axios.js";

function SaveToPlaylistModal({ isOpen, onClose, videoId }) {

    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busyId, setBusyId] = useState(null);

    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [createLoading, setCreateLoading] = useState(false);

    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState("");
    const coverInputRef = useRef(null);

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

    async function fetchPlaylists(showLoader = false) {
        try {
            if (showLoader) setIsLoading(true);

            const res = await api.get("/playlists/get/user");
            setPlaylists(res.data?.data ?? []);
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    //! fetch playlist after a modeal opens
    useEffect(() => {
        if (isOpen) {
            fetchPlaylists(true);
        } else {
            setIsCreating(false);
            setName("");
            setDescription("");
            setCoverFile(null);
        }
    }, [isOpen]);

    //! Close the modal by clicking on escape
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") onClose();
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    //! Preview URL of cover, remove it in cleanup function
    useEffect(() => {
        if (!coverFile) {
            setCoverPreview("");
            return;
        }

        const url = URL.createObjectURL(coverFile);
        setCoverPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [coverFile]);

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

    //! If it's already saved then remove otherwise save
    async function togglePlaylist(playlist) {
        const isSaved = playlist.videos?.includes(videoId);

        try {
            setBusyId(playlist._id);

            if (isSaved) {
                await api.delete(`/playlists/remove-video/${playlist._id}/${videoId}`);
                showSuccess(`Removed from ${playlist.name}`);
            } else {
                await api.post(`/playlists/${playlist._id}/add-video/${videoId}`);
                showSuccess(`Saved to ${playlist.name}`);
            }

            await fetchPlaylists();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setBusyId(null);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();

        if (!name.trim() || !description.trim()) {
            showError("Name and description both are required");
            return;
        }

        if(!coverFile) {
            showError("Playlist cover image is required");
            return;
        }

        try {
            setCreateLoading(true);

            const body = new FormData();
            body.append("name", name.trim());
            body.append("description", description.trim());
            body.append("playlistCover", coverFile);

            const res = await api.post("/playlists/create", body);
            const created = res.data?.data;

            console.log(created);

            //! add the video after creating a new playlist
            await api.post(`/playlists/${created._id}/add-video/${videoId}`);

            setName("");
            setDescription("");
            setIsCreating(false);
            setCoverPreview(null);
            
            showSuccess(`Saved to ${created.name}`);

            await fetchPlaylists();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setCreateLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-2000 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
        >

            <div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Save to playlist"
                className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-2xl"
            >

                {/* ===== HEADER ===== */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">
                        Save to playlist
                    </h2>

                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="rounded-full p-2 text-text-secondary transition-all hover:bg-surface-elevated active:scale-95"
                    >
                        <XIcon size={20} />
                    </button>
                </div>

                {/* ===== PLAYLIST LIST ===== */}
                <div className="mt-4 max-h-64 space-y-1 overflow-y-auto">

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader color="blue" size={24} />
                        </div>
                    ) : playlists.length === 0 ? (
                        <div className="flex flex-col items-center py-6 text-center">
                            <QueueIcon size={32} className="text-text-muted" />
                            <p className="mt-2 text-sm text-text-secondary">
                                No playlists yet. Create your first one below.
                            </p>
                        </div>
                    ) : (
                        playlists.map((playlist) => {
                            const isSaved = playlist.videos?.includes(videoId);

                            return (
                                <button
                                    key={playlist._id}
                                    type="button"
                                    disabled={busyId === playlist._id}
                                    onClick={() => togglePlaylist(playlist)}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all hover:bg-surface-elevated active:scale-[0.99] disabled:opacity-60"
                                >
                                    <span
                                        className={`
                                            flex h-5 w-5 shrink-0 items-center justify-center rounded border
                                            ${isSaved
                                                ? "border-primary bg-primary text-white"
                                                : "border-border bg-background"
                                            }
                                        `}
                                    >
                                        {isSaved && <CheckIcon size={14} weight="bold" />}
                                    </span>

                                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
                                        {playlist.name}
                                    </span>

                                    {busyId === playlist._id && (
                                        <Loader color="blue" size={16} />
                                    )}
                                </button>
                            );
                        })
                    )}

                </div>

                <div className="my-4 border-t border-border" />

                {/* ===== CREATE NEW ===== */}
                {isCreating ? (
                    <form onSubmit={handleCreate}>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Playlist name"
                            maxLength={80}
                            autoFocus
                            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary outline-none placeholder:text-text-muted transition-colors focus:border-primary"
                        />

                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="mt-3 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted transition-colors focus:border-primary"
                        />

                        <input
                            type="file"
                            accept="image/*"
                            ref={coverInputRef}
                            onChange={handleCoverSelect}
                            className="hidden"
                        />

                        {coverPreview ? (
                            <div className="relative mt-3">
                                <img
                                    src={coverPreview}
                                    alt="Cover preview"
                                    className="aspect-video w-full rounded-xl object-cover"
                                />

                                <button
                                    type="button"
                                    aria-label="Remove cover"
                                    onClick={() => setCoverFile(null)}
                                    className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white transition-all active:scale-95"
                                >
                                    <XIcon size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => coverInputRef.current?.click()}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-surface-elevated"
                            >
                                <ImageIcon size={20} />
                                Add cover
                            </button>
                        )}

                        <div className="mt-3 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="rounded-full bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-primary transition-all active:scale-95"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={createLoading}
                                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-60"
                            >
                                {createLoading ? "Creating..." : "Create and save"}
                            </button>
                        </div>

                    </form>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsCreating(true)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-text-primary transition-all hover:bg-surface-elevated active:scale-[0.99]"
                    >
                        <PlusIcon size={20} weight="bold" />

                        Create new playlist
                    </button>
                )}

            </div>

        </div>
    );
}

export default SaveToPlaylistModal;