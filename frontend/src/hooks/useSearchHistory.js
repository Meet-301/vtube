import { useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";

export function useSearchHistory() {
    const [searchHistory, setSearchHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchHistory = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/search-history");
            setSearchHistory(res.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch search history:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const removeFromHistory = useCallback(async (queryToRemove) => {
        if (!queryToRemove) return;

        // Optimistic update
        setSearchHistory((prev) => prev.filter((item) => item !== queryToRemove));

        try {
            await api.delete("/search-history/remove", {
                params: { query: queryToRemove },
            });
        } catch (error) {
            console.error("Failed to remove search history item:", error);
            // Re-fetch on error to stay in sync
            fetchHistory();
        }
    }, [fetchHistory]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return {
        searchHistory,
        fetchHistory,
        removeFromHistory,
        isLoading,
    };
}
