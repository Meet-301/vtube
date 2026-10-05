import api from "../api/axios";
import {
    VideoCard,
    CategoryBar,
    Sidebar
} from "../components";
import { useState, useEffect } from "react";
import { LoadingOverlay } from "@mantine/core";
import { Link } from "react-router-dom";

function Home() {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchVideos() {
            try {
                const response = await api.get("/videos/all");

                setVideos(response.data?.data || []);
            } catch (error) {
                console.log(
                    "Failed to fetch videos:",
                    error.response?.data || error
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchVideos();
    }, []);

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
                    "
                >
                    <CategoryBar />
                </div>

                <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video) => (
                        <Link to={`/watch/${video._id}`}>
                            <VideoCard
                                key={video._id}
                                channelName={video.owner.fullName}
                                avatar={video.owner.avatar}
                                {...video}
                                editButton={false}
                                deleteButton={false}
                            />
                        </Link>
                    ))}
                </div>

            </div>

        </main>
    );
}

export default Home;