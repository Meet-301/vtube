import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { notifications } from "@mantine/notifications";
import { LoadingOverlay } from "@mantine/core";
import {
    CheckCircleIcon,
    WarningCircleIcon
} from "@phosphor-icons/react";

function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const {register, handleSubmit, reset} = useForm();
    const navigate = useNavigate();

    function showError(error) {
        notifications.show({
            title: error || "Invalid or expired verification link",
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

    async function onSubmit(formData) {
        try {

            setIsLoading(true);

            const response = await api.post(
                "/users/forgot-password",
                {
                    email: formData.email
                }
            );

            showSuccess(response.data?.message || "Email sent to reset the password");
            navigate("/reset-password");        

        } catch (error) {
            showError(error.response?.data?.message || "Something went wrong. Please try again");
        } finally {
            setIsLoading(false);
            reset();
        }
    }

    return (
        <main className="min-h-screen bg-background text-text-primary">

            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                loaderProps={{ color: "blue", type: "oval" }}
            />

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
                                object-contain
                                sm:h-14
                                sm:w-14
                            "
                        />

                        <span
                            className="
                                brand-font
                                -ml-2
                                text-2xl
                                tracking-tight
                                text-text-primary
                                sm:text-3xl
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
                                Forgot your password?
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
                                Enter the email associated with your
                                account and we'll send you a link to
                                reset your password.
                            </p>

                        </div>


                        {/* ================= FORM ================= */}

                        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>

                            {/* Email */}

                            <div className="space-y-2">

                                <label
                                    htmlFor="email"
                                    className="
                                        text-sm
                                        font-medium
                                        text-text-primary
                                    "
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
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
                                        placeholder:text-text-muted
                                        transition-all
                                        duration-200
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/20
                                        sm:h-12
                                    "
                                    {...register("email", {
                                        required: "Email is required"
                                    })}
                                />

                            </div>


                            {/* Send Reset Link */}

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
                                Send reset link
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

export default ForgotPassword;