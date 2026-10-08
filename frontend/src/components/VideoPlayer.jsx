import { useEffect, useRef, useState } from "react";
import {
    PlayIcon,
    PauseIcon,
    SpeakerHighIcon,
    SpeakerLowIcon,
    SpeakerSlashIcon,
    CornersOutIcon,
    CornersInIcon,
} from "@phosphor-icons/react";
import { Loader } from "@mantine/core";
import { formatDuration } from "../utils/formatters";

function VideoPlayer({ src, poster, autoPlay = false, videoRef, onTimeUpdate }) {

    const innerRef = useRef(null);
    const ref = videoRef ?? innerRef;

    const containerRef = useRef(null);
    const barRef = useRef(null);
    const hideTimer = useRef(null);
    const isDragging = useRef(false);

    const [isPaused, setIsPaused] = useState(!autoPlay);
    const [isBuffering, setIsBuffering] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [bufferedEnd, setBufferedEnd] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const controlsVisible = showControls || isPaused;

    /* ================= ACTIONS ================= */

    function togglePlay() {
        const video = ref.current;
        if (!video) return;

        if (video.paused) video.play().catch(() => { });
        else video.pause();
    }

    function toggleMute() {
        const video = ref.current;
        if (!video) return;

        video.muted = !video.muted;
        setIsMuted(video.muted);
    }

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            containerRef.current?.requestFullscreen?.();
        }
    }

    function skip(seconds) {
        const video = ref.current;
        if (!video || !video.duration) return;

        video.currentTime = Math.min(
            Math.max(0, video.currentTime + seconds),
            video.duration
        );
    }

    function handleVolumeChange(e) {
        const video = ref.current;
        const value = Number(e.target.value);

        video.volume = value;
        video.muted = value === 0;

        setVolume(value);
        setIsMuted(value === 0);
    }

    //! controls dikhao, aur video chal rahi ho to 2.5 sec baad chhupa do
    function wakeControls() {
        setShowControls(true);
        clearTimeout(hideTimer.current);

        if (ref.current && !ref.current.paused) {
            hideTimer.current = setTimeout(() => setShowControls(false), 2500);
        }
    }

    /* ================= SEEK BAR ================= */

    function seekFromPointer(e) {
        const video = ref.current;
        const bar = barRef.current;

        if (!video || !bar || !video.duration) return;

        const rect = bar.getBoundingClientRect();
        const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);

        video.currentTime = ratio * video.duration;
        setCurrentTime(video.currentTime);
    }

    function handleBarDown(e) {
        isDragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        seekFromPointer(e);
    }

    function handleBarMove(e) {
        if (isDragging.current) seekFromPointer(e);
    }

    function handleBarUp() {
        isDragging.current = false;
    }

    /* ================= VIDEO EVENTS ================= */

    function handleTimeUpdate(e) {
        if (!isDragging.current) setCurrentTime(ref.current.currentTime);
        onTimeUpdate?.(e);
    }

    function handleProgress() {
        const video = ref.current;
        const ranges = video.buffered;

        if (ranges.length > 0) {
            setBufferedEnd(ranges.end(ranges.length - 1));
        }
    }

    /* ================= KEYBOARD SHORTCUTS ================= */

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            const target = e.target;
            const tag = target.tagName;

            //! comment ya note type karte waqt shortcuts band
            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT" ||
                target.isContentEditable
            ) {
                return;
            }

            const key = e.key.toLowerCase();

            if (key === " " || key === "k") {
                //! kisi button/link pe focus ho to space uska apna click kare
                if (key === " " && (tag === "BUTTON" || tag === "A")) return;

                e.preventDefault();
                togglePlay();
            } else if (key === "f") {
                e.preventDefault();
                toggleFullscreen();
            } else if (key === "m") {
                e.preventDefault();
                toggleMute();
            } else if (e.key === "ArrowLeft") {
                skip(-5);
                wakeControls();
            } else if (e.key === "ArrowRight") {
                skip(5);
                wakeControls();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    //! fullscreen state sync (Esc dabane par bhi)
    useEffect(() => {
        function handleChange() {
            setIsFullscreen(!!document.fullscreenElement);
        }

        document.addEventListener("fullscreenchange", handleChange);

        return () => document.removeEventListener("fullscreenchange", handleChange);
    }, []);

    useEffect(() => {
        return () => clearTimeout(hideTimer.current);
    }, []);

    /* ================= UI ================= */

    const progress = duration ? (currentTime / duration) * 100 : 0;
    const buffered = duration ? (bufferedEnd / duration) * 100 : 0;

    const VolumeIcon =
        isMuted || volume === 0
            ? SpeakerSlashIcon
            : volume < 0.5
                ? SpeakerLowIcon
                : SpeakerHighIcon;

    const iconButton =
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-all duration-150 hover:bg-white/15 active:scale-95";

    return (
        <div
            ref={containerRef}
            onMouseMove={wakeControls}
            onMouseLeave={() => {
                if (ref.current && !ref.current.paused) setShowControls(false);
            }}
            className={`
                group
                relative
                select-none
                overflow-hidden
                bg-black
                ${isFullscreen ? "h-full w-full" : "aspect-video rounded-2xl"}
                ${!controlsVisible && !isPaused ? "cursor-none" : ""}
            `}
        >

            <video
                ref={ref}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                playsInline
                disablePictureInPicture
                controlsList="nodownload noplaybackrate"
                onContextMenu={(e) => e.preventDefault()}
                onClick={togglePlay}
                onDoubleClick={toggleFullscreen}
                onPlay={() => { setIsPaused(false); wakeControls(); }}
                onPause={() => { setIsPaused(true); setShowControls(true); }}
                onTimeUpdate={handleTimeUpdate}
                onProgress={handleProgress}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                onCanPlay={() => setIsBuffering(false)}
                className="h-full w-full object-contain"
            />

            {/* ===== BUFFERING LOADER ===== */}

            {isBuffering && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <Loader color="blue" size={44} type="oval" />
                </div>
            )}

            {/* ===== CENTER PLAY / PAUSE ===== */}

            {!isBuffering && (
                <button
                    type="button"
                    aria-label={isPaused ? "Play" : "Pause"}
                    onClick={togglePlay}
                    className={`
                        absolute
                        left-1/2
                        top-1/2
                        flex
                        h-16
                        w-16
                        -translate-x-1/2
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-primary
                        text-white
                        shadow-xl
                        transition-all
                        duration-200
                        hover:bg-primary-hover
                        active:scale-95
                        sm:h-20
                        sm:w-20
                        ${controlsVisible
                            ? "opacity-100"
                            : "pointer-events-none opacity-0"
                        }
                    `}
                >
                    {isPaused ? (
                        <PlayIcon size={34} weight="fill" />
                    ) : (
                        <PauseIcon size={34} weight="fill" />
                    )}
                </button>
            )}

            {/* ===== BOTTOM CONTROLS ===== */}

            <div
                className={`
                    absolute
                    inset-x-0
                    bottom-0
                    bg-linear-to-t
                    from-black/85
                    via-black/40
                    to-transparent
                    px-3
                    pb-2
                    pt-10
                    transition-opacity
                    duration-200
                    ${controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"}
                `}
            >

                {/* Seek bar */}

                <div
                    ref={barRef}
                    onPointerDown={handleBarDown}
                    onPointerMove={handleBarMove}
                    onPointerUp={handleBarUp}
                    className="group/bar flex h-4 cursor-pointer touch-none items-center"
                >
                    <div className="relative h-1 w-full rounded-full bg-white/25 transition-all group-hover/bar:h-1.5">

                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-white/30"
                            style={{ width: `${buffered}%` }}
                        />

                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-primary"
                            style={{ width: `${progress}%` }}
                        />

                        <div
                            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-primary transition-transform group-hover/bar:scale-100"
                            style={{ left: `${progress}%` }}
                        />

                    </div>
                </div>

                {/* Buttons row */}

                <div className="mt-1 flex items-center gap-1">

                    <button
                        type="button"
                        aria-label={isPaused ? "Play (space)" : "Pause (space)"}
                        title={isPaused ? "Play (space)" : "Pause (space)"}
                        onClick={togglePlay}
                        className={iconButton}
                    >
                        {isPaused ? (
                            <PlayIcon size={22} weight="fill" />
                        ) : (
                            <PauseIcon size={22} weight="fill" />
                        )}
                    </button>

                    {/* Volume */}

                    <div className="group/volume flex items-center">
                        <button
                            type="button"
                            aria-label={isMuted ? "Unmute (m)" : "Mute (m)"}
                            title={isMuted ? "Unmute (m)" : "Mute (m)"}
                            onClick={toggleMute}
                            className={iconButton}
                        >
                            <VolumeIcon size={22} weight="fill" />
                        </button>

                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            onPointerUp={(e) => e.currentTarget.blur()}
                            aria-label="Volume"
                            className="hidden h-1 w-0 cursor-pointer accent-primary transition-all duration-200 group-hover/volume:w-20 group-hover/volume:mx-2 sm:block"
                        />
                    </div>

                    {/* Time */}

                    <span className="ml-2 text-xs font-medium text-white sm:text-sm">
                        {formatDuration(currentTime)} / {formatDuration(duration)}
                    </span>

                    {/* Fullscreen */}

                    <button
                        type="button"
                        aria-label={isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
                        title={isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
                        onClick={toggleFullscreen}
                        className={`${iconButton} ml-auto`}
                    >
                        {isFullscreen ? (
                            <CornersInIcon size={22} />
                        ) : (
                            <CornersOutIcon size={22} />
                        )}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default VideoPlayer;