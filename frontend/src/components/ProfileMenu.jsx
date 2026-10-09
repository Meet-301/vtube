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

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
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
                onClick={() => setIsopen(!isOpen)}
                className="
                    flex
                    h-11 w-11 mt-1
                    items-center justify-center
                    rounded-full
                    transition-all duration-200
                    text-text-primary
                    active:scale-95
                    overflow-hidden
                "
            >
                <img
                    src={user.avatar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                />
            </button>

            {/* Profile menu */}
            {isOpen &&
                <div className="absolute right-0 top-full z-50 w-64">
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