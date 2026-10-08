import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon,
    WarningCircleIcon
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios.js";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { login } from "../features/authSlice.js";

function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {register, handleSubmit, reset} = useForm();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const oAuthError = searchParams.get("error");

    useEffect(() => {
        if(oAuthError) {
            showError(oAuthError);

            setSearchParams({}, {replace: true});
        }
    }, [oAuthError])

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

    async function loginUser(formData) {
        try {
           setIsLoading(true);

           const email = formData.email;
           const password = formData.password;

           const response = await api.post(
                "/users/login",
                {
                    email,
                    password
                }
            );

            showSuccess(response.data?.message);
            dispatch(
                login({
                    user: response.data?.data?.user,
                    accessToken: response.data?.data?.accessToken,
                })
            );
            navigate("/");
        } catch (error) {
            showError(error?.response?.data?.message);
        } finally {
            setIsLoading(false);
            reset();
        }
    }

    async function handleGoogleLogin() {
        try {
            setIsLoading(true);

            const res = await api.get("/users/auth/google");

            showSuccess(res.data?.message);
        } catch (error) {
            showError(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="
            min-h-dvh
            bg-background
            text-text-primary
        ">
            
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0.45, color: "black" }}
                loaderProps={{ color: "blue", type: "oval" }}
            />

            <div className="
                flex
                min-h-dvh
                items-center
                justify-center
                px-3
                py-4
                sm:px-4
                sm:py-6
                lg:py-8
            ">

                <div className="
                    w-full
                    max-w-md
                ">

                    {/* ================= BRAND ================= */}

                    <div className="
                        mb-4
                        flex
                        items-center
                        justify-center
                        sm:mb-6
                        lg:mb-8
                    ">

                        <img
                            src="/Vtube logo.png"
                            alt="VTube"
                            className="
                                h-11
                                w-11
                                object-contain
                                sm:h-12
                                sm:w-12
                                lg:h-14
                                lg:w-14
                            "
                        />

                        <span className="
                            brand-font
                            -ml-2
                            text-2xl
                            tracking-tight
                            text-text-primary
                            sm:text-3xl
                        ">
                            VTUBE
                        </span>

                    </div>


                    {/* ================= CARD ================= */}

                    <div className="
                        rounded-2xl
                        border
                        border-border
                        bg-surface
                        px-4
                        py-5
                        shadow-sm
                        sm:px-7
                        sm:py-7
                        lg:px-8
                        lg:py-8
                    ">

                        {/* Heading */}

                        <div className="
                            mb-5
                            text-center
                            sm:mb-6
                            lg:mb-7
                        ">

                            <h1 className="
                                text-xl
                                font-semibold
                                tracking-tight
                                sm:text-2xl
                            ">
                                Welcome back
                            </h1>

                            <p className="
                                mt-1.5
                                text-xs
                                text-text-secondary
                                sm:mt-2
                                sm:text-sm
                            ">
                                Login to continue to VTube
                            </p>

                        </div>


                        {/* ================= FORM ================= */}

                        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(loginUser)}>

                            {/* Email */}

                            <div className="space-y-1.5">

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
                                    {...register("email")}
                                    required
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
                                />

                            </div>


                            {/* Password */}

                            <div className="space-y-1.5">

                                <label
                                    htmlFor="password"
                                    className="
                                        text-sm
                                        font-medium
                                        text-text-primary
                                    "
                                >
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        {...register("password")}
                                        required
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
                                            h-9
                                            w-9
                                            -translate-y-1/2
                                            items-center
                                            justify-center
                                            rounded-full
                                            text-text-secondary
                                            transition-all
                                            duration-200
                                            hover:bg-surface-elevated
                                            active:bg-surface-elevated
                                            hover:text-text-primary
                                            active:scale-95
                                            sm:h-10
                                            sm:w-10
                                        "
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon
                                                size={20}
                                                weight="regular"
                                            />
                                        ) : (
                                            <EyeIcon
                                                size={20}
                                                weight="regular"
                                            />
                                        )}
                                    </button>

                                </div>

                                {/* Forgot password */}

                                <div className="ml-1 pt-0.5">

                                    <Link
                                        to="/forgot-password"
                                    >
                                        <span 
                                            className="
                                                text-xs
                                                font-medium
                                                text-primary
                                                transition-colors
                                                hover:text-primary-hover
                                                sm:text-sm
                                            "
                                        >
                                            Forgot password?
                                        </span>
                                    </Link>

                                </div>

                            </div>


                            {/* Login */}

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
                                Login
                            </button>

                        </form>


                        {/* ================= REGISTER ================= */}

                        <div className="
                            mt-5
                            flex
                            items-center
                            justify-center
                            gap-1
                            text-xs
                            text-text-secondary
                            sm:mt-6
                            sm:text-sm
                        ">

                            <span>
                                Don't have an account?
                            </span>

                            <Link
                                to="/register"
                                className="
                                    font-medium
                                "
                            >
                                <span 
                                    className="
                                        text-primary 
                                        hover:text-primary-hover
                                        active:text-primary-hover
                                    "
                                >
                                    Register
                                </span>
                            </Link>

                        </div>


                        {/* ================= DIVIDER ================= */}

                        <div className="
                            my-4
                            flex
                            items-center
                            gap-3
                            sm:my-5
                        ">

                            <div className="h-px flex-1 bg-border" />

                            <span className="
                                text-[10px]
                                text-text-muted
                                sm:text-xs
                            ">
                                OR
                            </span>

                            <div className="h-px flex-1 bg-border" />

                        </div>


                        {/* ================= GOOGLE LOGIN ================= */}

                        <button
                            type="button"
                            onClick={() => {
                                window.location.href = `${import.meta.env.VITE_API_URL}/users/auth/google`;
                            }}
                            className="
                                flex
                                h-11
                                w-full
                                items-center
                                justify-center
                                gap-3
                                rounded-xl
                                border
                                border-border
                                bg-background
                                text-sm
                                font-medium
                                text-text-primary
                                transition-all
                                duration-200
                                hover:bg-surface-elevated
                                active:bg-surface-elevated
                                active:scale-[0.98]
                                sm:h-12
                            "
                        >

                            <img
                                src="/google_logo.webp"
                                alt="Google"
                                className="h-5 w-5"
                            />

                            Login with Google

                        </button>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default Login;