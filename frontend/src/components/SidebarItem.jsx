import { Link, useLocation } from "react-router-dom";

function SidebarItem({ icon: Icon, label, url }) {

    const location = useLocation();

    const isActive =
        url === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(url);

    return (
        <Link
            to={url}
            className={`
                flex
                flex-col
                items-center
                gap-1
                rounded-lg
                py-2.5
                transition-colors
                duration-150
                ${isActive
                    ? "text-text-primary"
                    : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                }
            `}
        >
            <Icon
                size={32}
                weight={isActive ? "fill" : "regular"}
            />

            <span>
                {label}
            </span>
        </Link>
    );
}

export default SidebarItem;