import { 
    TrashIcon, 
    WarningCircleIcon, 
    CheckCircleIcon, 
    ClockCounterClockwiseIcon 
} from "@phosphor-icons/react";
import {
    SearchButton,
    VideoCard,
} from "../components";
import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { Loader } from "@mantine/core";

function History() {

    const [isLoading, setIsLoading] = useState(true);
    const [historyVideos, setHistoryVideos] = useState([]);

    function showError(error) {
        notifications.show({
            title: error || "Invalid or expired verification link",
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

    async function loadHistory() {
        try {
            const res = await api.get("/users/history/watch-history");

            setHistoryVideos(res.data?.data ?? []);
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id) {
        try {
            setIsLoading(true);

            const res = await api.delete(
                "/users/watch-history/remove", 
                {params: {
                    videoId: id
                }}
            );

            showSuccess(res.data?.message || "Video removed successfully");
            await loadHistory();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        }
    }

    async function clearHistory() {
        try {
            setIsLoading(true);

            const res = await api.delete("/users/watch-history/clear");

            showSuccess(res.data?.message || "Watch history cleared successfully");
            await loadHistory();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        }
    }

    useEffect(() => {loadHistory()}, [historyVideos]);

    return (
        <main className="min-w-0">

            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                loaderProps={{ color: "blue", type: "oval" }}
            />

            <div className="min-w-0 p-4">

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-350
                        py-6
                    "
                >

                    {/* PAGE HEADER */}
                    <div className="relative">

                        {/* Title */}
                        <h1
                            className="
                                text-2xl
                                font-semibold
                                text-text-primary
                                md:text-3xl
                            "
                        >
                            Watch history
                        </h1>

                        {/* HISTORY CONTROLS */}
                        <aside
                            className="
                                mt-6
                                rounded-2xl
                                bg-surface
                                p-4
                                xl:absolute
                                xl:right-0
                                xl:top-0
                                xl:mt-0
                                xl:w-72
                            "
                        >
                            {/* Search */}
                            <div className="group relative">
                                <input
                                    type="text"
                                    placeholder="Search watch history"
                                    className="
                                        h-11
                                        w-full
                                        rounded-full
                                        border
                                        border-border
                                        bg-background
                                        px-4
                                        pr-12
                                        text-sm
                                        text-text-primary
                                        outline-none
                                        placeholder:text-text-muted
                                        focus:border-primary
                                    "
                                />

                                <SearchButton />
                            </div>

                            {/* Divider */}
                            <div
                                className="
                                    my-4
                                    border-t
                                    border-border
                                "
                            />

                            {/* Clear history */}
                            <button
                                type="button"
                                onClick={clearHistory}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-3
                                    text-left
                                    text-sm
                                    font-medium
                                    text-text-primary
                                    transition-all
                                    duration-200
                                    hover:bg-surface-elevated
                                    active:bg-surface-elevated
                                    active:scale-[0.99]
                                "
                            >
                                <TrashIcon
                                    size={20}
                                    weight="regular"
                                />

                                <span>
                                    Clear watch history
                                </span>
                            </button>
                        </aside>

                    </div>

                    {/* HISTORY CONTENT */}
                    <section
                        className="
                            mt-8
                            xl:pr-80
                        "
                    >
                        {historyVideos.length === 0 && !isLoading && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface">
                                    <ClockCounterClockwiseIcon
                                        size={48}
                                        weight="regular"
                                        className="text-text-muted"
                                    />
                                </div>

                                <h2 className="mt-5 text-lg font-semibold text-text-primary">
                                    No watch history yet
                                </h2>

                                <p className="mt-1 max-w-sm text-sm text-text-secondary">
                                    Videos you watch will show up here.
                                </p>
                            </div>
                        )}

                        {/* VIDEOS */}
                        <div
                            className="
                                mt-5
                                w-full
                                max-w-5xl
                                space-y-6
                            "
                        >
                            {
                                isLoading
                                ?
                                    <Loader
                                        color="blue"
                                        size={21}
                                    />
                                :
                               historyVideos.map((video) => (
                                    <Link to={`/watch/${video._id}`}>
                                        <VideoCard
                                            key={video._id}
                                            channelName={video.owner?.fullName}
                                            variant="horizontal"
                                            editButton={false}
                                            onDeleteClick={() => handleDelete(video._id)}
                                            deleteText="Remove"
                                            {...video}
                                        />
                                    </Link>
                                ))
                            }

                        </div>

                    </section>

                </div>

            </div>
        </main>
    );
}

export default History;