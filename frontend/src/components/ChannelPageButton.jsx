

function ChannelPageButton({icon: Icon, text}) {
    return (
        <button
            type="button"
            className="
                flex
                items-center
                gap-2
                rounded-full
                bg-surface
                px-4
                py-2
                text-sm
                font-medium
                text-text-primary
                transition-all
                duration-200
                hover:bg-surface-elevated
                active:bg-surface-elevated
                active:scale-95
            "
        >
            <Icon
                size={18}
                weight="regular"
            />
            {text}
        </button>
    )
}

export default ChannelPageButton