import { useEffect, useRef, useState } from "react";

import {
    ImageIcon,
    XIcon,
    CheckCircleIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import api from "../api/axios.js";
import { updateUser } from "../features/authSlice.js";

function EditChannel() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [original, setOriginal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [username, setUsername] = useState("");
    const [description, setDescription] = useState("");

    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState("");
    const bannerInputRef = useRef(null);

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

    async function fetchChannel() {
        try {
            const res = await api.get("/users/current-user");
            const data = res.data?.data ?? {};

            setOriginal(data);
            setUsername(data.username || "");
            setDescription(data.channelDescription || "");
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchChannel();
    }, []);

    //! remove the banner preview from cleanup memory
    useEffect(() => {
        if (!bannerFile) {
            setBannerPreview("");
            return;
        }

        const url = URL.createObjectURL(bannerFile);
        setBannerPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [bannerFile]);

    function handleBannerSelect(e) {
        const file = e.target.files?.[0];
        e.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showError("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError("Banner size must be under 5MB");
            return;
        }

        setBannerFile(file);
    }

    function goBack() {
        if (window.history.state?.idx > 0) {
            navigate(-1);
        } else {
            navigate("/");
        }
    }

    async function handleSave() {
        const newUsername = username.trim().toLowerCase();
        const newDescription = description.trim();

        if (!newUsername) {
            showError("Username is required");
            return;
        }

        if (!/^[a-z0-9._]+$/.test(newUsername)) {
            showError("Username can only have letters, numbers, dot and underscore");
            return;
        }

        //! only send the fields which have new values
        const fields = {};

        if (newUsername !== original.username) fields.username = newUsername;
        if (newDescription !== (original.channelDescription || "")) {
            fields.channelDescription = newDescription;
        }

        if (Object.keys(fields).length === 0 && !bannerFile) {
            showError("Nothing to update");
            return;
        }

        try {
            setIsSaving(true);

            if (Object.keys(fields).length > 0) {
                await api.patch("/users/update-account", fields);
            }

            if (bannerFile) {
                const body = new FormData();
                body.append("coverImage", bannerFile);

                await api.patch("/users/update-cover", body);
            }

            showSuccess("Channel updated successfully");
            setBannerFile(null);
            await fetchChannel();

            if (fields.username) {
                dispatch(updateUser({ username: fields.username }));
            }
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsSaving(false);
        }
    }

    const bannerSrc = bannerPreview || original?.coverImage;

    return (
        <main className="px-4 py-6">

            <LoadingOverlay
                visible={isLoading || isSaving}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                loaderProps={{ color: "blue", type: "oval" }}
            />

            {original && (
                <div className="mx-auto w-full max-w-4xl py-6">

                    {/* ================= PAGE HEADER ================= */}

                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary md:text-3xl">
                            Edit channel
                        </h1>
                    </div>


                    {/* ================= BANNER ================= */}

                    <section className="mt-8 rounded-2xl border border-border bg-surface p-5 md:p-6">

                        <h2 className="text-lg font-semibold text-text-primary md:text-xl">
                            Channel banner
                        </h2>

                        <div className="mt-5 overflow-hidden rounded-xl bg-background">

                            {/* Current banner */}

                            <div className="aspect-3/1 w-full bg-surface-elevated">
                                {bannerSrc ? (
                                    <img
                                        src={bannerSrc}
                                        alt="Channel banner"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <ImageIcon size={40} className="text-text-muted" />
                                    </div>
                                )}
                            </div>

                            {/* Change banner */}

                            <div className="p-4">

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={bannerInputRef}
                                    onChange={handleBannerSelect}
                                    className="hidden"
                                />

                                <button
                                    type="button"
                                    onClick={() => bannerInputRef.current?.click()}
                                    className="flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-surface-elevated active:bg-surface-elevated active:scale-95"
                                >
                                    <ImageIcon size={18} />

                                    Change banner
                                </button>

                                <p className="mt-2 text-xs text-text-muted">
                                    JPG, PNG or WebP
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* ================= CHANNEL DETAILS ================= */}

                    <section className="mt-6 rounded-2xl border border-border bg-surface p-5 md:p-6">

                        <h2 className="text-lg font-semibold text-text-primary md:text-xl">
                            Channel information
                        </h2>

                        <div className="mt-6 space-y-5">

                            {/* Username */}

                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-2 block text-sm font-medium text-text-primary"
                                >
                                    Username
                                </label>

                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary"
                                />
                            </div>


                            {/* Description */}

                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-medium text-text-primary"
                                >
                                    Channel description
                                </label>

                                <textarea
                                    id="description"
                                    rows={6}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tell viewers about your channel"
                                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary"
                                />
                            </div>

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

export default EditChannel;