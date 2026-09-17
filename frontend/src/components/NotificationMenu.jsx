import { BellIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { NotificationItem } from ".";

function NotificationMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={menuRef} className="relative">
            {/* Notification button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
                title="Notifications"
                className="
                    hidden lg:flex
                    h-10 w-10 items-center justify-center
                    rounded-full
                    text-text-primary
                    transition-all duration-200
                    hover:bg-surface-elevated
                    active:scale-95
                "
            >
                <BellIcon size={32} weight="regular" />
            </button>

            {/* Notification popup */}
            {isOpen && (
                <div
                    className="
                    absolute right-0 top-full z-50 mt-2
                    w-[calc(100vw-1rem)]
                    max-w-96
                    sm:w-96
                    "
                >
                    <div className="rounded-2xl bg-surface-elevated p-2 shadow-2xl">

                        <h2 className="px-4 py-3 text-xl font-semibold">
                            Notifications
                        </h2>

                        <div className="border-t border-border" />

                        <div className="max-h-[70vh] overflow-y-auto space-y-1">
                            <NotificationItem
                                avatar="https://i.pravatar.cc/150?img=12"
                                message="Someone liked your video"
                                time="2 hours ago"
                                unread
                            />

                            <NotificationItem
                                avatar="https://i.pravatar.cc/150?img=32"
                                message="You have a new subscriber"
                                time="5 hours ago"
                            />

                            <NotificationItem
                                avatar="https://i.pravatar.cc/150?img=45"
                                message="Your video upload was successful"
                                time="Yesterday"
                                unread
                            />
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationMenu;