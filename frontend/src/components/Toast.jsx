import {
    CheckCircleIcon,
    WarningCircleIcon,
    InfoIcon,
    XIcon,
} from "@phosphor-icons/react";

function Toast({
    type = "info",
    message,
    onClose,
}) {

    const config = {
        success: {
            icon: CheckCircleIcon,
        },

        error: {
            icon: WarningCircleIcon,
        },

        info: {
            icon: InfoIcon,
        },
    };

    const Icon = config[type]?.icon || InfoIcon;

    return (
        <div
            className="
                fixed
                right-4
                top-4
                z-9999
                flex
                w-[calc(100%-2rem)]
                max-w-sm
                items-start
                gap-3
                rounded-xl
                border
                border-border
                bg-surface
                p-4
                shadow-lg
            "
        >

            <Icon
                size={22}
                weight="regular"
                className="shrink-0 text-primary"
            />

            <p className="
                flex-1
                text-sm
                leading-5
                text-text-primary
            ">
                {message}
            </p>

            <button
                type="button"
                onClick={onClose}
                aria-label="Close notification"
                className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-text-secondary
                    transition-colors
                    hover:bg-surface-elevated
                    hover:text-text-primary
                    active:scale-95
                "
            >
                <XIcon
                    size={17}
                    weight="bold"
                />
            </button>

        </div>
    );
}

export default Toast;