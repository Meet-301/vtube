import {
    ListIcon,
    MagnifyingGlassIcon,
    XIcon
} from "@phosphor-icons/react";

import {
    SearchButton,
    NotificationMenu,
    ProfileMenu,
    UploadButton
} from "../components";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SearchDropdown from "./SearchDropDown";
import { useSearchHistory } from "../hooks/useSearchHistory";

function Header({ onMenuClick }) {

    const navigate = useNavigate();
    const { searchHistory, removeFromHistory, fetchHistory } = useSearchHistory();

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const boxRef = useRef(null);
    const inputRef = useRef(null);

    const filteredSuggestions = searchQuery.trim()
        ? searchHistory.filter((item) =>
              item.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : searchHistory;

    function handleSearch(term) {
        const q = (term !== undefined ? term : searchQuery).trim();
        if (!q) return;
        setIsSearchFocused(false);
        navigate(`/search?query=${encodeURIComponent(q)}`);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setIsSearchFocused(false)
            }
        }

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, [])

    return (
        <header className="h-12 w-full md:h-16">

            <div className="flex h-full w-full items-center px-2 sm:px-3 md:px-4">

                {/* ================= LEFT SECTION ================= */}
                <div className="flex shrink-0 items-center lg:ml-1.5 gap-2 sm:gap-3">

                    {/* Menu - Mobile & Tablet */}
                    <button
                        type="button"
                        aria-label="Open menu"
                        title="Menu"
                        onClick={onMenuClick}
                        className="
                            flex
                            h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12
                            shrink-0
                            items-center justify-center
                            rounded-full
                            text-text-primary
                            transition-all duration-200
                            hover:bg-surface-elevated
                            active:bg-surface-elevated
                            active:scale-95
                        "
                    >
                        <ListIcon
                            size={24}
                            weight="regular"
                            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                        />
                    </button>

                    {/* Brand */}
                    <Link
                        to="/"
                        className="flex items-center rounded-lg"
                        title="Home"
                    >
                        <img
                            src="/Vtube logo.png"
                            alt="VTube"
                            className="
                                h-9 w-9
                                sm:h-11 sm:w-11
                                md:h-13 md:w-13
                                object-contain shrink-0
                            "
                        />

                        <span
                            className="
                                brand-font
                                -ml-1
                                hidden
                                sm:inline-block
                                text-xl
                                sm:text-2xl
                                md:text-3xl
                                tracking-tight
                                text-text-primary
                            "
                        >
                            VTUBE
                        </span>
                    </Link>

                </div>

                {/* ================= TABLET SEARCH ================= */}

                <div
                    className="
                        hidden md:flex lg:hidden
                        flex-1 mt-1
                        items-center
                        justify-center
                        px-4
                    "
                >
                    <Link
                        to="/search"
                        className="
                            block
                            w-full
                            max-w-lg
                        "
                    >
                        <div
                            className="
                                flex
                                h-12
                                w-full
                                items-center
                                rounded-full
                                border
                                border-primary/10
                                bg-surface
                                px-5
                                text-sm
                                text-text-muted
                                transition-all
                                duration-200
                                hover:border-primary/20
                                active:scale-[0.99]
                            "
                        >

                            <MagnifyingGlassIcon
                                size={21}
                                weight="regular"
                                className="mr-3 shrink-0"
                            />
                            
                            <span>
                                Search
                            </span>
                        </div>
                    </Link>
                </div>

                {/* ================= DESKTOP SEARCH ================= */}

                <div
                    className="
                        hidden
                        lg:flex
                        flex-1
                        items-center
                        justify-center
                        gap-2.5
                        px-6
                    "
                >
                    <div className="relative w-full max-w-2xl" ref={boxRef}>

                        {/* Search input */}
                        <div className="group relative">

                            <input
                                type="text"
                                ref={inputRef}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                }}
                                onFocus={() => {
                                    setIsSearchFocused(true);
                                    fetchHistory();
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search"
                                className="
                                    h-14
                                    w-full
                                    rounded-full
                                    border
                                    border-primary/10
                                    bg-surface
                                    px-5
                                    pr-14
                                    mt-2
                                    text-base
                                    text-text-primary
                                    outline-none
                                    placeholder:text-text-muted
                                    transition-all
                                    duration-200
                                    focus:border-primary
                                    focus:ring-2
                                    focus:ring-primary/20
                                "
                            />

                            {searchQuery &&
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        inputRef.current?.focus();
                                    }}
                                    aria-label="Clear"
                                    className={`
                                    absolute right-11
                                    top-9
                                    flex h-10 w-10
                                    -translate-y-1/2
                                    items-center justify-center
                                    rounded-full
                                    text-text-secondary
                                    transition-all duration-200
                                    hover:bg-surface-elevated
                                    active:bg-surface-elevated
                                    hover:text-text-primary`}
                                >
                                    <XIcon size={24} weight="regular" />
                                </button>
                            }


                            <SearchButton onClick={() => handleSearch()} classes="mt-1" />

                        </div>

                        {/* Search dropdown */}
                        {isSearchFocused && (
                            <SearchDropdown
                                suggestions={filteredSuggestions}
                                isHistory={true}
                                onSelect={(item) => {
                                    setSearchQuery(item);
                                    handleSearch(item);
                                }}
                                onRemove={(item) => removeFromHistory(item)}
                            />
                        )}

                    </div>

                    {/* Upload */}
                    <UploadButton
                        size={24}
                        iconClasses="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                        classes="
                            hidden
                            lg:flex
                            h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-surface-elevated
                            text-text-primary
                            transition-all
                            duration-200
                            hover:bg-surface
                            active:bg-surface
                            active:scale-95
                        "
                    />
                </div>

                {/* ================= RIGHT SECTION ================= */}
                <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">

                    <UploadButton
                        size={24}
                        iconClasses="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                        classes="
                            lg:hidden flex
                            h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12
                            shrink-0
                            items-center justify-center
                            rounded-full
                            text-text-primary
                            transition-all duration-200
                            hover:bg-surface-elevated
                            active:bg-surface-elevated
                            active:scale-95
                        "
                    />

                    {/* Mobile Search */}
                    <Link
                        to="/search"
                        aria-label="Search"
                        className="
                            flex md:hidden
                            h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12
                            shrink-0
                            items-center justify-center
                            rounded-full
                            text-text-primary
                            transition-all duration-200
                            hover:bg-surface-elevated
                            active:bg-surface-elevated
                            active:scale-95
                        "
                    >
                        <MagnifyingGlassIcon
                            size={24}
                            weight="regular"
                            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                        />
                    </Link>

                    {/* Notifications */}
                    <NotificationMenu />

                    {/* Profile menu */}
                    <ProfileMenu />
                </div>

            </div>

        </header>
    );
}

export default Header;