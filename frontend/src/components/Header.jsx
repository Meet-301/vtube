import {
    ListIcon,
    MagnifyingGlassIcon
} from "@phosphor-icons/react";

import {
    SearchButton,
    NotificationMenu,
    ProfileMenu,
    UploadButton
} from "../components";

import {Link} from "react-router-dom";

function Header({ onMenuClick }) {

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
                    <div className="group relative w-full max-w-lg">

                        <input
                            type="text"
                            placeholder="Search"
                            className="
                                h-12 w-96
                                rounded-full
                                border border-primary/10
                                bg-surface
                                px-5 pr-14 mt-1
                                text-sm
                                text-text-primary
                                outline-none
                                placeholder:text-text-muted
                                transition-all duration-200
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/20
                            "
                        />

                        <SearchButton />

                    </div>
                </div>


                {/* ================= DESKTOP SEARCH ================= */}
                <div
                    className="
                        hidden lg:flex
                        flex-1
                        items-center
                        justify-center
                        gap-2.5
                        px-6
                    "
                >
                    <div className="group relative w-full max-w-2xl">

                        <input
                            type="text"
                            placeholder="Search"
                            className="
                                h-14 w-full
                                rounded-full
                                border border-primary/10
                                bg-surface
                                px-5 pr-14 mt-2
                                text-base
                                text-text-primary
                                outline-none
                                placeholder:text-text-muted
                                transition-all duration-200
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/20
                            "
                        />

                        <SearchButton classes="mt-1" />

                    </div>

                    {/* Upload */}
                    <UploadButton size={25} classes="hidden lg:flex
                            h-10 w-10
                            shrink-0 mt-1
                            items-center justify-center
                            rounded-full
                            bg-surface-elevated
                            text-text-primary
                            transition-all duration-200
                            hover:bg-surface
                            active:bg-surface
                            active:scale-95" />
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
                    <button
                        type="button"
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
                    </button>

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