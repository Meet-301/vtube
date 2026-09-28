import {
    EyeIcon,
    EyeSlashIcon,
    WarningCircleIcon,
    CheckCircleIcon
} from "@phosphor-icons/react";
import { 
    Link, 
    useNavigate, 
    useSearchParams
} from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios.js";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";

function ResetPassword() {

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const {register, handleSubmit, reset} = useForm();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    function showError(error) {
        notifications.show({
            title: error || "Something went wrong",
            color: "red",
            icon: <WarningCircleIcon/>
        });
    }

    function showSuccess(message) {
        notifications.show({
            title: message,
            icon: <CheckCircleIcon/>,
            color: "vtube",
        });
    }

    async function resetPassword(formData) {
        try {
           setIsLoading(true);

           const newPassword = formData.password;

           const response = await api.patch(
                "/users/reset-password",
                {
                    token,
                    newPassword
                }
            );

            showSuccess(response.data?.message);
            navigate("/login");
        } catch (error) {
            showError(error.response?.data?.message);
        } finally {
            setIsLoading(false);
            reset();
        }
    }

    return (
        <main className="min-h-screen bg-background text-text-primary">

            {isLoading && 
                <LoadingOverlay
                    visible={isLoading}
                    zIndex={1000}
                    overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                    loaderProps={{ color: "blue", type: "oval" }}
                />
            }

            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    px-3
                    py-4
                    sm:px-4
                    sm:py-8
                "
            >

                <div className="w-full max-w-md">

                    {/* ================= BRAND ================= */}

                    <div
                        className="
                            mb-5
                            flex
                            items-center
                            justify-center
                            sm:mb-8
                        "
                    >

                        <img
                            src="/Vtube logo.png"
                            alt="VTube"
                            className="
                                h-12
                                w-12
                                sm:h-14
                                sm:w-14
                                object-contain
                            "
                        />

                        <span
                            className="
                                brand-font
                                -ml-2
                                text-2xl
                                sm:text-3xl
                                tracking-tight
                                text-text-primary
                            "
                        >
                            VTUBE
                        </span>

                    </div>


                    {/* ================= CARD ================= */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-border
                            bg-surface
                            px-4
                            py-5
                            shadow-sm
                            sm:px-8
                            sm:py-8
                        "
                    >

                        {/* ================= HEADING ================= */}

                        <div className="mb-5 sm:mb-7">

                            <h1
                                className="
                                    text-xl
                                    font-semibold
                                    tracking-tight
                                    sm:text-2xl
                                "
                            >
                                Reset your password
                            </h1>

                            <p
                                className="
                                    mt-1.5
                                    text-sm
                                    leading-5
                                    text-text-secondary
                                    sm:mt-2
                                    sm:leading-6
                                "
                            >
                                Create a new password for your VTube
                                account.
                            </p>

                        </div>


                        {/* ================= FORM ================= */}

                        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(resetPassword)}>

                            {/* New Password */}

                            <div className="space-y-2">

                                <label
                                    htmlFor="password"
                                    className="
                                        text-sm
                                        font-medium
                                        text-text-primary
                                    "
                                >
                                    New password
                                </label>

                                <div className="relative">

                                    <input
                                        id="password"
                                        {...register("password")}
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter new password"
                                        className="
                                            h-11
                                            w-full
                                            rounded-xl
                                            border
                                            border-border
                                            bg-background
                                            px-4
                                            pr-12
                                            text-sm
                                            text-text-primary
                                            outline-none
                                            placeholder:text-text-muted
                                            transition-all
                                            duration-200
                                            focus:border-primary
                                            focus:ring-2
                                            focus:ring-primary/20
                                            sm:h-12
                                        "
                                    />

                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        onClick={() =>
                                            setShowPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        className="
                                            absolute
                                            right-1
                                            top-1/2
                                            flex
                                            h-10
                                            w-10
                                            -translate-y-1/2
                                            items-center
                                            justify-center
                                            rounded-full
                                            text-text-secondary
                                            transition-all
                                            duration-200
                                            hover:bg-surface-elevated
                                            hover:text-text-primary
                                            active:bg-surface-elevated
                                            active:scale-95
                                        "
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon
                                                size={21}
                                                weight="regular"
                                            />
                                        ) : (
                                            <EyeIcon
                                                size={21}
                                                weight="regular"
                                            />
                                        )}
                                    </button>

                                </div>

                            </div>


                            {/* Reset Button */}

                            <button
                                type="submit"
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    bg-primary
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition-all
                                    duration-200
                                    hover:bg-primary-hover
                                    active:bg-primary-hover
                                    active:scale-[0.98]
                                    sm:h-12
                                "
                            >
                                Reset password
                            </button>

                        </form>


                        {/* ================= LOGIN ================= */}

                        <div
                            className="
                                mt-5
                                flex
                                items-center
                                justify-center
                                gap-1
                                text-sm
                                text-text-secondary
                                sm:mt-7
                            "
                        >

                            <span>
                                Remember your password?
                            </span>

                            <Link
                                to="/login"
                                className="font-medium"
                            >
                                <span
                                    className="
                                        text-primary
                                        hover:text-primary-hover
                                        active:text-primary-hover
                                    "
                                >
                                    Login
                                </span>
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default ResetPassword;