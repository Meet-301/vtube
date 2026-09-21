import {
    BookmarkSimpleIcon,
    DotsThreeVerticalIcon,
    PencilSimpleIcon,
    ShareNetworkIcon,
    TrashIcon,
    XIcon,
} from "@phosphor-icons/react";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { VideoCardButton } from "./index.js";

const MOBILE_QUERY = "(max-width: 639px)"; // Tailwind `sm` = 640px

const stop = (event) => event.stopPropagation();

//! Screen size ke hisaab se sirf EK variant render karne ke liye
function useIsMobile() {

    const [isMobile, setIsMobile] = useState(
        () =>
            typeof window !== "undefined" &&
            window.matchMedia(MOBILE_QUERY).matches
    );

    useEffect(() => {

        const mq = window.matchMedia(MOBILE_QUERY);
        const onChange = (event) => setIsMobile(event.matches);

        setIsMobile(mq.matches);
        mq.addEventListener("change", onChange);

        return () => mq.removeEventListener("change", onChange);

    }, []);

    return isMobile;
}

function MoreButton({ isEditable = false, onlyDelete = false }) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [coords, setCoords] = useState(null); // desktop dropdown position

    const isMobile = useIsMobile();

    const buttonRef = useRef(null);
    const popupRef = useRef(null);    //! portal root (dropdown or sheet + backdrop)
    const dropdownRef = useRef(null);

    const closeMenu = () => setIsMenuOpen(false);

    const deleteAction = { key: "delete", icon: TrashIcon, text: "Delete" };

    const actions = onlyDelete
        ? [
            { key: "share", icon: ShareNetworkIcon, text: "Share" },
            { key: "save", icon: BookmarkSimpleIcon, text: "Save" },
            deleteAction
        ]
        : [
            { key: "share", icon: ShareNetworkIcon, text: "Share" },
            { key: "save", icon: BookmarkSimpleIcon, text: "Save" },
            ...(isEditable
                ? [
                    { key: "edit", icon: PencilSimpleIcon, text: "Edit" },
                    deleteAction,
                ]
                : []),
        ];

    //! Outside click / Escape / (desktop) scroll + resize => close
    useEffect(() => {

        if (!isMenuOpen) return;

        //! CAPTURE phase: we stop the outside click of the menu here only
        //! therefore it'll not reach to the card(React onClick, native listener, <a> navigation).
        function handleClickCapture(event) {

            const target = event.target;

            if (
                buttonRef.current?.contains(target) ||
                popupRef.current?.contains(target)
            ) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            setIsMenuOpen(false);

        }

        function handleEscape(event) {
            if (event.key === "Escape") setIsMenuOpen(false);
        }

        function handleResize() {
            setIsMenuOpen(false);
        }

        function handleScroll(event) {
            if (popupRef.current?.contains(event.target)) return;
            setIsMenuOpen(false);
        }

        document.addEventListener("click", handleClickCapture, true);
        document.addEventListener("keydown", handleEscape);

        if (!isMobile) {
            window.addEventListener("resize", handleResize);
            window.addEventListener("scroll", handleScroll, true);
        }

        return () => {
            document.removeEventListener("click", handleClickCapture, true);
            document.removeEventListener("keydown", handleEscape);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll, true);
        };

    }, [isMenuOpen, isMobile]);

    //! Lock background scroll when sheet is opend in mobile
    useEffect(() => {

        if (!isMenuOpen || !isMobile) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };

    }, [isMenuOpen, isMobile]);

    //! Position of desktop dropdown
    useLayoutEffect(() => {

        if (!isMenuOpen || isMobile) {
            setCoords(null);
            return;
        }

        if (!buttonRef.current || !dropdownRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const height = dropdownRef.current.offsetHeight;
        const gap = 8;

        const fitsBelow =
            rect.bottom + gap + height <= window.innerHeight - gap;

        setCoords({
            top: fitsBelow
                ? rect.bottom + gap
                : Math.max(gap, rect.top - gap - height),
            right: Math.max(gap, window.innerWidth - rect.right),
        });

    }, [isMenuOpen, isMobile]);

    //! Handle more button
    function handleToggleMenu(event) {
        event.preventDefault();
        event.stopPropagation();

        setIsMenuOpen((prev) => !prev);
    }

    return (
        <>
            {/* ================= MORE BUTTON ================= */}

            <div className="absolute right-0 top-0 z-30">

                <button
                    ref={buttonRef}
                    type="button"
                    aria-label="More options"
                    aria-haspopup="menu"
                    aria-expanded={isMenuOpen}
                    title="More"
                    onClick={handleToggleMenu}
                    onPointerDown={stop}
                    onMouseDown={stop}
                    className="
                        more-btn
                        flex
                        h-10
                        w-10
                        touch-manipulation
                        items-center
                        justify-center
                        rounded-full
                        text-text-secondary
                        transition-all
                        duration-150
                        hover:bg-surface-elevated
                        hover:text-text-primary
                        active:scale-95
                        active:bg-surface-elevated
                    "
                >
                    <DotsThreeVerticalIcon size={27} weight="bold" />
                </button>

            </div>

            {/* ================= POPUP (portal => document.body) ================= */}

            {isMenuOpen &&
                createPortal(
                    <div
                        ref={popupRef}
                        onClick={stop}
                        onPointerDown={stop}
                        onMouseDown={stop}
                    >

                        {isMobile ? (

                            <>
                                {/* Backdrop */}

                                <div
                                    aria-hidden="true"
                                    onClick={closeMenu}
                                    className="fixed inset-0 z-90 bg-black/40"
                                />


                                {/* Bottom sheet */}

                                <div
                                    role="dialog"
                                    aria-modal="true"
                                    aria-label="More options"
                                    className="
                                        fixed
                                        inset-x-0
                                        bottom-0
                                        z-100
                                        max-h-[80dvh]
                                        overflow-y-auto
                                        overscroll-contain
                                        rounded-t-3xl
                                        bg-surface-elevated
                                        p-3
                                        pb-[calc(0.75rem+env(safe-area-inset-bottom))]
                                        shadow-2xl
                                    "
                                >

                                    <div className="mb-3 flex justify-center">
                                        <div className="h-1 w-10 rounded-full bg-text-muted/40" />
                                    </div>

                                    <div className="flex items-center justify-between px-2 pb-2">

                                        <span className="text-sm font-semibold text-text-primary">
                                            More options
                                        </span>

                                        <button
                                            type="button"
                                            aria-label="Close"
                                            onClick={closeMenu}
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                touch-manipulation
                                                items-center
                                                justify-center
                                                rounded-full
                                                text-text-secondary
                                                transition-colors
                                                duration-150
                                                active:scale-95
                                                active:bg-surface
                                            "
                                        >
                                            <XIcon size={20} weight="bold" />
                                        </button>

                                    </div>

                                    <div className="space-y-1">
                                        {actions.map(({ key, icon, text }) => (
                                            <VideoCardButton
                                                key={key}
                                                icon={icon}
                                                text={text}
                                                onClick={closeMenu}
                                            />
                                        ))}
                                    </div>

                                </div>
                            </>

                        ) : (

                            /* Desktop / tablet dropdown */

                            <div
                                ref={dropdownRef}
                                role="menu"
                                style={
                                    coords ?? {
                                        top: 0,
                                        right: 0,
                                        visibility: "hidden",
                                    }
                                }
                                className="
                                    fixed
                                    z-100
                                    w-56
                                    rounded-2xl
                                    bg-surface-elevated
                                    p-2
                                    shadow-2xl
                                "
                            >
                                {actions.map(({ key, icon, text }) => (
                                    <VideoCardButton
                                        key={key}
                                        icon={icon}
                                        text={text}
                                        onClick={closeMenu}
                                    />
                                ))}
                            </div>

                        )}

                    </div>,
                    document.body
                )}
        </>
    );
}

export default MoreButton;