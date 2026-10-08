import { MagnifyingGlassIcon } from "@phosphor-icons/react";

function SearchButton({ classes = "", onClick, type = "button", ...props }) {
    return (
        <button
            type={type}
            aria-label="Search"
            onClick={onClick}
            {...props}
            className={`
                absolute right-2 top-1/2
                flex h-10 w-10
                -translate-y-1/2
                items-center justify-center
                rounded-full
                text-text-secondary
                transition-all duration-200
                hover:bg-surface-elevated
                active:bg-surface-elevated
                hover:text-text-primary ${classes}`}
        >
            <MagnifyingGlassIcon size={23} weight="regular" />
        </button>
    );
}

export default SearchButton;