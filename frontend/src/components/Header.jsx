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

import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SearchDropdown from "./SearchDropDown";

function Header({ onMenuClick }) {

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const boxRef = useRef(null);
    const inputRef = useRef(null);

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
                <div className="flex shrink-0 items-center lg:ml-1.5 gap-3">

                    {/* Menu - Mobile & Tablet */}
                    <button
                        type="button"
                        aria-label="Open menu"
                        title="More"
                        onClick={onMenuClick}
                        className="
                            group relative
                            flex
                            h-10 w-10
                            items-center justify-center
                            rounded-full
                            text-text-primary
                            active:bg-surface
                            active:scale-95
                        "
                    >
                        <span
                            className="
                                pointer-events-none
                                absolute
                                -inset-1
                                rounded-full
                                bg-surface-elevated
                                opacity-0
                                transition-opacity duration-200
                                group-hover:opacity-100
                            "
                        />

                        <ListIcon
                            size={32}
                            weight="regular"
                            className="relative z-10"
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
                                h-12 w-12
                                sm:h-12 sm:w-12
                                md:h-14 md:w-14
                                object-contain
                            "
                        />

                        <span
                            className="
                                brand-font
                                -ml-2
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
                                onFocus={() => setIsSearchFocused(true)}
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


                            <SearchButton classes="mt-1" />

                        </div>

                        {/* Search dropdown */}
                        {isSearchFocused && <SearchDropdown
                            suggestions={
                                isSearchFocused
                                    ? searchQuery
                                        ? filteredSuggestions
                                        : searchHistory
                                    : []
                            }
                            isHistory={!searchQuery}
                            onSelect={(item) => {
                                setSearchQuery(item);                                
                                setIsSearchFocused(false);
                            }}
                        />}

                    </div>

                    {/* Upload */}
                    <UploadButton
                        size={25}
                        classes="
                            hidden
                            lg:flex
                            h-10
                            w-10
                            shrink-0
                            mt-1
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
                <div className="ml-auto flex shrink-0 items-center gap-3">

                    <UploadButton size={32} classes="lg:hidden flex
                            h-10 w-10
                            shrink-0 mt-1
                            items-center justify-center
                            rounded-full
                            text-text-primary
                            transition-all duration-200
                            hover:bg-surface
                            active:bg-surface
                            active:scale-95" />

                    {/* Mobile Search */}
                    <Link
                        to="/search"
                        aria-label="Search"
                        className="
                            flex md:hidden
                            h-10 w-10
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
                            size={32}
                            weight="regular"
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