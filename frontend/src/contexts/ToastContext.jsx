import { createContext, useContext, useState } from "react";
import { Toast } from "../components";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {

    const [toast, setToast] = useState(null);

    const showToast = ({ type = "info", message }) => {
        setToast({
            id: Date.now(),
            type,
            message,
        });
    };

    const hideToast = () => {
        setToast(null);
    };

    const showSuccess = (message) => {
        showToast({
            type: "success",
            message,
        });
    };

    const showError = (message) => {
        showToast({
            type: "error",
            message,
        });
    };

    const showInfo = (message) => {
        showToast({
            type: "info",
            message,
        });
    };

    return (
        <ToastContext.Provider
            value={{
                showSuccess,
                showError,
                showInfo,
                hideToast,
            }}
        >
            {children}

            {toast && (
                <Toast
                    key={toast.id}
                    type={toast.type}
                    message={toast.message}
                    onClose={hideToast}
                />
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {

    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
}