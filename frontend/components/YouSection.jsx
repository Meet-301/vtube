import {
    UserCircleIcon,
    UserIcon,
    QueueIcon,
    ThumbsUpIcon,
    UserCirclePlusIcon
} from "@phosphor-icons/react";

import SidebarItem from "./SidebarItem";

function YouMenuItem({ icon: Icon, label }) {
    return (
        <a
            href="#"
            className="
                flex items-center gap-4
                rounded-lg
                px-5 py-3
                text-text-secondary
                hover:bg-surface
                hover:text-text-primary
            "
        >
            <Icon size={28} weight="regular" />

            <span className="text-base font-medium">
                {label}
            </span>
        </a>
    );
}

function YouSection() {
    return (
        <div className="group relative">

            {/* You sidebar item */}
            <SidebarItem
                icon={UserCircleIcon}
                label="You"
            />

            {/* You popover */}
            <div
                className="
                    absolute left-full top-0
                    z-50
                    hidden
                    w-96
                    rounded-2xl
                    bg-surface-elevated
                    p-2
                    shadow-2xl
                    group-hover:block
                "
            >
                <h2 className="px-5 py-3 text-2xl font-semibold">
                    You
                </h2>

                <YouMenuItem
                    icon={UserIcon}
                    label="Your channel"
                />

                <YouMenuItem
                    icon={UserCirclePlusIcon}
                    label="Subscriptions"
                />

                <YouMenuItem
                    icon={QueueIcon}
                    label="Playlists"
                />

                <YouMenuItem
                    icon={ThumbsUpIcon}
                    label="Liked videos"
                />
            </div>
        </div>
    );
}

export default YouSection;