import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, SmileySadIcon } from "@phosphor-icons/react";

function NotFound() {
    const navigate = useNavigate();

    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-8 text-text-primary">
            <div className="relative mx-auto flex w-full max-w-lg flex-col items-center text-center">

                {/* Ambient glow background */}
                <div className="pointer-events-none absolute -top-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

                {/* Large 404 number badge */}
                <div className="relative select-none">
                    <span className="text-8xl font-black tracking-tighter text-surface-elevated/80 sm:text-9xl md:text-[11rem]">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface border border-white/10 shadow-xl sm:h-24 sm:w-24">
                            <SmileySadIcon size={48} weight="duotone" className="text-primary animate-bounce" />
                        </div>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl md:text-4xl">
                    Page not found
                </h1>

                {/* Subtext */}
                <p className="mt-3 max-w-md text-sm text-text-secondary sm:text-base leading-relaxed">
                    The page you are looking for doesn't exist, has been moved, or the link may be broken.
                </p>

                {/* Only Go Back button */}
                <div className="mt-8 flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
                            flex items-center gap-2.5
                            rounded-full
                            bg-primary
                            hover:bg-primary-hover
                            px-8 py-3.5
                            text-sm sm:text-base font-semibold
                            text-white
                            shadow-lg shadow-primary/25
                            transition-all duration-200
                            active:scale-95
                            cursor-pointer
                        "
                    >
                        <ArrowLeftIcon size={20} weight="bold" />
                        <span>Go Back</span>
                    </button>
                </div>

            </div>
        </main>
    );
}

export default NotFound;
