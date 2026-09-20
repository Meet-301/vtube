import {
    UserCircleIcon,
    UserIcon,
    QueueIcon,
    ThumbsUpIcon,
    UserCirclePlusIcon
} from "@phosphor-icons/react";

import {SidebarItem} from "./index.js";
import {Link} from "react-router-dom";

function YouMenuItem({ icon: Icon, label, url }) {
    return (
        <Link
            to={url}
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
        </Link>
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
                    url="/channel"
                    label="Your channel"
                />

                <YouMenuItem
                    icon={UserCirclePlusIcon}
                    url="#"
                    label="Subscriptions"
                />

                <YouMenuItem
                    icon={QueueIcon}
                    url="#"
                    label="Playlists"
                />

                <YouMenuItem
                    icon={ThumbsUpIcon}
                    url="#"
                    label="Liked videos"
                />
            </div>
        </div>
    );
}

export default YouSection;