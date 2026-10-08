import { useEffect, useRef, useState } from "react";

import {
    CheckCircleIcon,
    ImageIcon,
    PlayCircleIcon,
    WarningCircleIcon,
    XIcon,
} from "@phosphor-icons/react";

import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import api from "../api/axios.js";
import { formatDuration, timeAgo } from "../utils/formatters.js";

function EditVideo() {

    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);

    const [video, setVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublished, setIsPublished] = useState(true);

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const thumbnailInputRef = useRef(null);

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

    //! fetch current video details
    async function fetchVideo() {
        try {
            const res = await api.get(`/videos/id/${id}`);
            const data = res.data?.data;

            setVideo(data);
            setTitle(data?.title || "");
            setDescription(data?.description || "");
            setIsPublished(data?.isPublished ?? true);
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchVideo();
    }, [id]);

    //! thumbnail preview, remove it from memory in cleanup
    useEffect(() => {
        if (!thumbnailFile) {
            setThumbnailPreview("");
            return;
        }

        const url = URL.createObjectURL(thumbnailFile);
        setThumbnailPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [thumbnailFile]);

    function handleThumbnailSelect(e) {
        const file = e.target.files?.[0];
        e.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showError("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError("Thumbnail size must be under 5MB");
            return;
        }

        setThumbnailFile(file);
    }

    function goBack() {
        if (window.history.state?.idx > 0) {
            navigate(-1);
        } else {
            navigate("/");
        }
    }

    async function handleSave() {
        if (!title.trim()) {
            showError("Title is required");
            return;
        }

        try {
            setIsSaving(true);

            //! 1. title, description, publish status
            await api.patch(`/videos/update-details/${id}`, {
                title: title.trim(),
                description: description.trim(),
                isPublished,
            });

            //! 2. only show thumbnail preview when user selects it
            if (thumbnailFile) {
                const body = new FormData();
                body.append("thumbnail", thumbnailFile);

                await api.patch(`/videos/update-thumbnail/${id}`, body);
            }

            showSuccess("Video updated successfully");
            setThumbnailFile(null);
            await fetchVideo();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsSaving(false);
        }
    }

    //! only owner can edit it
    const isOwner =
        !!currentUser?._id &&
        !!video?.owner?._id &&
        String(currentUser._id) === String(video.owner._id);

    return (
        <main className="px-4 py-6">

            <LoadingOverlay
                visible={isLoading || isSaving}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                loaderProps={{ color: "blue", type: "oval" }}
            />

            {video && !isOwner && (
                <p className="mx-auto max-w-5xl py-10 text-center text-text-secondary">
                    You are not allowed to edit this video.
                </p>
            )}

            {video && isOwner && (
                <div className="mx-auto w-full max-w-5xl py-6">

                    {/* ================= PAGE HEADER ================= */}

                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary md:text-3xl">
                            Edit video
                        </h1>
                    </div>


                    {/* ================= VIDEO PREVIEW ================= */}

                    <section className="mt-8 rounded-2xl border border-border bg-surface p-5 md:p-6">

                        <h2 className="text-lg font-semibold text-text-primary md:text-xl">
                            Video
                        </h2>

                        <div className="mt-5 flex flex-col gap-4 sm:flex-row">

                            {/* Thumbnail */}

                            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-background sm:w-64 md:w-72">
                                <img
                                    src={thumbnailPreview || video.thumbnail}
                                    alt="Video thumbnail"
                                    className="h-full w-full object-cover"
                                />

                                <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-white">
                                    <PlayCircleIcon size={15} weight="fill" />

                                    {formatDuration(video.duration)}
                                </div>
                            </div>

                            {/* Video information */}

                            <div className="min-w-0 flex-1">

                                <h3 className="line-clamp-2 text-lg font-semibold leading-6 text-text-primary">
                                    {video.title}
                                </h3>

                                <p className="mt-2 text-sm text-text-secondary">
                                    Uploaded {timeAgo(video.createdAt)}
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* ================= VIDEO DETAILS ================= */}

                    <section className="mt-6 rounded-2xl border border-border bg-surface p-5 md:p-6">

                        <h2 className="text-lg font-semibold text-text-primary md:text-xl">
                            Video details
                        </h2>

                        <div className="mt-6 space-y-5">

                            {/* Title */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-primary">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                                />
                            </div>


                            {/* Description */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-primary">
                                    Description
                                </label>

                                <textarea
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-text-primary outline-none transition-colors focus:border-primary"
                                />
                            </div>


                            {/* Thumbnail */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-primary">
                                    Thumbnail
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={thumbnailInputRef}
                                    onChange={handleThumbnailSelect}
                                    className="hidden"
                                />

                                <button
                                    type="button"
                                    onClick={() => thumbnailInputRef.current?.click()}
                                    className="flex min-h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 text-center transition-colors hover:bg-surface-elevated active:bg-surface-elevated active:scale-[0.99]"
                                >
                                    <ImageIcon size={28} className="text-text-secondary" />

                                    <span className="mt-2 text-sm font-medium text-text-primary">
                                        {thumbnailFile ? thumbnailFile.name : "Change thumbnail"}
                                    </span>

                                    <span className="mt-1 text-xs text-text-muted">
                                        JPG, PNG or WebP
                                    </span>
                                </button>
                            </div>

                        </div>

                    </section>


                    {/* ================= PUBLISHING ================= */}

                    <section className="mt-6 rounded-2xl border border-border bg-surface p-5 md:p-6">

                        <h2 className="text-lg font-semibold text-text-primary md:text-xl">
                            Publishing
                        </h2>

                        <div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-background px-4 py-4">

                            <div className="min-w-0">
                                <p className="text-sm font-medium text-text-primary">
                                    {isPublished ? "Published" : "Unpublished"}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-text-secondary">
                                    {isPublished
                                        ? "This video is visible to viewers."
                                        : "This video is hidden from viewers."}
                                </p>
                            </div>

                            {/* Switch */}

                            <button
                                type="button"
                                role="switch"
                                aria-checked={isPublished}
                                onClick={() => setIsPublished((prev) => !prev)}
                                className={`
                                    relative
                                    h-7
                                    w-12
                                    shrink-0
                                    rounded-full
                                    transition-colors
                                    duration-200
                                    ${isPublished ? "bg-primary" : "bg-surface-elevated"}
                                `}
                            >
                                <span
                                    className={`
                                        absolute
                                        top-1
                                        h-5
                                        w-5
                                        rounded-full
                                        bg-white
                                        shadow-sm
                                        transition-all
                                        duration-200
                                        ${isPublished ? "right-1" : "left-1"}
                                    `}
                                />
                            </button>

                        </div>

                    </section>


                    {/* ================= ACTIONS ================= */}

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={goBack}
                            className="flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-text-primary transition-all duration-200 hover:bg-surface-elevated active:bg-surface-elevated active:scale-95"
                        >
                            <XIcon size={18} />

                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={handleSave}
                            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover active:bg-primary-hover active:scale-95 disabled:opacity-60"
                        >
                            <CheckCircleIcon size={18} weight="bold" />

                            Save changes
                        </button>

                    </div>

                </div>
            )}

        </main>
    );
}

export default EditVideo;