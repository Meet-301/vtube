import { useEffect, useRef, useState } from "react";
import {
    ThumbsUpIcon,
    ShareNetworkIcon,
    BookmarkSimpleIcon,
    DotsThreeIcon,
    ChatTextIcon,
    PencilSimpleIcon,
    TrashIcon
} from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Loader, LoadingOverlay } from "@mantine/core";
import { formatViews, timeAgo, formatDuration } from "../utils/formatters";
import { useForm } from "react-hook-form";
import {
    CheckCircleIcon,
    WarningCircleIcon
} from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications";
import { SaveToPlaylistModal, VideoPlayer } from "../components";
import { useShare } from "../hooks/useShare.jsx";

function Watch() {
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const [videoData, setVideoData] = useState({});

    const [userData, setUserData] = useState({});
    const [currentUserData, setCurrentUserData] = useState({});

    const [channelData, setChannelData] = useState({});

    const [isSaveOpen, setIsSaveOpen] = useState(false);

    const [commentLoading, setCommentLoading] = useState(true);
    const [commentData, setCommentData] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const [likeLoading, setLikeLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(null);
    const [likeCount, setLikeCount] = useState(null);

    const [notes, setNotes] = useState([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [newNoteDescription, setNewNoteDescription] = useState("");
    const [newNoteTime, setNewNoteTime] = useState(1);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editNoteTitle, setEditNoteTitle] = useState("");
    const [editNoteDescription, setEditNoteDescription] = useState("");

    const videoRef = useRef(null);

    const { register, handleSubmit, reset } = useForm();

    const params = useParams();

    const moreRef = useRef(null);
    const buttonRef = useRef(null);

    const { share } = useShare();

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

    //! fetch comments
    async function fetchComments() {
        try {
            setCommentLoading(true);
            const res = await api.get(`/comments/all/${params.videoId}`);
            setCommentData(res.data?.data || []);
        } catch (error) {
            console.log(`Failed to load the comments ${error}`);
        } finally {
            setCommentLoading(false);
        }
    }

    async function onSubmit(formData) {
        try {
            const res = await api.post(
                `/comments/add/${params.videoId}`,
                {
                    content: formData.comment
                }
            );

            showSuccess(res.data?.message);
            reset();
            await fetchComments();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        }
    }

    //! comment edit function
    function startEdit(comment) {
        setEditingId(comment._id);
        setEditText(comment.content);
    }

    //! comment edit cancel
    function cancelEdit() {
        setEditingId(null);
        setEditText("");
    }

    async function fetchLikeDetails() {
        //! get like status
        const likeStatus = await api.get(`/likes/status/${params.videoId}`);
        setIsLiked(likeStatus.data?.data || null);

        //! get like count
        const countData = await api.get(`/likes/current-video/${params.videoId}`);
        setLikeCount(countData.data?.data || null);
    }

    async function toggleLike() {
        try {
            setLikeLoading(true);
            const res = await api.patch(`/likes/toggle/${params.videoId}`);

            showSuccess(res.data?.message);
            fetchLikeDetails();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLikeLoading(false);
        }
    }

    //! comment update
    async function handleUpdate(commentId) {
        if (!editText.trim()) {
            showError("Comment cannot be empty");
            return;
        }

        try {
            const res = await api.patch(`/comments/${commentId}`, {
                content: editText.trim()
            });

            showSuccess(res.data?.message);
            cancelEdit();
            await fetchComments();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        }
    }

    //! comment delete
    async function handleDelete(commentId) {
        if (!window.confirm("Delete this comment?")) return;

        try {
            const res = await api.delete(`/comments/${commentId}`);

            showSuccess(res.data?.message);
            await fetchComments();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        }
    }

    //! fetch notes (sorted according to timestamp)
    async function fetchNotes() {
        try {
            setNotesLoading(true);
            const res = await api.get(`/video-notes/${params.videoId}`);
            const data = res.data?.data || [];

            setNotes([...data].sort((a, b) => a.timestamp - b.timestamp));
        } catch (error) {
            console.log(`Failed to load the notes ${error}`);
        } finally {
            setNotesLoading(false);
        }
    }

    //! Grab the video timestamp immediately after clicking "Add note"
    function openAddNote() {
        //! minimum 1 second validation
        const time = Math.max(1, Math.floor(videoRef.current?.currentTime || 0));

        setNewNoteTime(time);
        setNewNoteTitle("");
        setNewNoteDescription("");
        setIsAddingNote(true);
    }

    function cancelAddNote() {
        setIsAddingNote(false);
        setNewNoteTitle("");
        setNewNoteDescription("");
    }

    async function handleAddNote() {
        if (!newNoteTitle.trim() || !newNoteDescription.trim()) {
            showError("Title and description both are required");
            return;
        }

        try {
            const res = await api.post(`/video-notes/${params.videoId}`, {
                title: newNoteTitle.trim(),
                description: newNoteDescription.trim(),
                timestamp: newNoteTime,
            });

            showSuccess(res.data?.message || "Note added successfully");
            cancelAddNote();
            await fetchNotes();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        }
    }

    function startEditNote(note) {
        setEditingNoteId(note._id);
        setEditNoteTitle(note.title);
        setEditNoteDescription(note.description);
    }

    function cancelEditNote() {
        setEditingNoteId(null);
        setEditNoteTitle("");
        setEditNoteDescription("");
    }

    async function handleUpdateNote(noteId) {
        if (!editNoteTitle.trim() || !editNoteDescription.trim()) {
            showError("Title and description both are required");
            return;
        }

        try {
            const res = await api.patch(`/video-notes/${noteId}`, {
                title: editNoteTitle.trim(),
                description: editNoteDescription.trim(),
            });

            showSuccess(res.data?.message || "Note updated successfully");
            cancelEditNote();
            await fetchNotes();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        }
    }

    async function handleDeleteNote(noteId) {
        if (!window.confirm("Delete this note?")) return;

        try {
            const res = await api.delete(`/video-notes/${noteId}`);

            showSuccess(res.data?.message || "Note deleted successfully");
            await fetchNotes();
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        }
    }

    //! jump to the specific timestamp of the video by cliking the note
    function seekTo(seconds) {
        if (!videoRef.current) return;

        videoRef.current.currentTime = seconds;
        videoRef.current.play();
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                moreRef.current &&
                !moreRef.current.contains(event.target)
            ) {
                setIsMoreOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    //! fetch channel and video data 
    useEffect(() => {
        async function fetchVideo() {
            try {
                const response = await api.get(`/videos/watch/${params.videoId}`);
                const video = response.data?.data || {};
                setVideoData(video);

                const res = await api.get(`/users/${video.owner}`);
                setUserData(res.data?.data || {});

                const channel = await api.get(`/users/channel/${res.data?.data?.username}`);
                setChannelData(channel.data?.data || {});

                //! fetch comments
                fetchComments();

                //! fetch likes
                fetchLikeDetails();

                //! fetch timestamp notes
                fetchNotes();
            } catch (error) {
                console.log(`Failed to load the video ${error}`);
            } finally {
                setIsLoading(false);
            }
        }

        fetchVideo();
    }, [params.videoId]);

    //! fetch current user
    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                const res = await api.get("/users/current-user");
                setCurrentUserData(res.data?.data || {});
            } catch (error) {
                console.log(`Failed to fetch current user ${error}`);
            }
        }

        fetchCurrentUser();
    }, []);

    //! Handling code of more button's pop-up
    function handleToggleMenu() {
        if (!isMoreOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const estimatedMenuHeight = 100; //! approx height of 2 items

            setOpenUpward(spaceBelow < estimatedMenuHeight);
        }

        setIsMoreOpen((prev) => !prev);
    }

    return (
        <main className="px-4 py-6">
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                loaderProps={{ color: "blue", type: "oval" }}
            />

            <div className="mx-auto w-full max-w-350">

                <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">

                    {/* ================= MAIN CONTENT ================= */}
                    <section className="min-w-0">

                        {/* Video Player */}
                        <div className="aspect-video overflow-hidden rounded-2xl bg-surface">
                            <VideoPlayer
                                key={videoData.videoFile}
                                videoRef={videoRef}
                                src={videoData.videoFile}
                                poster={videoData.thumbnail}
                                autoPlay
                            />
                        </div>

                        {/* Video Title */}
                        <h1 className="mt-5 text-2xl font-semibold leading-8 text-text-primary">
                            {videoData.title}
                        </h1>

                        {/* Views + Date */}
                        <p className="mt-2 text-base text-text-secondary">
                            {formatViews(videoData.views)} • {timeAgo(videoData.createdAt)}
                        </p>

                        {/* ================= CHANNEL + ACTIONS ================= */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                            {/* Channel */}
                            <div className="flex min-w-0 items-center gap-3">

                                <img
                                    src={userData.avatar}
                                    alt="Backend Lab"
                                    className="
                                        h-12
                                        w-12
                                        shrink-0
                                        rounded-full
                                        object-cover
                                    "
                                />

                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-text-primary">
                                        {userData.fullName}
                                    </p>

                                    <p className="text-sm text-text-secondary">
                                        {channelData.subscribersCount > 0 ? channelData.subscribersCount : "No "} subscribers
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="
                                        ml-2
                                        shrink-0
                                        rounded-full
                                        bg-primary
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition-all
                                        hover:bg-primary-hover
                                        active:bg-primary-hover
                                        active:scale-95
                                    "
                                >
                                    Subscribe
                                </button>

                            </div>

                            {/* ================= ACTIONS ================= */}
                            <div className="flex shrink-0 items-center gap-2">

                                {/* Like + Count */}
                                {likeLoading ?
                                    <Loader
                                        color="blue"
                                        size={21}
                                    />
                                    :
                                    <button
                                        type="button"
                                        onClick={() => toggleLike()}
                                        aria-label="Like video"
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            bg-surface
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-medium
                                            text-text-primary
                                            transition-all
                                            duration-200
                                            hover:bg-surface-elevated
                                            active:bg-surface-elevated
                                            active:scale-95
                                        "
                                    >
                                        <ThumbsUpIcon
                                            size={21}
                                            weight={isLiked ? "fill" : "regular"}
                                        />

                                        <span>
                                            {likeCount || 0}
                                        </span>
                                    </button>
                                }

                                {/* More */}
                                <div
                                    ref={moreRef}
                                    className="relative"
                                >
                                    <button
                                        ref={buttonRef}
                                        type="button"
                                        aria-label="More actions"
                                        aria-expanded={isMoreOpen}
                                        onClick={handleToggleMenu}
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-surface
                                            text-text-primary
                                            transition-all
                                            duration-200
                                            hover:bg-surface-elevated
                                            active:bg-surface-elevated
                                            active:scale-95
                                        "
                                    >
                                        <DotsThreeIcon
                                            size={24}
                                            weight="bold"
                                        />
                                    </button>

                                    {/* More Popup */}
                                    {isMoreOpen && (
                                        <div
                                            className={`
                                                absolute
                                                right-0
                                                ${openUpward ? "bottom-full" : "top-full"}
                                                z-30
                                                mt-2
                                                w-48
                                                overflow-hidden
                                                rounded-2xl
                                                border
                                                border-border
                                                bg-surface
                                                p-1.5
                                                shadow-2xl
                                            `}
                                        >

                                            {/* Share */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsMoreOpen(false);
                                                    share({
                                                        path: `/watch/${params.videoId}`,
                                                        title: videoData.title
                                                    })
                                                }}
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
                                                    transition-transform
                                                    duration-150
                                                    hover:bg-surface-elevated
                                                    active:bg-surface-elevated
                                                    active:scale-95
                                                "
                                            >
                                                <ShareNetworkIcon
                                                    size={21}
                                                    weight="regular"
                                                />

                                                <span>
                                                    Share
                                                </span>
                                            </button>

                                            {/* Save */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsMoreOpen(false);
                                                    setIsSaveOpen(true);
                                                }}
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
                                                    transition-transform
                                                    duration-150
                                                    hover:bg-surface-elevated
                                                    active:bg-surface-elevated
                                                    active:scale-95
                                                "
                                            >
                                                <BookmarkSimpleIcon
                                                    size={21}
                                                    weight="regular"
                                                />

                                                <span>
                                                    Save
                                                </span>
                                            </button>

                                        </div>
                                    )}
                                </div>

                            </div>

                        </div>

                        {/* Description */}
                        <div className="mt-6 rounded-2xl bg-surface p-5">

                            <p className="text-sm font-semibold text-text-primary">
                                {videoData.views > 0 ? videoData.views : "No "} views • {timeAgo(videoData.createdAt)}
                            </p>

                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-text-secondary">
                                {videoData.description ? videoData.description : "No description has been added in this video."}
                            </p>

                        </div>

                    </section>

                    {/* ================= TIMESTAMP NOTES ================= */}
                    <aside className="min-w-0">

                        <div className="sticky top-24 rounded-2xl bg-surface p-5">

                            <div className="flex items-center justify-between gap-3">

                                <h2 className="text-xl font-semibold text-text-primary">
                                    Timestamp Notes
                                </h2>

                                <button
                                    type="button"
                                    onClick={openAddNote}
                                    className="
                                        shrink-0
                                        rounded-full
                                        bg-primary
                                        px-4
                                        py-2
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition-all
                                        hover:bg-primary-hover
                                        active:bg-primary-hover
                                        active:scale-95
                                    "
                                >
                                    + Add Note
                                </button>

                            </div>

                            <div className="my-4 border-t border-border" />

                            {/* Add note form */}
                            {isAddingNote && (
                                <div className="mb-4 rounded-xl bg-background p-3">

                                    <span className="text-sm font-semibold text-primary">
                                        {formatDuration(newNoteTime)}
                                    </span>

                                    <input
                                        type="text"
                                        value={newNoteTitle}
                                        onChange={(e) => setNewNoteTitle(e.target.value)}
                                        placeholder="Note title"
                                        autoFocus
                                        className="mt-2 w-full border-b border-primary bg-transparent px-1 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted"
                                    />

                                    <textarea
                                        rows={3}
                                        value={newNoteDescription}
                                        onChange={(e) => setNewNoteDescription(e.target.value)}
                                        placeholder="Description"
                                        className="mt-2 w-full resize-none border-b border-border bg-transparent px-1 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary"
                                    />

                                    <div className="mt-3 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={cancelAddNote}
                                            className="rounded-full bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-primary transition-all active:scale-95"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleAddNote}
                                            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-95"
                                        >
                                            Save
                                        </button>
                                    </div>

                                </div>
                            )}

                            {/* Notes list */}
                            <div className="relative min-h-16 space-y-3">

                                {notesLoading ? (
                                    <LoadingOverlay
                                        visible={notesLoading}
                                        zIndex={10}
                                        overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                                        loaderProps={{ color: "blue", type: "oval" }}
                                    />
                                ) : notes.length === 0 ? (
                                    <p className="py-6 text-center text-sm text-text-secondary">
                                        No notes yet. Pause the video and add one.
                                    </p>
                                ) : (
                                    notes.map((note) => (
                                        <div
                                            key={note._id}
                                            className="rounded-xl p-3 transition-colors hover:bg-surface-elevated"
                                        >

                                            <div className="flex items-center justify-between gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() => seekTo(note.timestamp)}
                                                    className="text-sm font-semibold text-primary active:scale-95"
                                                >
                                                    {formatDuration(note.timestamp)}
                                                </button>

                                                {editingNoteId !== note._id && (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            aria-label="Edit note"
                                                            onClick={() => startEditNote(note)}
                                                            className="rounded-full p-2 text-text-secondary transition-all hover:bg-surface active:scale-95"
                                                        >
                                                            <PencilSimpleIcon size={16} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            aria-label="Delete note"
                                                            onClick={() => handleDeleteNote(note._id)}
                                                            className="rounded-full p-2 text-text-secondary transition-all hover:bg-surface active:scale-95"
                                                        >
                                                            <TrashIcon size={16} />
                                                        </button>
                                                    </div>
                                                )}

                                            </div>

                                            {editingNoteId === note._id ? (
                                                <div className="mt-1">
                                                    <input
                                                        type="text"
                                                        value={editNoteTitle}
                                                        onChange={(e) => setEditNoteTitle(e.target.value)}
                                                        autoFocus
                                                        className="w-full border-b border-primary bg-transparent px-1 py-2 text-sm text-text-primary outline-none"
                                                    />

                                                    <textarea
                                                        rows={3}
                                                        value={editNoteDescription}
                                                        onChange={(e) => setEditNoteDescription(e.target.value)}
                                                        className="mt-2 w-full resize-none border-b border-border bg-transparent px-1 py-2 text-sm text-text-primary outline-none focus:border-primary"
                                                    />

                                                    <div className="mt-3 flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={cancelEditNote}
                                                            className="rounded-full bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition-all active:scale-95"
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateNote(note._id)}
                                                            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-95"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="mt-1 text-sm font-semibold text-text-primary">
                                                        {note.title}
                                                    </p>

                                                    <p className="mt-1 whitespace-pre-line text-sm leading-5 text-text-secondary">
                                                        {note.description}
                                                    </p>
                                                </>
                                            )}

                                        </div>
                                    ))
                                )}

                            </div>

                        </div>
                    </aside>

                    {/* ================= COMMENTS ================= */}
                    <section className="min-w-0 xl:col-start-1">

                        {/* Comments Header */}
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold text-text-primary">
                                {commentData.length || "No "} Comments
                            </h2>
                        </div>


                        {/* Add Comment */}
                        <div className="mt-5 rounded-2xl bg-surface p-5">

                            <div className="flex gap-3">

                                {/* Current User Avatar */}
                                <img
                                    src={currentUserData.avatar}
                                    alt="Your profile"
                                    className="
                                        h-10
                                        w-10
                                        shrink-0
                                        rounded-full
                                        object-cover
                                    "
                                />

                                {/* Input + Button */}
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="min-w-0 flex-1"
                                >

                                    <input
                                        type="text"
                                        {...register("comment", { required: "Please add some data" })}
                                        placeholder="Add a comment..."
                                        className="
                                            w-full
                                            border-b
                                            border-border
                                            bg-transparent
                                            px-1
                                            py-2
                                            text-sm
                                            text-text-primary
                                            outline-none
                                            placeholder:text-text-muted
                                            transition-colors
                                            focus:border-primary
                                        "
                                    />

                                    <div className="mt-3 flex justify-end">

                                        <button
                                            type="submit"
                                            className="
                                                rounded-full
                                                bg-primary
                                                px-5
                                                py-2.5
                                                text-sm
                                                font-semibold
                                                text-white
                                                transition-all
                                                hover:bg-primary-hover
                                                active:bg-primary-hover
                                                active:scale-95
                                            "
                                        >
                                            Comment
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>


                        {/* Comments List */}
                        <div className="relative mt-6 min-h-16 space-y-6">

                            {commentLoading ? (
                                <LoadingOverlay
                                    visible={commentLoading}
                                    zIndex={10}
                                    overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                                    loaderProps={{ color: "blue", type: "oval" }}
                                />
                            ) : (
                                commentData.map((comment) => (
                                    <div className="flex gap-3" key={comment._id}>

                                        <img
                                            src={comment.owner?.avatar}
                                            alt={comment.owner?.username}
                                            className="
                                                h-10
                                                w-10
                                                shrink-0
                                                rounded-full
                                                object-cover
                                            "
                                        />

                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <p className="text-sm font-semibold text-text-primary">
                                                    {comment.owner?.username}
                                                </p>

                                                <span className="text-xs text-text-muted">
                                                    {timeAgo(comment.createdAt)}
                                                </span>

                                                {/* Edit + Delete: sirf comment ke owner ko */}
                                                {comment.owner?._id === currentUserData._id && editingId !== comment._id && (
                                                    <div className="ml-auto flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            aria-label="Edit comment"
                                                            onClick={() => startEdit(comment)}
                                                            className="rounded-full p-2 text-text-secondary transition-all hover:bg-surface-elevated active:scale-95"
                                                        >
                                                            <PencilSimpleIcon size={18} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            aria-label="Delete comment"
                                                            onClick={() => handleDelete(comment._id)}
                                                            className="rounded-full p-2 text-text-secondary transition-all hover:bg-surface-elevated active:scale-95"
                                                        >
                                                            <TrashIcon size={18} />
                                                        </button>
                                                    </div>
                                                )}

                                            </div>

                                            {editingId === comment._id ? (
                                                <div className="mt-1">
                                                    <input
                                                        type="text"
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        autoFocus
                                                        className="w-full border-b border-primary bg-transparent px-1 py-2 text-sm text-text-primary outline-none"
                                                    />

                                                    <div className="mt-3 flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={cancelEdit}
                                                            className="rounded-full bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-primary transition-all active:scale-95"
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdate(comment._id)}
                                                            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-95"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="mt-1 text-sm leading-6 text-text-secondary">
                                                    {comment.content}
                                                </p>
                                            )}

                                        </div>

                                    </div>
                                ))
                            )}

                        </div>

                    </section>

                </div>

            </div>

            {/* Save Modal */}

            <SaveToPlaylistModal
                isOpen={isSaveOpen}
                onClose={() => setIsSaveOpen(false)}
                videoId={params.videoId}
            />
        </main>
    );
}

export default Watch;