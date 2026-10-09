import { useEffect, useRef, useState } from "react";
import {
    PlayIcon,
    PauseIcon,
    SpeakerHighIcon,
    SpeakerLowIcon,
    SpeakerSlashIcon,
    CornersOutIcon,
    CornersInIcon,
    CheckIcon,
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
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
    const [showRemaining, setShowRemaining] = useState(false);
    const speedMenuRef = useRef(null);

    // Seek preview states
    const [hoverTime, setHoverTime] = useState(0);
    const [hoverRatio, setHoverRatio] = useState(0);
    const [tooltipLeft, setTooltipLeft] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);

    const previewVideoRef = useRef(null);
    const pendingSeekTime = useRef(null);
    const seekTimeoutRef = useRef(null);
    const tooltipRef = useRef(null);

    const controlsVisible = showControls || isPaused || isSeeking || showPreview;

    /* ================= ACTIONS ================= */

    function changePlaybackSpeed(speed) {
        const video = ref.current;
        if (video) {
            video.playbackRate = speed;
            setPlaybackSpeed(speed);
        }
        setIsSpeedMenuOpen(false);
        wakeControls();
    }

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

    /* ================= SEEK BAR & PREVIEW ================= */

    function seekPreview(time) {
        const previewVideo = previewVideoRef.current;
        if (!previewVideo || !isFinite(time)) return;

        // Skip negligible seek difference (< 0.15s) to keep scrubbing responsive
        if (Math.abs(previewVideo.currentTime - time) < 0.15) return;

        if (previewVideo.seeking) {
            pendingSeekTime.current = time;
            clearTimeout(seekTimeoutRef.current);
            seekTimeoutRef.current = setTimeout(() => {
                if (pendingSeekTime.current !== null && previewVideoRef.current) {
                    const next = pendingSeekTime.current;
                    pendingSeekTime.current = null;
                    try {
                        previewVideoRef.current.currentTime = next;
                    } catch (_) {}
                }
            }, 250);
        } else {
            try {
                previewVideo.currentTime = time;
            } catch (_) {}
        }
    }

    function handlePreviewSeeked() {
        if (pendingSeekTime.current !== null) {
            const nextTime = pendingSeekTime.current;
            pendingSeekTime.current = null;
            if (previewVideoRef.current && isFinite(nextTime)) {
                try {
                    previewVideoRef.current.currentTime = nextTime;
                } catch (_) {}
            }
        }
    }

    function updateHover(e) {
        const bar = barRef.current;
        if (!bar || !duration) return;

        const rect = bar.getBoundingClientRect();
        const offsetX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const ratio = rect.width > 0 ? offsetX / rect.width : 0;
        const time = Math.min(Math.max(0, ratio * duration), duration);

        setHoverRatio(ratio);
        setHoverTime(time);

        const tooltipWidth = tooltipRef.current?.offsetWidth || 176;
        const halfWidth = tooltipWidth / 2;
        const clampedX = Math.max(0, Math.min(offsetX - halfWidth, rect.width - tooltipWidth));
        setTooltipLeft(clampedX);

        seekPreview(time);
    }

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
        setIsSeeking(true);
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch (_) {}
        seekFromPointer(e);
        updateHover(e);
        setShowPreview(true);
        wakeControls();
    }

    function handleBarMove(e) {
        updateHover(e);
        setShowPreview(true);
        wakeControls();
        if (isDragging.current) {
            seekFromPointer(e);
        }
    }

    function handleBarUp(e) {
        isDragging.current = false;
        setIsSeeking(false);
        try {
            if (e.currentTarget?.hasPointerCapture?.(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
            }
        } catch (_) {}

        const bar = barRef.current;
        if (bar) {
            const rect = bar.getBoundingClientRect();
            if (
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom
            ) {
                setShowPreview(false);
                setHoverRatio(0);
            }
        }
    }

    function handleBarLeave() {
        if (!isDragging.current) {
            setShowPreview(false);
            setHoverRatio(0);
        }
    }

    function handleBarCancel() {
        isDragging.current = false;
        setIsSeeking(false);
        setShowPreview(false);
        setHoverRatio(0);
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
            const isSpace = e.key === " " || e.code === "Space" || key === " " || key === "spacebar";

            if (isSpace || key === "k") {
                e.preventDefault();
                //! Blur any previously clicked button to keep focus clean
                if (tag === "BUTTON" || tag === "A") {
                    target.blur?.();
                }
                togglePlay();
                wakeControls();
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
        return () => {
            clearTimeout(hideTimer.current);
            clearTimeout(seekTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (ref.current) {
            ref.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed, src]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (speedMenuRef.current && !speedMenuRef.current.contains(e.target)) {
                setIsSpeedMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ================= UI ================= */

    const progress = duration ? (currentTime / duration) * 100 : 0;
    const buffered = duration ? (bufferedEnd / duration) * 100 : 0;
    const remainingTime = Math.max(0, (duration || 0) - (currentTime || 0));

    const VolumeIcon =
        isMuted || volume === 0
            ? SpeakerSlashIcon
            : volume < 0.5
                ? SpeakerLowIcon
                : SpeakerHighIcon;

    const iconButton =
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/90 transition-all duration-150 hover:text-white hover:bg-white/15 active:scale-90";

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

            {/* ===== CENTER PLAY BUTTON (PAUSED ONLY) ===== */}

            {isPaused && !isBuffering && (
                <button
                    type="button"
                    aria-label="Play"
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
                        bg-black/55
                        hover:bg-black/75
                        hover:scale-110
                        active:scale-95
                        text-white
                        backdrop-blur-md
                        border
                        border-white/20
                        shadow-2xl
                        transition-all
                        duration-200
                        sm:h-20
                        sm:w-20
                        ${controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"}
                    `}
                >
                    <PlayIcon size={36} weight="fill" className="ml-1" />
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
                    onPointerLeave={handleBarLeave}
                    onPointerCancel={handleBarCancel}
                    className="group/bar relative flex h-4 cursor-pointer touch-none items-center"
                >
                    {/* Floating Preview Tooltip */}
                    {showPreview && duration > 0 && (
                        <div
                            ref={tooltipRef}
                            className="pointer-events-none absolute bottom-6 z-50 flex flex-col items-center select-none"
                            style={{
                                left: `${tooltipLeft}px`,
                            }}
                        >
                            {/* Frame thumbnail */}
                            <div
                                className="relative aspect-video w-36 sm:w-44 overflow-hidden rounded-xl bg-black border border-white/20 shadow-2xl ring-1 ring-black/60"
                                style={{
                                    backgroundImage: poster ? `url(${poster})` : undefined,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                {src && (
                                    <video
                                        ref={previewVideoRef}
                                        src={src}
                                        muted
                                        playsInline
                                        preload="auto"
                                        onSeeked={handlePreviewSeeked}
                                        className="h-full w-full object-cover"
                                        tabIndex={-1}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>

                            {/* Timestamp badge */}
                            <div className="mt-1.5 flex items-center justify-center rounded-md bg-black/85 px-2 py-0.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md border border-white/10">
                                <span>{formatDuration(hoverTime)}</span>
                            </div>
                        </div>
                    )}

                    <div className="relative h-1 w-full rounded-full bg-white/25 transition-all group-hover/bar:h-1.5">

                        {/* Buffered bar */}
                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-white/30"
                            style={{ width: `${buffered}%` }}
                        />

                        {/* Hover bar */}
                        {showPreview && hoverRatio > 0 && (
                            <div
                                className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white/40"
                                style={{ width: `${Math.min(100, Math.max(0, hoverRatio * 100))}%` }}
                            />
                        )}

                        {/* Played progress bar */}
                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-primary"
                            style={{ width: `${progress}%` }}
                        />

                        {/* Scrubber thumb handle */}
                        <div
                            className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-md transition-transform duration-100 ${
                                isSeeking || showPreview
                                    ? "scale-100"
                                    : "scale-0 group-hover/bar:scale-100"
                            }`}
                            style={{ left: `${progress}%` }}
                        />

                    </div>
                </div>

                {/* Buttons row */}

                <div className="mt-1 flex items-center gap-1.5">

                    {/* Play / Pause button */}
                    <button
                        type="button"
                        aria-label={isPaused ? "Play (space)" : "Pause (space)"}
                        title={isPaused ? "Play (space)" : "Pause (space)"}
                        onClick={togglePlay}
                        className={iconButton}
                    >
                        {isPaused ? (
                            <PlayIcon size={20} weight="fill" />
                        ) : (
                            <PauseIcon size={20} weight="fill" />
                        )}
                    </button>

                    {/* Volume button + Expandable volume slider */}
                    <div className="group/volume relative flex items-center">
                        <button
                            type="button"
                            aria-label={isMuted ? "Unmute (m)" : "Mute (m)"}
                            title={isMuted ? "Unmute (m)" : "Mute (m)"}
                            onClick={toggleMute}
                            className={iconButton}
                        >
                            <VolumeIcon size={20} weight="fill" />
                        </button>

                        <div
                            className="
                                flex
                                items-center
                                overflow-hidden
                                transition-all
                                duration-200
                                ease-out
                                w-0
                                opacity-0
                                pointer-events-none
                                group-hover/volume:w-20
                                group-hover/volume:opacity-100
                                group-hover/volume:pointer-events-auto
                                group-focus-within/volume:w-20
                                group-focus-within/volume:opacity-100
                                group-focus-within/volume:pointer-events-auto
                                group-hover/volume:ml-1
                                group-focus-within/volume:ml-1
                            "
                        >
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.02}
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                onPointerUp={(e) => e.currentTarget.blur()}
                                aria-label="Volume"
                                className="h-1 w-18 cursor-pointer accent-white rounded-full bg-white/30"
                            />
                        </div>
                    </div>

                    {/* Time display */}
                    <button
                        type="button"
                        onClick={() => setShowRemaining((prev) => !prev)}
                        title={showRemaining ? "Click to show total duration" : "Click to show remaining time"}
                        aria-label="Toggle remaining time"
                        className="ml-2 flex items-center text-sm font-medium text-white/90 hover:text-white transition-all cursor-pointer select-none rounded-lg px-2 py-1 hover:bg-white/10 active:scale-95"
                    >
                        <span>{formatDuration(currentTime)}</span>
                        <span className="mx-1.5 text-white/40">/</span>
                        <span className={showRemaining ? "text-white font-semibold" : "text-white/70"}>
                            {showRemaining ? `-${formatDuration(remainingTime)}` : formatDuration(duration)}
                        </span>
                    </button>

                    {/* Right action buttons: Speed + Fullscreen */}
                    <div className="ml-auto flex items-center gap-1.5">
                        {/* Playback speed selector */}
                        <div ref={speedMenuRef} className="relative">
                            <button
                                type="button"
                                aria-label="Playback speed"
                                title="Playback speed"
                                onClick={() => {
                                    setIsSpeedMenuOpen((prev) => !prev);
                                    wakeControls();
                                }}
                                className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium text-white/90 hover:text-white hover:bg-white/15 border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-150 active:scale-95"
                            >
                                <span>{playbackSpeed === 1 ? "1x" : `${playbackSpeed}x`}</span>
                            </button>

                            {isSpeedMenuOpen && (
                                <div className="absolute bottom-full right-0 mb-3 w-36 rounded-2xl bg-surface-elevated/95 p-1.5 shadow-2xl backdrop-blur-xl border border-white/10 z-50">
                                    <div className="px-2.5 py-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider border-b border-white/5 mb-1">
                                        Playback Speed
                                    </div>
                                    <div className="max-h-52 overflow-y-auto space-y-0.5 scrollbar-none">
                                        {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((spd) => (
                                            <button
                                                key={spd}
                                                type="button"
                                                onClick={() => changePlaybackSpeed(spd)}
                                                className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
                                                    playbackSpeed === spd
                                                        ? "bg-primary text-white font-semibold shadow-sm"
                                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                                }`}
                                            >
                                                <span>{spd === 1 ? "Normal (1x)" : `${spd}x`}</span>
                                                {playbackSpeed === spd && (
                                                    <CheckIcon size={14} weight="bold" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fullscreen */}
                        <button
                            type="button"
                            aria-label={isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
                            title={isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
                            onClick={toggleFullscreen}
                            className={iconButton}
                        >
                            {isFullscreen ? (
                                <CornersInIcon size={20} />
                            ) : (
                                <CornersOutIcon size={20} />
                            )}
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default VideoPlayer;