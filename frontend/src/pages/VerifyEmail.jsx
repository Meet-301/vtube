import {
    ArrowLeftIcon,
    EnvelopeSimpleIcon
} from "@phosphor-icons/react";

import { Link } from "react-router-dom";

function VerifyEmail() {

    return (
        <main className="min-h-screen bg-background text-text-primary">

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
                            py-6
                            text-center
                            shadow-sm
                            sm:px-8
                            sm:py-8
                        "
                    >

                        {/* ================= EMAIL ICON ================= */}

                        <div
                            className="
                                mx-auto
                                mb-5
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-primary/10
                                text-primary
                                sm:mb-6
                                sm:h-16
                                sm:w-16
                            "
                        >
                            <EnvelopeSimpleIcon
                                size={30}
                                weight="regular"
                                className="sm:hidden"
                            />

                            <EnvelopeSimpleIcon
                                size={34}
                                weight="regular"
                                className="hidden sm:block"
                            />
                        </div>


                        {/* ================= HEADING ================= */}

                        <h1
                            className="
                                text-xl
                                font-semibold
                                tracking-tight
                                sm:text-2xl
                            "
                        >
                            Verify your email
                        </h1>


                        {/* ================= DESCRIPTION ================= */}

                        <p
                            className="
                                mx-auto
                                mt-2
                                max-w-sm
                                text-sm
                                leading-5
                                text-text-secondary
                                sm:mt-3
                                sm:leading-6
                            "
                        >
                            We've sent a verification link to
                        </p>


                        {/* ================= EMAIL ================= */}

                        <p
                            className="
                                mt-1
                                break-all
                                text-sm
                                font-medium
                                text-text-primary
                            "
                        >
                            user@example.com
                        </p>


                        {/* ================= INFO ================= */}

                        <p
                            className="
                                mx-auto
                                mt-3
                                max-w-sm
                                text-sm
                                leading-5
                                text-text-secondary
                                sm:mt-4
                                sm:leading-6
                            "
                        >
                            Please check your inbox and click the
                            verification link to activate your account.
                        </p>


                        {/* ================= RESEND ================= */}

                        <button
                            type="button"
                            className="
                                mt-6
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
                                sm:mt-7
                                sm:h-12
                            "
                        >
                            Resend verification email
                        </button>


                        {/* ================= BACK TO LOGIN ================= */}

                        <Link
                            to="/login"
                            className="
                                mt-4
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                text-sm
                                font-medium
                                text-text-secondary
                                transition-colors
                                hover:text-text-primary
                                sm:mt-5
                            "
                        >
                            <span
                                className="
                                    text-text-secondary
                                    hover:text-text-primary
                                    active:text-text-primary
                                    flex
                                    gap-2

                                "
                            >
                                <ArrowLeftIcon
                                    size={18}
                                    weight="regular"

                                />
                                Back to login
                            </span>

                        </Link>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default VerifyEmail;