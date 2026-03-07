import { useState, useEffect, useCallback, useRef } from "react";
import { useLoaderData, useFetcher } from "react-router";
import type { Reel, ReelsResponse } from "~/services/reelsService";

interface UseReelsFeedReturn {
    reels: Reel[];
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    hasMore: boolean;
    isLoadingMore: boolean;
    error: string | null;
    isMuted: boolean;
    toggleMute: () => void;
    updateReel: (id: string, partial: Partial<Reel>) => void;
    retry: () => void;
}

/**
 * Custom hook encapsulating all Reels feed state, pagination,
 * and user interactions (mute, like optimistic updates).
 */
export function useReelsFeed(): UseReelsFeedReturn {
    const initialData = useLoaderData<ReelsResponse>();

    const [reels, setReels] = useState<Reel[]>(initialData?.reels || []);
    const [nextCursor, setNextCursor] = useState<string | null>(
        initialData?.nextCursor ?? null
    );
    const [hasMore, setHasMore] = useState<boolean>(initialData?.hasMore ?? false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetcher = useFetcher<ReelsResponse>();
    const isLoadingMore = fetcher.state === "loading";
    const loadedCursorsRef = useRef<Set<string>>(new Set());

    // Append new reels from fetcher
    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.reels && fetcher.data.reels.length > 0) {
                setReels((prev) => {
                    const existingIds = new Set(prev.map((r) => r.id));
                    const newReels = fetcher.data!.reels.filter(
                        (r) => !existingIds.has(r.id)
                    );
                    return [...prev, ...newReels];
                });
                setNextCursor(fetcher.data.nextCursor ?? null);
                setHasMore(fetcher.data.hasMore ?? false);
                setError(null);
            } else {
                setHasMore(false);
            }
        }
    }, [fetcher.data]);

    // Track fetcher errors
    useEffect(() => {
        if (fetcher.state === "idle" && (fetcher as any).error) {
            setError("فشل تحميل المزيد من الريلز");
        }
    }, [fetcher.state]);

    // Auto-fetch when approaching the end of the list
    useEffect(() => {
        if (
            hasMore &&
            !isLoadingMore &&
            nextCursor &&
            activeIndex >= reels.length - 2
        ) {
            if (!loadedCursorsRef.current.has(nextCursor)) {
                loadedCursorsRef.current.add(nextCursor);
                fetcher.load(`/reels?cursor=${nextCursor}&index`);
            }
        }
    }, [activeIndex, reels.length, hasMore, isLoadingMore, nextCursor]);

    // Update title and URL on active reel change
    useEffect(() => {
        if (typeof window === "undefined") return;
        const currentReel = reels[activeIndex];
        if (!currentReel) return;

        const title = currentReel.caption
            ? `${currentReel.caption.substring(0, 60)}${currentReel.caption.length > 60 ? "..." : ""} | الثورة`
            : "ريلز | الثورة";
        document.title = title;

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("reelId", currentReel.id);
        window.history.replaceState({}, "", newUrl.toString());
    }, [activeIndex, reels]);

    const toggleMute = useCallback(() => {
        setIsMuted((prev) => !prev);
    }, []);

    const updateReel = useCallback((id: string, partial: Partial<Reel>) => {
        setReels((prev) =>
            prev.map((r) => (r.id === id ? { ...r, ...partial } : r))
        );
    }, []);

    const retry = useCallback(() => {
        if (nextCursor) {
            loadedCursorsRef.current.delete(nextCursor);
            setError(null);
            fetcher.load(`/reels?cursor=${nextCursor}&index`);
        }
    }, [nextCursor]);

    return {
        reels,
        activeIndex,
        setActiveIndex,
        hasMore,
        isLoadingMore,
        error,
        isMuted,
        toggleMute,
        updateReel,
        retry,
    };
}
