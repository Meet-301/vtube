import { BellIcon, CheckIcon } from "@phosphor-icons/react";

import {
    Sidebar,
    CategoryBar,
    VideoCard,
} from "../components";

function Subscriptions() {

    const channels = [
        {
            avatar: "https://i.pravatar.cc/150?img=12",
            name: "Code With Meet",
            subscribers: "12.4K subscribers",
        },
        {
            avatar: "https://i.pravatar.cc/150?img=32",
            name: "Dev Academy",
            subscribers: "84.7K subscribers",
        },
        {
            avatar: "https://i.pravatar.cc/150?img=45",
            name: "Backend Lab",
            subscribers: "31.2K subscribers",
        },
        {
            avatar: "https://i.pravatar.cc/150?img=56",
            name: "Code Stories",
            subscribers: "52.8K subscribers",
        },
    ];

    const videos = [
        {
            thumbnail:
                "https://picsum.photos/seed/sub1/640/360",
            title:
                "Building a Full Stack Video Platform with MERN",
            avatar:
                "https://i.pravatar.cc/150?img=12",
            channelName:
                "Code With Meet",
            views:
                "12K views",
            uploadedAt:
                "2 days ago",
            duration:
                "18:42",
        },
        {
            thumbnail:
                "https://picsum.photos/seed/sub2/640/360",
            title:
                "React Hooks Explained in Simple Terms",
            avatar:
                "https://i.pravatar.cc/150?img=32",
            channelName:
                "Dev Academy",
            views:
                "8.4K views",
            uploadedAt:
                "5 days ago",
            duration:
                "14:27",
        },
        {
            thumbnail:
                "https://picsum.photos/seed/sub3/640/360",
            title:
                "MongoDB Aggregation Pipeline Tutorial",
            avatar:
                "https://i.pravatar.cc/150?img=45",
            channelName:
                "Backend Lab",
            views:
                "21K views",
            uploadedAt:
                "1 week ago",
            duration:
                "22:16",
        },
        {
            thumbnail:
                "https://picsum.photos/seed/sub4/640/360",
            title:
                "How I Built My First Production Web App",
            avatar:
                "https://i.pravatar.cc/150?img=56",
            channelName:
                "Code Stories",
            views:
                "34K views",
            uploadedAt:
                "2 weeks ago",
            duration:
                "16:51",
        },
        {
            thumbnail:
                "https://picsum.photos/seed/sub5/640/360",
            title:
                "JavaScript Async Await Finally Explained",
            avatar:
                "https://i.pravatar.cc/150?img=68",
            channelName:
                "JS Simplified",
            views:
                "17K views",
            uploadedAt:
                "3 weeks ago",
            duration:
                "11:38",
        },
        {
            thumbnail:
                "https://picsum.photos/seed/sub6/640/360",
            title:
                "What Actually Happens When You Call an API?",
            avatar:
                "https://i.pravatar.cc/150?img=11",
            channelName:
                "Web Dev Daily",
            views:
                "9.7K views",
            uploadedAt:
                "1 month ago",
            duration:
                "13:04",
        },
    ];

    return (
        <main className="flex min-w-0">

            {/* ================= MAIN CONTENT ================= */}

            <div className="min-w-0 flex-1 p-4">

                {/* ================= CATEGORY BAR ================= */}

                <div
                    className="
                        sticky
                        top-12
                        z-40
                        bg-background/75
                        backdrop-blur-xl
                        md:top-16
                    "
                >
                    <div className="xl:ml-14">
                        <CategoryBar />
                    </div>
                    
                </div>


                {/* ================= PAGE CONTENT ================= */}

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-350
                        py-6
                    "
                >

                    {/* ================= PAGE TITLE ================= */}

                    <h1
                        className="
                            text-2xl
                            font-semibold
                            text-text-primary
                            md:text-3xl
                        "
                    >
                        Subscriptions
                    </h1>


                    {/* ================= CHANNELS ================= */}

                    <section className="mt-6">

                        <div
                            className="
                                flex
                                gap-4
                                overflow-x-auto
                                pb-2
                                scrollbar-none
                            "
                        >

                            {channels.map((channel) => (

                                <div
                                    key={channel.name}
                                    className="
                                        flex
                                        min-w-64
                                        shrink-0
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        bg-surface
                                        hover:bg-surface-elevated
                                        cursor-pointer
                                        transition-transform
                                        duration-150
                                        active:scale-95
                                        p-3
                                    "
                                >

                                    {/* Avatar */}

                                    <img
                                        src={channel.avatar}
                                        alt={channel.name}
                                        className="
                                            h-12
                                            w-12
                                            shrink-0
                                            rounded-full
                                            object-cover
                                        "
                                    />


                                    {/* Channel information */}

                                    <div className="min-w-0 flex-1">

                                        <h2
                                            className="
                                                truncate
                                                text-sm
                                                font-semibold
                                                text-text-primary
                                            "
                                        >
                                            {channel.name}
                                        </h2>

                                        <p
                                            className="
                                                mt-0.5
                                                truncate
                                                text-xs
                                                text-text-muted
                                            "
                                        >
                                            {channel.subscribers}
                                        </p>

                                    </div>


                                    {/* Subscribed button */}

                                    <button
                                        type="button"
                                        className="
                                            flex
                                            h-9
                                            shrink-0
                                            items-center
                                            gap-1.5
                                            rounded-full
                                            bg-surface-elevated
                                            px-3
                                            text-xs
                                            font-medium
                                            text-text-primary
                                            transition-all
                                            duration-150
                                            hover:bg-primary-hover
                                            active:bg-primary-hover
                                            hover:text-white
                                            active:scale-95
                                        "
                                    >
                                        <CheckIcon
                                            size={16}
                                            weight="bold"
                                        />

                                        <span>
                                            Subscribed
                                        </span>
                                    </button>

                                </div>

                            ))}

                        </div>

                    </section>


                    {/* ================= DIVIDER ================= */}

                    <div
                        className="
                            my-7
                            border-t
                            border-border
                        "
                    />


                    {/* ================= LATEST VIDEOS ================= */}

                    <section>

                        <div
                            className="
                                mb-5
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-text-primary
                                    md:text-xl
                                "
                            >
                                Latest videos
                            </h2>

                        </div>


                        {/* ================= VIDEO GRID ================= */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-x-4
                                gap-y-8
                                sm:grid-cols-2
                                lg:grid-cols-3
                            "
                        >

                            {videos.map((video, index) => (

                                <VideoCard
                                    key={index}
                                    {...video}
                                />

                            ))}

                        </div>

                    </section>

                </div>

            </div>

        </main>
    );
}

export default Subscriptions;