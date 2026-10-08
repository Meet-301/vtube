import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeftIcon,
    MagnifyingGlassIcon,
    XIcon,
    ClockCounterClockwiseIcon,
    QueueIcon,
    UserIcon,
    VideoCameraIcon,
    SlidersHorizontalIcon,
    PlayCircleIcon,
    ListIcon
} from "@phosphor-icons/react";
import { Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { SearchDropdown, VideoCard } from "../components";
import { useSearchHistory } from "../hooks/useSearchHistory";
import { useSaveToPlaylist } from "../context/SaveToPlaylistContext";
import { useShare } from "../hooks/useShare";
import api from "../api/axios";
import { formatViews } from "../utils/formatters";

function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const queryParam = searchParams.get("query") || "";
    const typeParam = searchParams.get("type") || "video";
    const sortByParam = searchParams.get("sortBy") || "latest";
    const pageParam = parseInt(searchParams.get("page") || "1", 10);

    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [searchFocused, setSearchFocused] = useState(false);

    const [results, setResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(pageParam);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const boxRef = useRef(null);
    const inputRef = useRef(null);

    const { searchHistory, removeFromHistory, fetchHistory } = useSearchHistory();
    const { openSave } = useSaveToPlaylist();
    const { share } = useShare();

    // Sync input with queryParam on URL change
    useEffect(() => {
        setSearchQuery(queryParam);
    }, [queryParam]);

    // Perform API search
    const performSearch = useCallback(
        async (query, type, sortBy, page) => {
            const trimmed = query?.trim();
            if (!trimmed) {
                setResults([]);
                setTotalResults(0);
                setTotalPages(0);
                setHasSearched(false);
                return;
            }

            try {
                setIsLoading(true);
                setHasSearched(true);

                const response = await api.get("/search", {
                    params: {
                        query: trimmed,
                        type,
                        sortBy,
                        page,
                        limit: 12,
                    },
                });

                const data = response.data?.data;
                setResults(data?.results || []);
                setTotalResults(data?.totalResults || 0);
                setTotalPages(data?.totalPages || 0);
                setCurrentPage(data?.currentPage || page);

                // Refresh search history in background
                fetchHistory();
            } catch (error) {
                console.error("Search failed:", error);
                notifications.show({
                    title: error?.response?.data?.message || "Failed to fetch search results",
                    color: "red",
                });
                setResults([]);
                setTotalResults(0);
                setTotalPages(0);
            } finally {
                setIsLoading(false);
            }
        },
        [fetchHistory]
    );

    // Fetch whenever URL params change
    useEffect(() => {
        if (queryParam) {
            performSearch(queryParam, typeParam, sortByParam, pageParam);
        } else {
            setResults([]);
            setTotalResults(0);
            setTotalPages(0);
            setHasSearched(false);
        }
    }, [queryParam, typeParam, sortByParam, pageParam, performSearch]);

    // Handle user submitting search query
    function handleExecuteSearch(customQuery) {
        const q = (customQuery !== undefined ? customQuery : searchQuery).trim();
        if (!q) return;

        setSearchFocused(false);
        setSearchParams({
            query: q,
            type: typeParam,
            sortBy: sortByParam,
            page: "1",
        });
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleExecuteSearch();
        }
    }

    function handleSuggestionSelect(suggestion) {
        setSearchQuery(suggestion);
        handleExecuteSearch(suggestion);
    }

    function handleClear() {
        setSearchQuery("");
        inputRef.current?.focus();
    }

    function handleBack() {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    }

    function handleTypeChange(newType) {
        setSearchParams({
            query: queryParam,
            type: newType,
            sortBy: sortByParam,
            page: "1",
        });
    }

    function handleSortChange(newSort) {
        setSearchParams({
            query: queryParam,
            type: typeParam,
            sortBy: newSort,
            page: "1",
        });
    }

    function handlePageChange(newPage) {
        setSearchParams({
            query: queryParam,
            type: typeParam,
            sortBy: sortByParam,
            page: String(newPage),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setSearchFocused(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Filtered search history suggestions
    const filteredSuggestions = searchQuery.trim()
        ? searchHistory.filter((item) =>
              item.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : searchHistory;

    return (
        <main className="min-h-screen bg-background">
            {/* ================= SEARCH HEADER ================= */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
                <div className="flex h-16 w-full items-center justify-center gap-3 px-3 sm:px-4 lg:px-5">
                    {/* Back button */}
                    <button
                        type="button"
                        aria-label="Go back"
                        onClick={handleBack}
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-text-primary
                            transition-all
                            duration-200
                            hover:bg-surface-elevated
                            active:bg-surface-elevated
                            active:scale-95
                        "
                    >
                        <ArrowLeftIcon size={24} weight="regular" />
                    </button>

                    {/* Search box */}
                    <div
                        className="
                            relative
                            min-w-0
                            flex-1
                            lg:max-w-4xl
                            xl:max-w-5xl
                        "
                        ref={boxRef}
                    >
                        <div
                            className="
                                group
                                relative
                                flex
                                h-11
                                w-full
                                items-center
                                rounded-full
                                border
                                border-border
                                bg-surface
                                transition-all
                                duration-200
                                focus-within:border-primary
                                focus-within:ring-2
                                focus-within:ring-primary/20
                            "
                        >
                            {/* Input */}
                            <input
                                type="text"
                                ref={inputRef}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    setSearchFocused(true);
                                    fetchHistory();
                                }}
                                onKeyDown={handleKeyDown}
                                autoFocus={!queryParam}
                                placeholder="Search"
                                className="
                                    h-full
                                    min-w-0
                                    flex-1
                                    rounded-full
                                    bg-transparent
                                    px-5
                                    pr-24
                                    text-sm
                                    text-text-primary
                                    outline-none
                                    placeholder:text-text-muted
                                "
                            />

                            {/* Clear button */}
                            {searchQuery && (
                                <button
                                    type="button"
                                    aria-label="Clear search"
                                    onClick={handleClear}
                                    className="
                                        absolute
                                        right-11
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-text-secondary
                                        transition-all
                                        duration-200
                                        hover:bg-surface-elevated
                                        active:bg-surface-elevated
                                        hover:text-text-primary
                                    "
                                >
                                    <XIcon size={20} weight="bold" />
                                </button>
                            )}

                            {/* Submit Search button */}
                            <button
                                type="button"
                                aria-label="Search"
                                onClick={() => handleExecuteSearch()}
                                className="
                                    absolute
                                    right-1
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-text-primary
                                    transition-all
                                    duration-200
                                    hover:bg-surface-elevated
                                    active:bg-surface-elevated
                                    active:scale-95
                                "
                            >
                                <MagnifyingGlassIcon size={22} weight="regular" />
                            </button>
                        </div>

                        {/* Search Suggestions Dropdown */}
                        {searchFocused && (
                            <SearchDropdown
                                suggestions={filteredSuggestions}
                                isHistory={true}
                                onSelect={handleSuggestionSelect}
                                onRemove={(item) => removeFromHistory(item)}
                            />
                        )}
                    </div>
                </div>

                {/* ================= FILTER TABS ================= */}
                {queryParam && (
                    <div className="border-t border-border/50 bg-background/80 px-4 py-2.5">
                        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
                            {/* Type filters */}
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                                {[
                                    { id: "video", label: "Videos", icon: VideoCameraIcon },
                                    { id: "channel", label: "Channels", icon: UserIcon },
                                    { id: "playlist", label: "Playlists", icon: QueueIcon },
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = typeParam === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => handleTypeChange(tab.id)}
                                            className={`
                                                flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-150
                                                ${
                                                    isActive
                                                        ? "bg-text-primary text-background shadow-sm"
                                                        : "bg-surface text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                                                }
                                            `}
                                        >
                                            <Icon size={16} weight={isActive ? "fill" : "regular"} />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Sort filters for video */}
                            {typeParam === "video" && (
                                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                                    <span className="flex items-center gap-1 text-xs text-text-muted">
                                        <SlidersHorizontalIcon size={14} />
                                        Sort:
                                    </span>
                                    {[
                                        { id: "latest", label: "Latest" },
                                        { id: "views", label: "Views" },
                                        { id: "mostliked", label: "Liked" },
                                        { id: "oldest", label: "Oldest" },
                                    ].map((sort) => {
                                        const isActive = sortByParam === sort.id;
                                        return (
                                            <button
                                                key={sort.id}
                                                type="button"
                                                onClick={() => handleSortChange(sort.id)}
                                                className={`
                                                    rounded-full px-3 py-1 text-xs font-medium transition-all duration-150
                                                    ${
                                                        isActive
                                                            ? "bg-primary text-white"
                                                            : "bg-surface text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                                                    }
                                                `}
                                            >
                                                {sort.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* ================= SEARCH CONTENT ================= */}
            <section className="mx-auto w-full max-w-5xl px-4 py-6">
                {/* 1. LOADING STATE */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <Loader color="blue" size={36} type="oval" />
                        <p className="mt-4 text-sm text-text-muted">Searching for "{queryParam}"...</p>
                    </div>
                )}

                {/* 2. INITIAL STATE (No query entered yet) */}
                {!isLoading && !queryParam && (
                    <div className="mx-auto max-w-xl py-12 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-surface">
                            <MagnifyingGlassIcon size={40} className="text-text-muted" />
                        </div>
                        <h2 className="mt-4 text-xl font-semibold text-text-primary">Search VTube</h2>
                        <p className="mt-1 text-sm text-text-muted">
                            Search for your favorite videos, creators, and playlists.
                        </p>

                        {/* Recent searches chips */}
                        {searchHistory.length > 0 && (
                            <div className="mt-8 text-left">
                                <div className="flex items-center justify-between pb-3 border-b border-border">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Recent Searches
                                    </h3>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {searchHistory.map((item) => (
                                        <div
                                            key={item}
                                            className="
                                                group flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-primary
                                                transition-all hover:border-primary/40 hover:bg-surface-elevated
                                            "
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleSuggestionSelect(item)}
                                                className="flex items-center gap-1.5 hover:text-primary"
                                            >
                                                <ClockCounterClockwiseIcon size={14} className="text-text-muted" />
                                                <span>{item}</span>
                                            </button>
                                            <button
                                                type="button"
                                                title="Remove from history"
                                                aria-label={`Remove ${item}`}
                                                onClick={() => removeFromHistory(item)}
                                                className="text-text-muted hover:text-text-primary"
                                            >
                                                <XIcon size={12} weight="bold" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. EMPTY RESULTS STATE */}
                {!isLoading && hasSearched && results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface">
                            <MagnifyingGlassIcon size={40} className="text-text-muted" />
                        </div>
                        <h2 className="mt-5 text-lg font-semibold text-text-primary">
                            No results found for "{queryParam}"
                        </h2>
                        <p className="mt-1 max-w-sm text-sm text-text-muted">
                            Try searching with different keywords, check for typos, or change your search filter.
                        </p>
                    </div>
                )}

                {/* 4. RESULTS LIST */}
                {!isLoading && results.length > 0 && (
                    <div className="flex flex-col gap-6">
                        {/* Summary counter */}
                        <div className="text-xs text-text-muted">
                            About {totalResults} {totalResults === 1 ? "result" : "results"} for "{queryParam}"
                        </div>

                        {/* --- VIDEOS LIST --- */}
                        {typeParam === "video" && (
                            <div className="flex flex-col gap-6">
                                {results.map((video) => (
                                    <Link key={video._id} to={`/watch/${video._id}`} className="block w-full">
                                        <VideoCard
                                            thumbnail={video.thumbnail}
                                            title={video.title}
                                            avatar={video.owner?.avatar}
                                            channelName={video.owner?.fullName}
                                            views={video.views}
                                            createdAt={video.createdAt}
                                            duration={video.duration}
                                            variant="horizontal"
                                            editButton={false}
                                            deleteButton={false}
                                            onSaveClick={() => openSave(video._id)}
                                            onShareClick={() =>
                                                share({
                                                    path: `/watch/${video._id}`,
                                                    title: video.title,
                                                })
                                            }
                                        />
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* --- CHANNELS LIST --- */}
                        {typeParam === "channel" && (
                            <div className="flex flex-col divide-y divide-border/60">
                                {results.map((channel) => (
                                    <div
                                        key={channel._id}
                                        className="flex items-center justify-between gap-4 py-5 transition-colors hover:bg-surface/40 px-3 rounded-2xl"
                                    >
                                        <Link
                                            to={`/channel/${channel.username}`}
                                            className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1"
                                        >
                                            <img
                                                src={channel.avatar || "https://picsum.photos/seed/user/100/100"}
                                                alt={channel.fullName}
                                                className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-full object-cover border border-border"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-base sm:text-lg font-semibold text-text-primary hover:text-primary">
                                                    {channel.fullName}
                                                </h3>
                                                <p className="truncate text-xs sm:text-sm text-text-secondary">
                                                    @{channel.username}
                                                </p>
                                                <p className="mt-1 text-xs text-text-muted">
                                                    {formatViews(channel.subscribersCount || 0)} subscribers
                                                </p>
                                            </div>
                                        </Link>

                                        <Link
                                            to={`/channel/${channel.username}`}
                                            className="
                                                shrink-0 rounded-full bg-surface-elevated px-4 py-2 text-xs sm:text-sm font-medium text-text-primary
                                                transition-all hover:bg-primary hover:text-white active:scale-95
                                            "
                                        >
                                            View Channel
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* --- PLAYLISTS LIST --- */}
                        {typeParam === "playlist" && (
                            <div className="flex flex-col gap-6">
                                {results.map((playlist) => (
                                    <Link
                                        key={playlist._id}
                                        to={`/playlists/${playlist._id}`}
                                        className="group flex flex-col gap-4 sm:flex-row sm:gap-5 w-full rounded-2xl p-2 transition-all hover:bg-surface/50"
                                    >
                                        {/* Thumbnail & overlay */}
                                        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-surface sm:w-72 md:w-80">
                                            {playlist.playlistCover ? (
                                                <img
                                                    src={playlist.playlistCover}
                                                    alt={playlist.name}
                                                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <ListIcon size={40} className="text-text-muted" />
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
                                                    {playlist.videoCount ?? playlist.videos?.length ?? 0}{" "}
                                                    {(playlist.videoCount ?? playlist.videos?.length ?? 0) === 1 ? "video" : "videos"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Playlist Info */}
                                        <div className="flex flex-1 flex-col justify-center min-w-0">
                                            <h3 className="line-clamp-2 text-base sm:text-lg font-semibold text-text-primary group-hover:text-primary">
                                                {playlist.name}
                                            </h3>
                                            {playlist.owner?.fullName && (
                                                <div className="mt-1 flex items-center gap-2">
                                                    {playlist.owner?.avatar && (
                                                        <img
                                                            src={playlist.owner.avatar}
                                                            alt={playlist.owner.fullName}
                                                            className="h-5 w-5 rounded-full object-cover"
                                                        />
                                                    )}
                                                    <p className="text-xs sm:text-sm text-text-secondary">
                                                        {playlist.owner.fullName}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* --- PAGINATION --- */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2 border-t border-border pt-6">
                                <button
                                    type="button"
                                    disabled={currentPage <= 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="rounded-full border border-border px-4 py-2 text-xs sm:text-sm font-medium text-text-primary transition-all hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 text-xs sm:text-sm text-text-muted">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="rounded-full border border-border px-4 py-2 text-xs sm:text-sm font-medium text-text-primary transition-all hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Search;