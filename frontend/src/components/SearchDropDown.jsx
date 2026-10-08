import {
    ClockCounterClockwiseIcon,
    MagnifyingGlassIcon,
    XIcon
} from "@phosphor-icons/react";

function SearchDropdown({
    suggestions = [],
    isHistory = false,
    onSelect,
    onRemove,
}) {
    if (!suggestions || suggestions.length === 0) {
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
                <div
                    key={`${suggestion}-${index}`}
                    className="
                        group
                        flex
                        w-full
                        items-center
                        justify-between
                        px-4
                        py-2.5
                        transition-colors
                        duration-150
                        hover:bg-surface-elevated
                    "
                >
                    <button
                        type="button"
                        onClick={() => onSelect?.(suggestion)}
                        className="
                            flex
                            min-w-0
                            flex-1
                            items-center
                            gap-3
                            text-left
                            text-sm
                            text-text-primary
                        "
                    >
                        {isHistory ? (
                            <ClockCounterClockwiseIcon
                                size={19}
                                weight="regular"
                                className="shrink-0 text-text-secondary"
                            />
                        ) : (
                            <MagnifyingGlassIcon
                                size={19}
                                weight="regular"
                                className="shrink-0 text-text-secondary"
                            />
                        )}

                        <span className="min-w-0 truncate font-medium">
                            {suggestion}
                        </span>
                    </button>

                    {isHistory && onRemove && (
                        <button
                            type="button"
                            title="Remove from search history"
                            aria-label={`Remove ${suggestion} from search history`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(suggestion);
                            }}
                            className="
                                ml-2
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                text-text-muted
                                transition-all
                                hover:bg-surface
                                hover:text-text-primary
                                active:scale-90
                            "
                        >
                            <XIcon size={16} weight="bold" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default SearchDropdown;