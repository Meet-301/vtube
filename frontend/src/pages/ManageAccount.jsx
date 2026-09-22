import {
    CameraIcon,
    SignOutIcon,
    EyeIcon,
    EyeSlashIcon
} from "@phosphor-icons/react";
import { useState } from "react";

function ManageAccount() {

    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <main className="px-4 py-6">

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
                                src="https://i.pravatar.cc/300?img=12"
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

                        </div>

                    </div>


                    {/* Divider */}

                    <div className="my-6 border-t border-border" />


                    {/* ================= FIELDS ================= */}

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
                                defaultValue="Viraj thakkar"
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


                        {/* Username */}

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
                                Username
                            </label>

                            <input
                                type="text"
                                defaultValue="vkpujara"
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
                                defaultValue="viraj@example.com"
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

                        {/* Password */}

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
                                Password
                            </label>

                            <div className="relative">

                                {passwordVisible ? <input
                                    type="text"
                                    defaultValue="password123"
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
                                        transition-colors
                                        focus:border-primary
                                    "
                                /> : <input
                                    type="password"
                                    defaultValue="password123"
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
                                        transition-colors
                                        focus:border-primary
                                    "
                                />}

                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible((prev) => !prev)}
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-text-secondary
                                        transition-colors
                                        hover:text-text-primary
                                        active:text-text-primary
                                    "
                                >
                                    {passwordVisible ? <EyeSlashIcon
                                        size={20}
                                        weight="regular"
                                    /> : <EyeIcon
                                        size={20}
                                        weight="regular"
                                    />}
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* ================= SAVE ================= */}

                    <div
                        className="
                            mt-6
                            flex
                            justify-end
                        "
                    >
                        <button
                            type="button"
                            className="
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
                            Save changes
                        </button>
                    </div>

                </section>


                {/* ================= SIGN OUT ================= */}

                <button
                    type="button"
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