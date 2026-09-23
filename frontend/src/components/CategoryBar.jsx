function CategoryBar() {

    const categories = [
        "All Videos",
        "Most Liked",
        "Most Viewed",
        "Oldest",
    ];

    return (
        <div className="w-full min-w-0 overflow-x-auto px-4 py-3">
            <div className="flex w-max gap-3">
                {categories.map((category, index) => (
                    <button
                        key={category}
                        type="button"
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
                            ${index === 0
                                ? "bg-primary text-white"
                                : "bg-surface text-text-secondary hover:bg-surface-elevated active:bg-surface-elevated hover:text-text-primary"
                            }
                        `}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CategoryBar;