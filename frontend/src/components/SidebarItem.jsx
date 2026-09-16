function SidebarItem({ icon: Icon, label, active = false }) {
    return (
        <a
            href="#"
            className={`
                flex flex-col items-center gap-1
                rounded-lg
                py-2.5
                hover:bg-surface-elevated hover:text-text-primary
            `}
        >
            <Icon size={32} weight={active ? "fill" : "regular"} />

            <span>{label}</span>
        </a>
    );
}

export default SidebarItem;