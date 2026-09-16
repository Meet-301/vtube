import {
    UserGearIcon,
    SignOutIcon,
    UserCircleIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

function ProfileMenu() {
    const [isOpen, setIsopen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if(
                menuRef.current &&
                !menuRef.current.contains(event.target) 
            ) {
                setIsopen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    return (
        <div ref={menuRef} className="relative">

            {/* Profile button */}
            <button
                type="button"
                onClick={() => setIsopen(!isOpen)}
                className="
                            flex
                            h-9 w-9 mt-1
                            items-center justify-center
                            rounded-full
                            transition-all duration-200
                            text-text-primary
                            active:scale-95
                            overflow-hidden
                            "
            >
                <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="Profile"
                    className="h-full w-full object-cover"
                />
            </button>

            {/* Profile menu */}
            {isOpen &&
                <div className="absolute right-0 top-full z-50 w-64">
                    <div className="rounded-2xl bg-surface-elevated p-2 mt-2 shadow-2xl">

                        {/* Account header */}
                        <div className="flex items-center gap-3 px-3 py-3">
                            <UserCircleIcon
                                size={32}
                                weight="regular"
                            />

                            <div>
                                <p className="font-semibold text-text-primary">
                                    Your account
                                </p>

                                <p className="text-sm text-text-secondary">
                                    Manage your profile
                                </p>
                            </div>
                        </div>

                        <div className="my-1 border-t border-border" />

                        {/* Edit profile */}
                        <button
                            type="button"
                            className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-text-secondary hover:bg-surface active:bg-surface hover:text-text-primary"
                        >
                            <UserGearIcon size={22} />
                            <span className="text-sm">
                                Manage Account
                            </span>
                        </button>

                        {/* Logout */}
                        <button
                            type="button"
                            className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-red-700 hover:bg-surface active:bg-surface hover:text-red-500"
                        >
                            <SignOutIcon size={22} />
                            <span className="text-sm">
                                Logout
                            </span>
                        </button>

                    </div>
                </div>
            }

        </div>
    );
}

export default ProfileMenu;