import { useState } from "react";
import { EyeIcon, EyeSlashIcon, UserCircleIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

    function handleAvatarChange(e) {
        const file = e.target.files?.[0];

        if (!file) return;

        setAvatarPreview(URL.createObjectURL(file));
    }

    return (
        <main className="min-h-screen bg-background text-text-primary">

            <div className="
                flex
                min-h-screen
                items-center
                justify-center
                px-3
                py-4
                sm:px-4
                sm:py-6
                md:py-8
            ">

                <div className="w-full max-w-md">

                    {/* ================= BRAND ================= */}

                    <div
                        className="
                            mb-4
                            flex
                            items-center
                            justify-center
                            rounded-lg
                            sm:mb-6
                            md:mb-8
                        "
                    >
                        <img
                            src="/Vtube logo.png"
                            alt="VTube"
                            className="
                                h-11
                                w-11
                                object-contain
                                sm:h-12
                                sm:w-12
                                md:h-14
                                md:w-14
                            "
                        />

                        <span className="
                            brand-font
                            -ml-2
                            text-2xl
                            tracking-tight
                            text-text-primary
                            sm:text-2xl
                            md:text-3xl
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
                        sm:px-6
                        sm:py-7
                        md:px-8
                        md:py-8
                    ">

                        {/* Heading */}

                        <div className="mb-5 text-center sm:mb-6 md:mb-7">

                            <h1 className="
                                text-xl
                                font-semibold
                                tracking-tight
                                sm:text-2xl
                            ">
                                Create your account
                            </h1>

                            <p className="
                                mt-1.5
                                text-xs
                                text-text-secondary
                                sm:mt-2
                                sm:text-sm
                            ">
                                Register to start using VTube
                            </p>

                        </div>


                        {/* ================= FORM ================= */}

                        <form className="space-y-4 sm:space-y-5">

                            {/* Avatar */}

                            <div className="
                                flex
                                flex-col
                                items-center
                                gap-2
                                sm:gap-3
                            ">

                                <label
                                    htmlFor="avatar"
                                    className="
                                        group
                                        relative
                                        flex
                                        h-20
                                        w-20
                                        cursor-pointer
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        rounded-full
                                        border
                                        border-border
                                        bg-background
                                        transition-all
                                        duration-200
                                        hover:border-primary
                                        sm:h-24
                                        sm:w-24
                                    "
                                >

                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar preview"
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />
                                    ) : (
                                        <UserCircleIcon
                                            size={42}
                                            weight="regular"
                                            className="text-text-secondary sm:hidden"
                                        />
                                    )}

                                    {!avatarPreview && (
                                        <UserCircleIcon
                                            size={48}
                                            weight="regular"
                                            className="
                                                hidden
                                                text-text-secondary
                                                sm:block
                                            "
                                        />
                                    )}

                                </label>

                                <input
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />

                                <p className="
                                    text-[11px]
                                    text-text-muted
                                    sm:text-xs
                                ">
                                    Profile picture
                                </p>

                            </div>


                            {/* Full Name */}

                            <div className="space-y-1.5 sm:space-y-2">

                                <label
                                    htmlFor="fullName"
                                    className="
                                        text-sm
                                        font-medium
                                        text-text-primary
                                    "
                                >
                                    Full name
                                </label>

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
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


                            {/* Username */}

                            <div className="space-y-1.5 sm:space-y-2">

                                <label
                                    htmlFor="username"
                                    className="
                                        text-sm
                                        font-medium
                                        text-text-primary
                                    "
                                >
                                    Username
                                </label>

                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Choose a username"
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


                            {/* Email */}

                            <div className="space-y-1.5 sm:space-y-2">

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
                                    name="email"
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
                                />

                            </div>


                            {/* Password */}

                            <div className="space-y-1.5 sm:space-y-2">

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
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Create a password"
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

                            </div>


                            {/* Register */}

                            <button
                                type="submit"
                                className="
                                    mt-1
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
                                    sm:mt-2
                                    sm:h-12
                                "
                            >
                                Register
                            </button>

                        </form>


                        {/* ================= LOGIN ================= */}

                        <div className="
                            mt-5
                            flex
                            items-center
                            justify-center
                            gap-1
                            text-xs
                            text-text-secondary
                            sm:mt-7
                            sm:text-sm
                        ">

                            <span>
                                Already have an account?
                            </span>

                            <Link
                                to="/login"
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

export default Register;