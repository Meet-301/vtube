import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useState } from "react";

function Login() {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="min-h-screen bg-background text-text-primary">

            <div className="
                flex
                min-h-screen
                items-center
                justify-center
                px-4
                py-8
            ">

                <div className="
                    w-full
                    max-w-md
                ">

                    {/* ================= BRAND ================= */}

                    <Link
                        to="/"
                        className="
                            mb-8
                            flex
                            items-center
                            justify-center
                            rounded-lg
                        "
                    >
                        <img
                            src="/Vtube logo.png"
                            alt="VTube"
                            className="
                                h-14
                                w-14
                                object-contain
                            "
                        />

                        <span className="
                            brand-font
                            -ml-2
                            text-3xl
                            tracking-tight
                            text-text-primary
                        ">
                            VTUBE
                        </span>
                    </Link>


                    {/* ================= CARD ================= */}

                    <div className="
                        rounded-2xl
                        border
                        border-border
                        bg-surface
                        px-5
                        py-7
                        shadow-sm
                        sm:px-8
                        sm:py-8
                    ">

                        {/* Heading */}

                        <div className="mb-7 text-center">

                            <h1 className="
                                text-2xl
                                font-semibold
                                tracking-tight
                            ">
                                Welcome back
                            </h1>

                            <p className="
                                mt-2
                                text-sm
                                text-text-secondary
                            ">
                                Login to continue to VTube
                            </p>

                        </div>


                        {/* ================= FORM ================= */}

                        <form className="space-y-5">

                            {/* Email */}

                            <div className="space-y-2">

                                <label
                                    htmlFor="email"
                                    className="
                                        text-md
                                        font-medium
                                        text-text-primary
                                    "
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="text"
                                    placeholder="Enter your email"
                                    className="
                                        mt-2
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-border
                                        bg-background
                                        px-4
                                        text-md
                                        text-text-primary
                                        outline-none
                                        placeholder:text-text-muted
                                        transition-all
                                        duration-200
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/20
                                    "
                                />

                            </div>


                            {/* Password */}

                            <div className="space-y-2">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                ">

                                    <label
                                        htmlFor="password"
                                        className="
                                            text-md
                                            font-medium
                                            text-text-primary
                                        "
                                    >
                                        Password
                                    </label>

                                </div>


                                <div className="relative">

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        className="
                                            h-12
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
                                            active:bg-surface-elevated
                                            hover:text-text-primary
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

                                <div className="ml-1 -mt-1">
                                    <Link
                                        to="/forgot-password"
                                        className="
                                            text-sm
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
                                            Forgot password?
                                        </span>
                                    </Link>
                                </div>

                            </div>


                            {/* Login */}

                            <button
                                type="submit"
                                className="
                                    mt-2
                                    h-12
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
                                "
                            >
                                Login
                            </button>

                        </form>


                        {/* ================= Register ================= */}

                        <div className="
                            mt-7
                            flex
                            items-center
                            justify-center
                            gap-1
                            text-sm
                            text-text-secondary
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
                                className="text-primary hover:text-primary-hover active:text-primary-hover">
                                    Register
                                </span>
                            </Link>

                        </div>

                        {/* ================= DIVIDER ================= */}

                            <div className="my-5 flex items-center gap-3">

                                <div className="h-px flex-1 bg-border" />

                                <span className="
                                    text-xs
                                    text-text-muted
                                ">
                                    OR
                                </span>

                                <div className="h-px flex-1 bg-border" />

                            </div>

                            {/* ================= GOOGLE LOGIN ================= */}

                            <button
                                type="button"
                                className="
                                    flex
                                    h-12
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
                                "
                            >
                                <span className="
                                    text-lg
                                    font-semibold
                                ">
                                    <img src="../../public/google_logo.webp" width={22} />
                                </span>
                                Login with Google
                            </button>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default Login;