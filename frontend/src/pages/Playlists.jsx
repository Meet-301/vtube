import {
    PlusIcon,
    PlayCircleIcon,
    WarningCircleIcon,
    ListIcon,
    QueueIcon
} from "@phosphor-icons/react";

import {
    MoreButton,
    Sidebar,
} from "../components";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import api from "../api/axios";

function Playlists() {

    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    function showError(error) {
        notifications.show({
            title: error || "Something went wrong",
            color: "red",
            icon: <WarningCircleIcon />
        });
    }

    useEffect(() => {
        async function fetchPlaylists() {
            try {
                const res = await api.get("/playlists/get/user");

                setPlaylists(res.data?.data ?? []);
            } catch (error) {
                showError(error?.response?.data?.message || "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        }

        fetchPlaylists();
    }, []);

    return (

        <main className="flex min-w-0">

            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                loaderProps={{ color: "blue", type: "oval" }}
            />

            {/* ================= SIDEBAR ================= */}

            <Sidebar />

            {/* ================= MAIN CONTENT ================= */}

            <div className="min-w-0 flex-1 p-4">

                <div className="mx-auto w-full max-w-350 py-6">

                    {/* ================= PAGE HEADER ================= */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <div>
                            <h1 className="text-2xl font-semibold text-text-primary md:text-3xl">
                                Playlists
                            </h1>
                        </div>

                    </div>


                    {/* ================= PLAYLISTS ================= */}

                    <section className="mt-8">

                        {/* ===== EMPTY STATE ===== */}

                        {!isLoading && playlists.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface">
                                    <QueueIcon
                                        size={48}
                                        weight="regular"
                                        className="text-text-muted"
                                    />
                                </div>

                                <h2 className="mt-5 text-lg font-semibold text-text-primary">
                                    No playlists yet
                                </h2>

                                <p className="mt-1 max-w-sm text-sm text-text-secondary">
                                    Playlists you create will appear here.
                                </p>
                            </div>
                        )}

                        {playlists.length > 0 && (
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

                                {playlists.map((playlist) => (

                                    <div
                                        key={playlist._id}
                                        className="relative min-w-0"
                                    >

                                        {/* ===== PLAYLIST CLICK AREA ===== */}

                                        <button
                                            type="button"
                                            onClick={() => navigate(`/playlists/${playlist._id}`)}
                                            className="
                                                group
                                                block
                                                w-full
                                                min-w-0
                                                text-left
                                                transition-transform
                                                duration-150
                                                active:scale-95
                                            "
                                        >

                                            {/* ===== THUMBNAIL ===== */}

                                            <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface">

                                                {playlist.playlistCover ? (
                                                    <img
                                                        src={playlist.playlistCover}
                                                        alt={playlist.name}
                                                        className="h-full w-full object-cover group-hover:scale-[1.02]"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <ListIcon
                                                            size={40}
                                                            className="text-text-muted"
                                                        />
                                                    </div>
                                                )}

                                                {/* ===== VIDEO COUNT ===== */}

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
                                                        py-1
                                                        text-sm
                                                        font-medium
                                                        text-white
                                                    "
                                                >
                                                    <PlayCircleIcon size={15} weight="fill" />

                                                    <span>
                                                        {playlist.videoCount ?? 0}{" "}
                                                        {playlist.videoCount === 1 ? "video" : "videos"}
                                                    </span>
                                                </div>

                                            </div>

                                            {/* ===== INFORMATION ===== */}

                                            <div className="mt-3 min-w-0 pr-10">
                                                <h3
                                                    className="
                                                        line-clamp-2
                                                        text-lg
                                                        font-semibold
                                                        leading-6
                                                        text-text-primary
                                                        transition-colors
                                                        duration-150
                                                        group-hover:text-primary-hover
                                                        group-active:text-primary-hover
                                                    "
                                                >
                                                    {playlist.name}
                                                </h3>
                                            </div>

                                        </button>

                                        {/* ===== MORE BUTTON ===== */}

                                        <div
                                            className="
                                                absolute
                                                right-0
                                                top-[calc(100%-2.25rem)]
                                                z-10
                                            "
                                        >
                                            <MoreButton isEditable={true} />
                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}

                    </section>

                </div>

            </div>

        </main>
    );
}

export default Playlists;