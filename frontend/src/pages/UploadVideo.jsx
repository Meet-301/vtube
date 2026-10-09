import {
    CheckCircleIcon,
    ImageIcon,
    UploadSimpleIcon,
    VideoCameraIcon,
    WarningCircleIcon,
    XIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import api from "../api/axios";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; //! 100MB (Cloudinary free plan limit of)
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; //! 5MB
const MAX_DURATION = 30 * 60; //! 30 mins limit

function UploadVideo() {

    const [isLoading, setIsLoading] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState("");

    const videoInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);

    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

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

    //! make the video preview URL
    //! and also remove it from cleanup memory at the end
    useEffect(() => {
        if (!videoFile) {
            setVideoPreview("");
            return;
        }

        const url = URL.createObjectURL(videoFile);
        setVideoPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [videoFile]);

    //! thumbnail preview URL
    useEffect(() => {
        if (!thumbnailFile) {
            setThumbnailPreview("");
            return;
        }

        const url = URL.createObjectURL(thumbnailFile);
        setThumbnailPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [thumbnailFile]);

    function validateAndSetVideo(file) {
        if (!file) return;

        if (!file.type.startsWith("video/")) {
            showError("Please select a video file");
            return;
        }

        if (file.size > MAX_VIDEO_SIZE) {
            showError("Video size must be under 100MB");
            return;
        }

        setVideoFile(file);
    }

    function handleVideoSelect(e) {
        validateAndSetVideo(e.target.files?.[0]);
        e.target.value = ""; //! can select the same file again
    }

    //! drag and drop
    function handleVideoDrop(e) {
        e.preventDefault();
        validateAndSetVideo(e.dataTransfer.files?.[0]);
    }

    function handleThumbnailSelect(e) {
        const file = e.target.files?.[0];
        e.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showError("Please select an image file");
            return;
        }

        if (file.size > MAX_THUMBNAIL_SIZE) {
            showError("Thumbnail size must be under 5MB");
            return;
        }

        setThumbnailFile(file);
    }

    //! check the duration during preview load
    function handleVideoMetadata(e) {
        if (e.target.duration > MAX_DURATION) {
            showError("Video duration exceeds the limit of 30 minutes");
            setVideoFile(null);
        }
    }

    async function onSubmit(formData) {
        if (!videoFile || !thumbnailFile) {
            showError("Video and thumbnail both are required");
            return;
        }

        const body = new FormData();
        body.append("title", formData.title);
        body.append("description", formData.description || "");
        body.append("video", videoFile);
        body.append("thumbnail", thumbnailFile);

        try {
            setIsLoading(true);

            const res = await api.post("/videos/create", body);

            showSuccess(res.data?.message || "Video uploaded successfully");
            navigate("/");
        } catch (error) {
            console.log(error);
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
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

            <div className="mx-auto w-full max-w-5xl py-6">

                {/* ================= PAGE HEADER ================= */}

                <div>
                    <h1 className="text-2xl font-semibold text-text-primary md:text-3xl">
                        Upload video
                    </h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit, () => showError("Title is required"))}>

                    {/* ================= UPLOAD AREA ================= */}

                    <section className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-6 md:p-10">

                        <input
                            type="file"
                            accept="video/*"
                            ref={videoInputRef}
                            onChange={handleVideoSelect}
                            className="hidden"
                        />

                        {videoPreview ? (

                            /* ===== VIDEO PREVIEW ===== */
                            <div className="relative">
                                <video
                                    src={videoPreview}
                                    controls
                                    onLoadedMetadata={handleVideoMetadata}
                                    className="aspect-video w-full rounded-xl bg-black"
                                />

                                <button
                                    type="button"
                                    aria-label="Remove video"
                                    onClick={() => setVideoFile(null)}
                                    className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white transition-all active:scale-95"
                                >
                                    <XIcon size={18} />
                                </button>

                                <p className="mt-3 truncate text-xs text-text-secondary">
                                    {videoFile?.name} • {(videoFile?.size / (1024 * 1024)).toFixed(1)} MB
                                </p>
                            </div>

                        ) : (

                            /* ===== SELECT AREA ===== */
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleVideoDrop}
                                className="flex min-h-72 flex-col items-center justify-center rounded-xl bg-background px-5 text-center"
                            >

                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated text-text-secondary">
                                    <VideoCameraIcon size={32} weight="regular" />
                                </div>

                                <h2 className="mt-5 text-lg font-semibold text-text-primary">
                                    Upload your video
                                </h2>

                                <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
                                    Drag and drop your video here, or select a
                                    video from your device.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => videoInputRef.current?.click()}
                                    className="mt-5 flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover active:scale-95"
                                >
                                    <UploadSimpleIcon size={20} weight="bold" />

                                    Select video
                                </button>

                                <p className="mt-3 text-xs text-text-muted">
                                    MP4, WebM or MOV • Maximum 100 MB
                                </p>

                            </div>

                        )}

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
                                    {...register("title", { required: true })}
                                    placeholder="Enter video title"
                                    className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary outline-none placeholder:text-text-muted transition-colors focus:border-primary"
                                />
                            </div>


                            {/* Description */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-text-primary">
                                    Description
                                </label>

                                <textarea
                                    rows={5}
                                    {...register("description")}
                                    placeholder="Tell viewers about your video"
                                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-text-primary outline-none placeholder:text-text-muted transition-colors focus:border-primary"
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

                                {thumbnailPreview ? (

                                    /* ===== THUMBNAIL PREVIEW ===== */
                                    <div className="relative w-full max-w-sm">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="aspect-video w-full rounded-xl object-cover"
                                        />

                                        <button
                                            type="button"
                                            aria-label="Remove thumbnail"
                                            onClick={() => setThumbnailFile(null)}
                                            className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white transition-all active:scale-95"
                                        >
                                            <XIcon size={18} />
                                        </button>
                                    </div>

                                ) : (

                                    <button
                                        type="button"
                                        onClick={() => thumbnailInputRef.current?.click()}
                                        className="flex min-h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 text-center transition-colors hover:bg-surface-elevated active:bg-surface-elevated active:scale-[0.99]"
                                    >
                                        <ImageIcon size={28} className="text-text-secondary" />

                                        <span className="mt-2 text-sm font-medium text-text-primary">
                                            Add thumbnail
                                        </span>

                                        <span className="mt-1 text-xs text-text-muted">
                                            JPG, PNG or WebP
                                        </span>
                                    </button>

                                )}
                            </div>

                        </div>

                    </section>


                    {/* ================= ACTIONS ================= */}

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-text-primary transition-all duration-200 hover:bg-surface-elevated active:bg-surface-elevated active:scale-95"
                        >
                            <XIcon size={18} />

                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover active:bg-primary-hover active:scale-95 disabled:opacity-60"
                        >
                            <CheckCircleIcon size={18} weight="bold" />

                            Upload video
                        </button>

                    </div>

                </form>

            </div>

        </main>
    );
}

export default UploadVideo;