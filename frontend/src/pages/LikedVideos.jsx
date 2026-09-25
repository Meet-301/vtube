import { Sidebar, VideoCard } from "../components";

function LikedVideos() {

    const likedVideos = [
        {
            _id: 1,
            thumbnail:
                "https://picsum.photos/seed/liked1/640/360",
            title: "Building a Full Stack Video Platform",
            channelName: "Viraj Thakkar",
            views: "12K views",
            uploadedAt: "2 days ago",
            duration: "18:21",
        },
        {
            _id: 2,
            thumbnail:
                "https://picsum.photos/seed/liked2/640/360",
            title: "MongoDB Aggregation Pipeline Tutorial",
            channelName: "Code With Me",
            views: "5.7K views",
            uploadedAt: "5 days ago",
            duration: "12:34",
        },
        {
            _id: 3,
            thumbnail:
                "https://picsum.photos/seed/liked3/640/360",
            title: "React Advanced Patterns",
            channelName: "Frontend Daily",
            views: "21K views",
            uploadedAt: "1 week ago",
            duration: "15:42",
        },
    ];

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
                                        thumbnail={video.thumbnail}
                                        title={video.title}
                                        channelName={video.channelName}
                                        views={video.views}
                                        uploadedAt={video.uploadedAt}
                                        duration={video.duration}
                                        editButton={false}
                                    />
                                ))}

                            </div>

                        ) : (

                            /* ================= EMPTY STATE ================= */

                            <div
                                className="
                                    flex
                                    min-h-60
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-surface
                                    px-6
                                    text-center
                                "
                            >
                                <div>
                                    <h2
                                        className="
                                            text-lg
                                            font-semibold
                                            text-text-primary
                                        "
                                    >
                                        No liked videos yet
                                    </h2>

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            text-text-secondary
                                        "
                                    >
                                        Videos you like will appear here.
                                    </p>
                                </div>
                            </div>

                        )}

                    </section>

                </div>

            </div>

        </main>
    );
}

export default LikedVideos;