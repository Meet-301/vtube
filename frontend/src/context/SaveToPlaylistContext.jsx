import { createContext, useCallback, useContext, useState } from "react";
import SaveToPlaylistModal from "../components/SaveToPlaylistModal.jsx";

const SaveToPlaylistContext = createContext(null);

export function SaveToPlaylistProvider({ children }) {
    const [videoId, setVideoId] = useState(null);

    const openSave = useCallback((id) => setVideoId(id), []);
    const closeSave = useCallback(() => setVideoId(null), []);

    return (
        <SaveToPlaylistContext.Provider value={{ openSave }}>
            {children}

            <SaveToPlaylistModal
                isOpen={!!videoId}
                onClose={closeSave}
                videoId={videoId}
            />
        </SaveToPlaylistContext.Provider>
    );
}

export function useSaveToPlaylist() {
    const context = useContext(SaveToPlaylistContext);

    if (!context) {
        throw new Error("useSaveToPlaylist must be used inside SaveToPlaylistProvider");
    }

    return context;
}