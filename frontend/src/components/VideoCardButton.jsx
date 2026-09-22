function VideoCardButton({ icon: Icon, text, onClick }) {
    return (
        <button
            type="button"
            onClick={(event) => {
                event.stopPropagation();
                onClick();
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
                transition-transform
                duration-150
                hover:bg-surface
                active:bg-surface
                active:scale-95
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

export default VideoCardButton;