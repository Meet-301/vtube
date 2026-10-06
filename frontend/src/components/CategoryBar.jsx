function CategoryBar({ selected = "latest", onSelect }) {

    const categories = [
        { label: "All Videos", value: "latest" },
        { label: "Most Liked", value: "mostliked" },
        { label: "Most Viewed", value: "mostviewed" },
        { label: "Oldest", value: "oldest" }
    ];
    
    return (
        <div className="w-full min-w-0 overflow-x-auto px-4 py-3">
            <div className="flex w-max gap-3">
                {categories.map((category) => (
                    <button
                        key={category.value}
                        type="button"
                        onClick={() => onSelect?.(category.value)}
                        className={`
                            shrink-0
                            whitespace-nowrap
                            rounded-full
                            px-5 py-2.5
                            text-base
                            font-medium
                            transition-colors
                            duration-200
                            active:scale-95
                            ${selected === category.value
                                ? "bg-primary text-white"
                                : "bg-surface text-text-secondary hover:bg-surface-elevated active:bg-surface-elevated hover:text-text-primary"
                            }
                        `}
                    >
                        {category.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CategoryBar;