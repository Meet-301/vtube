import {
    UserGearIcon,
    SignOutIcon,
    UserCircleIcon,
    CheckCircleIcon,
    WarningCircleIcon
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice.js";
import api from "../api/axios.js";
import { notifications } from "@mantine/notifications";
import { LoadingOverlay } from "@mantine/core";

function ProfileMenu() {
    const [isOpen, setIsopen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const menuRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state?.auth?.user);

    useEffect(() => {
        function handleClick(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsopen(false);
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setIsopen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    if (!user) return null;

    function showError(error) {
        notifications.show({
            title: error || "Something went wrong",
            color: "red",
            icon: <WarningCircleIcon />
        });
    }

    function showSuccess(message) {
        notifications.show({
            title: message,
            icon: <CheckCircleIcon />,
            color: "vtube",
        });
    }

    async function handleLogout() {
        try {
            setIsLoading(true);

            await api.post("/users/logout");

            dispatch(logout());

            setIsopen(false);

            showSuccess("Logged out successfully");

            navigate("/login");
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div ref={menuRef} className="relative">

            {/* Profile button */}
            <button
                type="button"
                onClick={() => setIsopen((prev) => !prev)}
                aria-label="Account menu"
                aria-expanded={isOpen}
                title={user.fullName || user.username || "Account"}
                className="
                    flex
                    h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12
                    shrink-0
                    items-center justify-center
                    rounded-full
                    text-text-primary
                    transition-all duration-200
                    hover:bg-surface-elevated
                    active:bg-surface-elevated
                    active:scale-95
                "
            >
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt="Profile"
                        className="
                            h-8 w-8
                            sm:h-9 sm:w-9
                            md:h-10 md:w-10
                            rounded-full object-cover
                        "
                    />
                ) : (
                    <UserCircleIcon
                        size={24}
                        weight="regular"
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                    />
                )}
            </button>

            {/* Profile menu */}
            {isOpen &&
                <div className="absolute right-0 top-full z-50 w-64 max-w-[calc(100vw-1rem)]">
                    <LoadingOverlay
                        visible={isLoading}
                        zIndex={1000}
                        overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                        loaderProps={{ color: "blue", type: "oval" }}
                    />
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
                        <Link
                            to="/manage-account"
                            onClick={() => setIsopen((prev) => !prev)}
                            className="flex w-full transition-transform duration-200 active:scale-95 items-center gap-4 rounded-lg px-3 py-3 text-text-secondary hover:bg-surface active:bg-surface hover:text-text-primary"
                        >
                            <UserGearIcon size={22} />
                            <span className="text-sm">
                                Manage Account
                            </span>
                        </Link>

                        {/* Logout */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full transition-transform duration-200 active:scale-95 items-center gap-4 rounded-lg px-3 py-3 text-red-700 hover:bg-surface active:bg-surface hover:text-red-500"
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