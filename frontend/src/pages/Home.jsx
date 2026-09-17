import {
    VideoCard
} from "../components";

function Home() {
    const videos = [
        {
            thumbnail: "https://picsum.photos/seed/vtube1/640/360",
            title: "Building a Full Stack Video Platform with MERN",
            avatar: "https://i.pravatar.cc/150?img=12",
            channelName: "Code With Meet",
            views: "12K views",
            uploadedAt: "2 days ago",
        },
        {
            thumbnail: "https://picsum.photos/seed/vtube2/640/360",
            title: "React Hooks Explained in Simple Terms",
            avatar: "https://i.pravatar.cc/150?img=32",
            channelName: "Dev Academy",
            views: "8.4K views",
            uploadedAt: "5 days ago",
        },
        {
            thumbnail: "https://picsum.photos/seed/vtube3/640/360",
            title: "MongoDB Aggregation Pipeline Tutorial",
            avatar: "https://i.pravatar.cc/150?img=45",
            channelName: "Backend Lab",
            views: "21K views",
            uploadedAt: "1 week ago",
        },
        {
            thumbnail: "https://picsum.photos/seed/vtube4/640/360",
            title: "How I Built My First Production Web App",
            avatar: "https://i.pravatar.cc/150?img=56",
            channelName: "Code Stories",
            views: "34K views",
            uploadedAt: "2 weeks ago",
        },
        {
            thumbnail: "https://picsum.photos/seed/vtube5/640/360",
            title: "JavaScript Async Await Finally",
            avatar: "https://i.pravatar.cc/150?img=68",
            channelName: "JS Simplified",
            views: "17K views",
            uploadedAt: "3 weeks ago",
        },
        {
            thumbnail: "https://picsum.photos/seed/vtube6/640/360",
            title: "What Actually Happens When You Call an API?",
            avatar: "https://i.pravatar.cc/150?img=11",
            channelName: "Web Dev Daily",
            views: "9.7K views",
            uploadedAt: "1 month ago",
        },
        {
            thumbnail: "https://picsum.photos/seed/vtube4/640/360",
            title: "How I Built My First Production Web App",
            avatar: "https://i.pravatar.cc/150?img=56",
            channelName: "Code Stories",
            views: "34K views",
            uploadedAt: "2 weeks ago",
        },
        {
            thumbnail: "https://picsum.photos/seed/vtube5/640/360",
            title: "JavaScript Async Await Finally Explained",
            avatar: "https://i.pravatar.cc/150?img=68",
            channelName: "JS Simplified",
            views: "17K views",
            uploadedAt: "3 weeks ago",
        },
        {
            thumbnail: "https://picsum.photos/seed/vtube6/640/360",
            title: "What Actually Happens When You Call an API?",
            avatar: "https://i.pravatar.cc/150?img=11",
            channelName: "Web Dev Daily",
            views: "9.7K views",
            uploadedAt: "1 month ago",
        },
    ];

    return (
        <main className="p-4">
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((video, index) => (
                    <VideoCard
                        key={index}
                        {...video}
                    />
                ))}
            </div>
        </main>
    );
}

export default Home;