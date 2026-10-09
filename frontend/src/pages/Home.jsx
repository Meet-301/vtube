import api from "../api/axios";
import {
    VideoCard,
    CategoryBar,
    Sidebar
} from "../components";
import { useState, useEffect, useRef, useCallback } from "react";
import { LoadingOverlay, Loader } from "@mantine/core";
import { Link } from "react-router-dom";
import { useSaveToPlaylist } from "../context/SaveToPlaylistContext";
import { useShare } from "../hooks/useShare";

const LIMIT = 9;

function Home() {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("latest");

    const observerTarget = useRef(null);

    // Initial fetch or when sortBy changes
    useEffect(() => {
        let isMounted = true;

        async function fetchInitialVideos() {
            try {
                setIsLoading(true);
                setPage(1);

                const response = await api.get("/videos/all", {
                    params: { sortBy, page: 1, limit: LIMIT },
                });

                if (!isMounted) return;

                const data = response.data?.data;
                const fetchedVideos = Array.isArray(data) ? data : (data?.videos || []);
                const more = Array.isArray(data) ? (fetchedVideos.length >= LIMIT) : (data?.hasMore ?? false);

                setVideos(fetchedVideos);
                setHasMore(more);
            } catch (error) {
                console.log(
                    "Failed to fetch videos:",
                    error.response?.data || error
                );
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchInitialVideos();

        return () => {
            isMounted = false;
        };
    }, [sortBy]);

    // Load more videos for next page
    const loadMoreVideos = useCallback(async () => {
        if (isLoading || isLoadingMore || !hasMore) return;

        try {
            setIsLoadingMore(true);
            const nextPage = page + 1;

            const response = await api.get("/videos/all", {
                params: { sortBy, page: nextPage, limit: LIMIT },
            });

            const data = response.data?.data;
            const newVideos = Array.isArray(data) ? data : (data?.videos || []);
            const more = Array.isArray(data) ? (newVideos.length >= LIMIT) : (data?.hasMore ?? false);

            setVideos((prev) => [...prev, ...newVideos]);
            setPage(nextPage);
            setHasMore(more);
        } catch (error) {
            console.log(
                "Failed to load more videos:",
                error.response?.data || error
            );
        } finally {
            setIsLoadingMore(false);
        }
    }, [page, sortBy, isLoading, isLoadingMore, hasMore]);

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        const element = observerTarget.current;
        if (!element || !hasMore || isLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreVideos();
                }
            },
            { threshold: 0.1, rootMargin: "250px" }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [loadMoreVideos, hasMore, isLoading]);

    const { openSave } = useSaveToPlaylist();
    const { share } = useShare();

    return (
        <main className="flex min-w-0">

            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                loaderProps={{ color: "blue", type: "oval" }}
            />

            <Sidebar />

            <div className="min-w-0 flex-1 p-4">

                <div
                    className="
                        sticky
                        top-12
                        md:top-16
                        z-40
                        bg-background/75
                        backdrop-blur-xl
                        -ml-5
                    "
                >
                    <CategoryBar selected={sortBy} onSelect={setSortBy} />
                </div>

                {videos.length === 0 && !isLoading ? (
                    <div className="py-20 text-center">
                        <p className="text-base text-text-secondary">
                            No videos found. Be the first to upload one!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                        {videos.map((video) => (
                            <Link key={video._id} to={`/watch/${video._id}`}>
                                <VideoCard
                                    channelName={video.owner?.fullName}
                                    avatar={video.owner?.avatar}
                                    {...video}
                                    editButton={false}
                                    deleteButton={false}
                                    onSaveClick={() => openSave(video._id)}
                                    onShareClick={() => share({
                                        path: `/watch/${video._id}`,
                                        title: `${video.title}`
                                    })}
                                />
                            </Link>
                        ))}
                    </div>
                )}

                {/* Infinite Scroll bottom sentinel & loading indicator */}
                <div ref={observerTarget} className="py-8 flex justify-center items-center">
                    {isLoadingMore && (
                        <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                            <Loader size={20} color="blue" />
                            <span>Loading more videos...</span>
                        </div>
                    )}
                    {!hasMore && videos.length > 0 && !isLoading && (
                        <p className="text-xs text-text-muted">
                            You're all caught up ✨
                        </p>
                    )}
                </div>

            </div>

        </main>
    );
}

export default Home;