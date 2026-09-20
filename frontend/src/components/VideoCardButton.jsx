

function VideoCardButton({ icon: Icon, text }) {
    return (
        <button
            type="button"
            onClick={(event) => {
                event.stopPropagation();
            }}
            className="
                flex
                w-full
                items-center
                gap-4
                rounded-xl
                px-4
                py-3
                text-base
                text-text-primary
                transition-colors
                duration-150
                hover:bg-surface
                active:bg-surface
            "
        >
            <Icon
                size={22}
                weight="regular"
            />

            <span>
                {text}
            </span>
        </button>
    )
}

export default VideoCardButton