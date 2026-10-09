import { useRouteError, useNavigate, isRouteErrorResponse } from "react-router-dom";
import { WarningCircleIcon, ArrowCounterClockwiseIcon, HouseIcon } from "@phosphor-icons/react";

function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    const errorMessage = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : error?.message || "An unexpected error occurred.";

    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-4 py-8 text-text-primary">
            <div className="w-full max-w-md text-center p-8 rounded-2xl bg-surface border border-border shadow-xl">
                <div className="flex justify-center mb-4 text-primary">
                    <WarningCircleIcon size={56} weight="duotone" />
                </div>

                <h1 className="text-2xl font-bold tracking-tight mb-2">
                    Something went wrong
                </h1>

                <p className="text-sm text-text-secondary mb-6 break-words">
                    {errorMessage}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover active:scale-95 transition-all"
                    >
                        <ArrowCounterClockwiseIcon size={18} weight="bold" />
                        Reload Page
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/", { replace: true })}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-surface-elevated px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-border active:scale-95 transition-all"
                    >
                        <HouseIcon size={18} weight="bold" />
                        Go Home
                    </button>
                </div>
            </div>
        </main>
    );
}

export default ErrorBoundary;
