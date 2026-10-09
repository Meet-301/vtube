const STORAGE_KEY = "vtube_watch_progress";

export function getAllWatchProgress() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error("Failed to read watch progress from localStorage", e);
        return {};
    }
}

export function getWatchProgress(videoId) {
    if (!videoId) return null;
    const all = getAllWatchProgress();
    return all[videoId] || null;
}

export function saveWatchProgress(videoId, currentTime, duration) {
    if (!videoId || !duration || isNaN(currentTime) || isNaN(duration)) return;

    try {
        const all = getAllWatchProgress();

        // If watched less than 3 seconds, or watched more than 95%, clear progress
        const percent = (currentTime / duration) * 100;
        if (currentTime < 3 || percent >= 95 || currentTime >= duration - 5) {
            if (all[videoId]) {
                delete all[videoId];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
            }
            return;
        }

        all[videoId] = {
            currentTime: Math.floor(currentTime),
            duration: Math.floor(duration),
            progress: Math.min(100, Math.max(1, Math.round(percent))),
            updatedAt: Date.now(),
        };

        // Keep maximum 100 recent progress entries
        const keys = Object.keys(all);
        if (keys.length > 100) {
            keys.sort((a, b) => (all[a].updatedAt || 0) - (all[b].updatedAt || 0));
            while (keys.length > 100) {
                const oldest = keys.shift();
                delete all[oldest];
            }
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
        console.error("Failed to save watch progress", e);
    }
}

export function clearWatchProgress(videoId) {
    if (!videoId) return;
    try {
        const all = getAllWatchProgress();
        if (all[videoId]) {
            delete all[videoId];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        }
    } catch (e) {
        console.error("Failed to clear watch progress", e);
    }
}
