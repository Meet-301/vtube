import { Link } from "react-router-dom";

function SidebarItem({ icon: Icon, label, active = false, url }) {
    return (
        <Link
            to={url}
            className={`
                flex flex-col items-center gap-1
                rounded-lg
                py-2.5
                hover:bg-surface-elevated hover:text-text-primary
            `}
        >
            <Icon size={32} weight={active ? "fill" : "regular"} />

            <span>{label}</span>
        </Link>
    );
}

export default SidebarItem;