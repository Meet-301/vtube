import { useEffect, useState } from "react";
import { VideoCard } from "../components";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  WarningCircleIcon, 
  CheckCircleIcon,
  ThumbsUpIcon
} from "@phosphor-icons/react";
import api from "../api/axios.js";
import { useShare } from "../hooks/useShare.jsx";
import { useSaveToPlaylist } from "../context/SaveToPlaylistContext.jsx";

function LikedVideos() {

    const [likedVideos, setLikedVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { openSave } = useSaveToPlaylist();
    const { share } = useShare();

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

    async function fetchLikedVideos() {
        try {
            const res = await api.get("/likes/all");

            setLikedVideos(res.data?.data.map((item) => item.video) ?? []);
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {fetchLikedVideos()}, []);

    async function handleDelete(id) {
        try {
            setIsLoading(true);

            const res = await api.patch(`/likes/toggle/${id}`);

            showSuccess(res.data?.message || "Video unliked successfully");
            await fetchLikedVideos();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="flex min-w-0">

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

                    <h1
                        className="
                            text-2xl
                            font-semibold
                            text-text-primary
                            md:text-3xl
                        "
                    >
                        Liked videos
                    </h1>

                    {/* ================= VIDEOS ================= */}

                    <section className="mt-8">

                        <LoadingOverlay
                            visible={isLoading}
                            zIndex={1000}
                            overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                            loaderProps={{ color: "blue", type: "oval" }}
                        />

                        {likedVideos.length > 0 ? (

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-x-4
                                    gap-y-8
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                    xl:grid-cols-4
                                "
                            >

                                {likedVideos.map((video) => (
                                    <VideoCard
                                        key={video._id}
                                        channelName={video.owner.fullName}
                                        avatar={video.owner.avatar}
                                        editButton={false}
                                        onDeleteClick={() => handleDelete(video._id)}
                                        onSaveClick={() => openSave(video._id)}
                                        onShareClick={() => share({
                                            path: `/watch/${video._id}`,
                                            title: `${video.title}`
                                        })}
                                        deleteText="Remove"
                                        {...video}
                                    />
                                ))}

                            </div>

                        ) : (

                            /* ================= EMPTY STATE ================= */

                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface">
                                    <ThumbsUpIcon
                                        size={48}
                                        weight="regular"
                                        className="text-text-muted"
                                    />
                                </div>

                                <h2 className="mt-5 text-lg font-semibold text-text-primary">
                                    No liked videos yet
                                </h2>

                                <p className="mt-1 max-w-sm text-sm text-text-secondary">
                                    Videos you like will appear here.
                                </p>
                            </div>

                        )}

                    </section>

                </div>

            </div>

        </main>
    );
}

export default LikedVideos;