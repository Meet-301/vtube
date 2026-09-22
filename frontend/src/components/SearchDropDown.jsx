import { MagnifyingGlassIcon } from "@phosphor-icons/react";

function SearchDropdown({ suggestions = [], onSelect }) {

    if (!suggestions.length) {
        return null;
    }

    return (
        <div
            className="
                absolute
                left-0
                right-0
                top-full
                z-50
                mt-2
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-surface
                shadow-xl
            "
        >
            {suggestions.map((suggestion, index) => (

                <button
                    key={`${suggestion}-${index}`}
                    type="button"
                    onClick={() => onSelect?.(suggestion)}
                    className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-4
                        py-3
                        text-left
                        text-sm
                        text-text-primary
                        transition-colors
                        duration-150
                        hover:bg-surface-elevated
                        active:bg-surface-elevated
                    "
                >

                    <MagnifyingGlassIcon
                        size={18}
                        weight="regular"
                        className="shrink-0 text-text-secondary"
                    />

                    <span className="min-w-0 truncate">
                        {suggestion}
                    </span>

                </button>

            ))}
        </div>
    );
}

export default SearchDropdown;