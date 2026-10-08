import {
    CameraIcon,
    SignOutIcon,
    XIcon,
    CheckCircleIcon,
    WarningCircleIcon
} from "@phosphor-icons/react";
import { 
    useEffect, 
    useState,
    useRef
} from "react";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { data, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { logout, updateUser } from "../features/authSlice.js";

function ManageAccount() {

    const [accountDetails, setAccountDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const { register, handleSubmit, reset } = useForm();
    const fileInputRef = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    async function handleAvatarChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showError("Please select an image file");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setIsLoading(true);

            const res = await api.patch("/users/update-avatar", formData);

            showSuccess(res.data?.message || "Avatar updated successfully");
            await fetchAccountDetails();
            dispatch(
                updateUser({
                    avatar: res.data?.data
                })
            );
        } catch (error) {
            console.log(error);
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
            e.target.value = ""; //! run onChange by selecting the same file again
        }
    }

    async function fetchAccountDetails() {
        try {
            const res = await api.get("/users/current-user");
            const resData = res.data?.data ?? {};

            setAccountDetails(resData);
            reset({ fullName: data.fullName });
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAccountDetails();
    }, []);

    async function handleLogout() {
        try {
            setIsLoading(true);

            await api.post("/users/logout");

            dispatch(logout());

            showSuccess("Logged out successfully");

            navigate("/login");
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function onSubmit(formData) {
        try {
            setIsLoading(true);

            const res = await api.patch(
                "/users/update-account",
                {
                    fullName: formData.fullName ?? accountDetails.fullName,
                    avatar: formData.avatar ?? accountDetails.avatar
                }
            );

            setAccountDetails(res.data?.data);
            fetchAccountDetails();
            showSuccess(res.data?.message);
        } catch (error) {
            showError(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="px-4 py-6">

            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                loaderProps={{ color: "blue", type: "oval" }}
            />

            <div
                className="
                    mx-auto
                    w-full
                    max-w-3xl
                    py-6
                "
            >

                {/* ================= PAGE HEADER ================= */}

                <div>
                    <h1
                        className="
                            text-2xl
                            font-semibold
                            text-text-primary
                            md:text-3xl
                        "
                    >
                        Manage account
                    </h1>

                </div>


                {/* ================= ACCOUNT DETAILS ================= */}

                <section
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-border
                        bg-surface
                        p-5
                        md:p-6
                    "
                >

                    {/* Profile Picture */}

                    <div className="flex flex-col items-center">

                        <div className="relative">

                            <img
                                src={accountDetails.avatar}
                                alt="Profile"
                                className="
                                    h-28
                                    w-28
                                    rounded-full
                                    object-cover
                                    ring-4
                                    ring-background
                                "
                            />

                            <button
                                type="button"
                                title="Change profile picture"
                                onClick={() => fileInputRef.current?.click()}
                                className="
                                    absolute
                                    bottom-0
                                    right-0
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-border
                                    bg-surface
                                    text-text-primary
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    hover:bg-surface-elevated
                                    active:bg-surface-elevated
                                    active:scale-95
                                "
                            >
                                <CameraIcon
                                    size={18}
                                    weight="regular"
                                />
                            </button>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                className="hidden"
                            />

                        </div>

                    </div>

                    {/* Divider */}

                    <div className="my-6 border-t border-border" />

                    {/* ================= FIELDS ================= */}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-5">

                            {/* Full Name */}

                            <div>

                                <label
                                    className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-text-primary
                                "
                                >
                                    Full name
                                </label>

                                <input
                                    type="text"
                                    {...register("fullName")}
                                    defaultValue={accountDetails.fullName}
                                    className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-border
                                    bg-background
                                    px-4
                                    text-sm
                                    text-text-primary
                                    outline-none
                                    transition-colors
                                    focus:border-primary
                                "
                                />

                            </div>

                            {/* Email */}

                            <div>

                                <label
                                    className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-text-primary
                                "
                                >
                                    Email
                                </label>

                                <input
                                    type="email"
                                    disabled
                                    defaultValue={accountDetails.email}
                                    className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-border
                                    bg-background
                                    px-4
                                    text-sm
                                    text-text-primary
                                    outline-none
                                    transition-colors
                                    focus:border-primary
                                "
                                />

                            </div>

                        </div>

                        {/* ================= ACTIONS ================= */}

                        <div
                            className="
                                mt-6
                                flex
                                flex-col-reverse
                                gap-3
                                sm:flex-row
                                sm:justify-end
                            "
                        >

                            <Link
                                to="/"
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-border
                                    bg-surface
                                    px-6
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-text-primary
                                    transition-all
                                    duration-200
                                    hover:bg-surface-elevated
                                    active:bg-surface-elevated
                                    active:scale-95
                                "
                            >
                                <XIcon size={18} />

                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-full
                                    bg-primary
                                    px-6
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition-all
                                    duration-200
                                    hover:bg-primary-hover
                                    active:bg-primary-hover
                                    active:scale-95
                                "
                            >
                                <CheckCircleIcon
                                    size={18}
                                    weight="bold"
                                />

                                Save changes
                            </button>

                        </div>
                    </form>

                </section>


                {/* ================= SIGN OUT ================= */}

                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        mt-6
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        border
                        border-border
                        bg-surface
                        px-5
                        py-3.5
                        text-sm
                        font-medium
                        text-red-500
                        transition-all
                        duration-200
                        hover:bg-surface-elevated
                        active:bg-surface-elevated
                        active:scale-[0.99]
                    "
                >
                    <SignOutIcon
                        size={20}
                        weight="regular"
                    />

                    <span>
                        Logout
                    </span>
                </button>

            </div>

        </main>
    );
}

export default ManageAccount;