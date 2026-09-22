import { useState, useRef, useEffect } from "react";

import {
    ArrowLeftIcon,
    MagnifyingGlassIcon,
    XIcon,
} from "@phosphor-icons/react";

import { SearchDropdown } from "../components";

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
                        mx-auto
                        flex
                        h-16
                        w-full
                        max-w-3xl
                        items-center
                        gap-2
                        px-3
                        sm:px-4
                    "
                >

                    {/* Back button */}

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


                    {/* ================= SEARCH BOX ================= */}

                    <div className="relative min-w-0 flex-1">

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
                                        active:scale-95
                                    "
                                >
                                    <XIcon
                                        size={20}
                                        weight="bold"
                                    />
                                </button>
                            )}

                            {/* Search Button */}

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

                        {/* ================= SUGGESTIONS ================= */}

                        {searchQuery && filteredSuggestions.length > 0 && searchFocused && (
                            <div ref={boxRef}>
                                <SearchDropdown
                                    suggestions={filteredSuggestions}
                                    onSelect={handleSuggestionSelect}
                                />
                            </div>
                        )}

                    </div>

                </div>

            </header>


            {/* ================= SEARCH CONTENT ================= */}

            <section
                className="
                    mx-auto
                    w-full
                    max-w-3xl
                    px-4
                    py-6
                "
            >

                {/* Abhi intentionally empty.
                    Baad mein search results yaha aayenge. */}

            </section>

        </main>
    );
}

export default Search;