import {
    HouseIcon,
    UserIcon,
    UserCirclePlusIcon,
    QueueIcon,
    ClockCounterClockwiseIcon,
    ThumbsUpIcon,
    XIcon,
} from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";

function DrawerItem({ icon: Icon, label, url }) {

    const location = useLocation();
    
        const isActive =
        url === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(url);

    return (
        <Link
            to={url}
            className={`
                flex items-center gap-4
                rounded-lg
                px-4 py-3
                text-base
                transition-colors duration-200
                ${isActive
                    ? "bg-surface-elevated text-text-primary"
                    : "text-text-secondary hover:bg-surface-elevated active:bg-surface-elevated hover:text-text-primary"
                }
            `}
        >
            <Icon
                size={24}
                weight={isActive ? "fill" : "regular"}
            />

            <span>{label}</span>
        </Link>
    );
}

function SidebarDrawer({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className="
                    fixed inset-0 z-50
                    bg-black/50
                "
            />

            {/* Drawer */}
            <aside
                className="
                    fixed left-0 top-0 z-50
                    h-full w-72
                    bg-surface
                    shadow-2xl
                "
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between px-4">
                    <Link to="/" title="Home">
                        <div className="flex items-center">
                            <img
                                src="/Vtube logo.png"
                                alt="VTube"
                                className="h-11 w-11 object-contain"
                            />

                            <span className="brand-font -ml-2 text-2xl text-text-primary">
                                VTUBE
                            </span>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="
                            flex h-10 w-10
                            items-center justify-center
                            rounded-full
                            text-text-primary
                            hover:bg-surface-elevated
                            active:bg-surface-elevated
                            active:scale-95
                        "
                    >
                        <XIcon size={26} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-3 py-4" onClick={onClose}>
                    <DrawerItem
                        icon={HouseIcon}
                        label="Home"
                        url="/" 
                    />

                    <DrawerItem
                        icon={QueueIcon}
                        label="Playlists"
                        url="/playlists"
                    />

                    <div className="my-3 border-t border-border" />

                    <DrawerItem
                        icon={UserIcon}
                        label="Your channel"
                        url="/channel"
                    />

                    <DrawerItem
                        icon={UserCirclePlusIcon}
                        label="Subscriptions"
                        url="/subscriptions"
                    />

                    <DrawerItem
                        icon={ClockCounterClockwiseIcon}
                        label="History"
                        url="/history"
                    />

                    <DrawerItem
                        icon={ThumbsUpIcon}
                        label="Liked videos"
                        url="/liked-videos"
                    />
                </nav>
            </aside>
        </>
    );
}

export default SidebarDrawer;