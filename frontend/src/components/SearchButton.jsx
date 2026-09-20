import { MagnifyingGlassIcon } from "@phosphor-icons/react";

function SearchButton({classes}) {
    return (
        <button
            type="button"
            aria-label="Search"
            className={`pointer-events-none
                absolute right-2 top-1/2
                flex h-10 w-10
                -translate-y-1/2
                items-center justify-center
                rounded-full
                text-text-secondary
                opacity-0
                transition-all duration-200
                group-focus-within:pointer-events-auto
                group-focus-within:opacity-100
                group-focus-within:hover:bg-surface-elevated
                group-focus-within:active:bg-surface-elevated
                group-focus-within:hover:text-text-primary ${classes}`}
        >
            <MagnifyingGlassIcon size={23} weight="regular" />
        </button>
    )
}

export default SearchButton