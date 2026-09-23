import { useState, useRef, useEffect } from "react";

import {
    ArrowLeftIcon,
    MagnifyingGlassIcon,
    XIcon,
} from "@phosphor-icons/react";

import { SearchDropdown, VideoCard } from "../components";

function Search() {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);

    const boxRef = useRef(null);

    const searchSuggestions = [
        "React tutorial",
        "Node.js tutorial",
        "MongoDB aggregation",
        "MERN project",
        "JavaScript tutorial",
    ];

    const searchHistory = [
        "React tutorial",
        "MongoDB aggregation",
        "MERN project",
        "Node.js authentication",
    ];

    const filteredSuggestions = searchSuggestions.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function handleSuggestionSelect(suggestion) {
        setSearchQuery(suggestion);
        setSearchFocused(false);
    }

    function handleClear() {
        setSearchQuery("");
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setSearchFocused(false)
            }
        }

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, [])

    return (
        <main className="min-h-screen bg-background">

            {/* ================= SEARCH HEADER ================= */}

            <header
                className="
                    sticky
                    top-0
                    z-50
                    border-b
                    border-border
                    bg-background
                "
            >
                <div
                    className="
                        flex
                        h-16
                        w-full
                        items-center
                        justify-center
                        gap-3
                        px-3
                        sm:px-4
                        lg:px-5
                    "
                >
                    {/* Back button — always at screen left */}
                    <button
                        type="button"
                        aria-label="Go back"
                        onClick={() => window.history.back()}
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
                        <ArrowLeftIcon
                            size={24}
                            weight="regular"
                        />
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
                            {/* input */}
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                autoFocus
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

                            {/* Clear */}
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
                                    <XIcon
                                        size={20}
                                        weight="bold"
                                    />
                                </button>
                            )}

                            {/* Search */}
                            <button
                                type="button"
                                aria-label="Search"
                                onClick={() => {
                                    console.log("Searching:", searchQuery);
                                }}
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
                                <MagnifyingGlassIcon
                                    size={22}
                                    weight="regular"
                                />
                            </button>
                        </div>

                        {/* Suggestions */}
                        {searchFocused && (
                            <SearchDropdown
                                suggestions={
                                    searchQuery
                                        ? filteredSuggestions
                                        : searchHistory
                                }
                                isHistory={!searchQuery}
                                onSelect={handleSuggestionSelect}
                            />
                        )}
                    </div>
                </div>
            </header>

            {/* ================= SEARCH CONTENT ================= */}

            <section
                className="
                    mx-auto
                    w-full
                    px-4
                    py-6
                "
            >
                <div className="flex flex-col gap-6 items-center">

                    <div className="w-full md:max-w-4xl md:ml-11 xl:max-w-5xl xl:ml-12 flex flex-col">
                        <VideoCard
                            thumbnail="https://picsum.photos/seed/search-result/640/360"
                            title="Building a Full Stack Video Platform with MERN"
                            views={1200}
                            channelName="Meet"
                            uploadedAt="2026-08-20"
                            duration="12:00"
                            variant="horizontal"
                        />
                    </div>

                </div>
            </section>

        </main>
    );
}

export default Search;