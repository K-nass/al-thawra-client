import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import type { HandleChangeType } from "./types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const apiUrl = import.meta.env.VITE_API_URL;

interface UploadResponse {
    url: string;
    fileName?: string;
    sizeInBytes?: number;
    mimeType?: string;
    duration?: string;
}

interface MediaItem {
    id: string;
    url: string;
    fileName: string;
    type: string;
    sizeInBytes: number;
    mimeType: string;
    uploadedAt: string;
    duration?: string | number;
}

interface MediaResponse {
    items: MediaItem[];
    totalCount: number;
}

export type MediaType = "images" | "additional images" | "files" | "video" | "audio";

interface FileModalProps {
    onClose: () => void;
    header: MediaType;
    handleChange: HandleChangeType;
}

export default function FileModal({ onClose, header, handleChange }: FileModalProps) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);

    // Helper function to format duration
    const formatDuration = (duration: string | number | null | undefined): string => {
        if (!duration) return "";
        
        // If it's a number (seconds), convert to readable format
        if (typeof duration === "number") {
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            const seconds = Math.floor(duration % 60);
            
            if (hours > 0) {
                return `${hours}h ${minutes}m ${seconds}s`;
            } else if (minutes > 0) {
                return `${minutes}m ${seconds}s`;
            } else {
                return `${seconds} seconds`;
            }
        }
        
        // If it's a string like "00:00:42.0571428", parse it
        if (typeof duration === "string") {
            const parts = duration.split(":");
            if (parts.length === 3) {
                const hours = parseInt(parts[0]);
                const minutes = parseInt(parts[1]);
                const seconds = Math.floor(parseFloat(parts[2]));
                
                if (hours > 0) {
                    return `${hours}h ${minutes}m ${seconds}s`;
                } else if (minutes > 0) {
                    return `${minutes}m ${seconds}s`;
                } else {
                    return `${seconds} seconds`;
                }
            }
        }
        
        return String(duration);
    };

    // Determine upload endpoint and media type based on header
    const getUploadEndpoint = () => {
        if (header === "video") return "/media/upload-video";
        if (header === "audio") return "/media/upload-audio";
        return "/media/upload-image";
    };

    const getMediaTypeFilter = () => {
        if (header === "video") return "Video";
        if (header === "audio") return "Audio";
        return "Image";
    };

    // --- Upload Mutation ---
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("File", file);
            const response = await axios.post<UploadResponse>(
                `${apiUrl}${getUploadEndpoint()}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            return response.data;
        },
    });

    // --- Get Media Query (useQuery is better for GET requests) ---
    // Using useQuery with enabled: true so it fetches once when component mounts
    // and uses React Query's built-in caching to prevent duplicate requests
    const { data: mediaData, isLoading: isLoadingMedia, refetch: refetchMedia } = useQuery<MediaResponse>({
        queryKey: ["media", getMediaTypeFilter()],
        queryFn: async () => {
            const response = await axios.get<MediaResponse>(`${apiUrl}/media`, {
                params: {
                    Type: getMediaTypeFilter(),
                },
            });
            return response.data;
        },
        staleTime: 30000, // Cache for 30 seconds - prevents refetching if data is fresh
        gcTime: 5 * 60 * 1000, // Keep cache for 5 minutes
    });

    const mediaList = mediaData?.items ?? [];

    // --- Show Modal Animation ---
    useEffect(() => {
        setTimeout(() => setShowModal(true), 10);
    }, []); // Only run once on mount

    // --- Upload Handler ---
    async function handleFiles(filesList: FileList | null) {
        if (!filesList || filesList.length === 0) return;

        try {
            const files = Array.from(filesList);
            const uploadPromises = files.map((file) => uploadMutation.mutateAsync(file));
            const results = await Promise.all(uploadPromises);
            
            // Use the full URL exactly as returned from upload endpoint
            const uploadedUrls = results.map((r) => {
                return r.url;
            });

            const fieldName =
                header === "images"
                    ? "imageUrl"
                    : header === "additional images"
                        ? "additionalImageUrls"
                        : header === "video"
                            ? "videoUrl"
                            : header === "audio"
                                ? "audioUrl"
                                : "fileUrls";

            const value = (header === "images" || header === "video" || header === "audio") ? uploadedUrls[0] : uploadedUrls;
            
            // For audio/video, include all upload details in the payload
            const payload = {
                target: {
                    name: fieldName,
                    value,
                    type: "text",
                    // Include upload response details for audio/video
                    ...(header === "audio" || header === "video" ? {
                        fileName: results[0]?.fileName || "",
                        sizeInBytes: results[0]?.sizeInBytes || 0,
                        mimeType: results[0]?.mimeType || "",
                        duration: results[0]?.duration || null,
                    } : {}),
                },
            };

            handleChange(payload);
            // Refetch media after successful upload
            void refetchMedia();
            setShowModal(false);
            setTimeout(onClose, 180);
        } catch (err) {
            alert("Failed to upload files. Please try again.");
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
            <div
                className={`bg-white w-full max-w-5xl max-h-[90vh] rounded-lg shadow-lg transform transition-all duration-500 ease-out flex flex-col ${showModal ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
                    }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-3 sm:p-4 border-b">
                    <h2 className="text-base sm:text-lg font-semibold capitalize">{header}</h2>
                    <button
                        type="button"
                        onClick={() => {
                            setShowModal(false);
                            setTimeout(onClose, 180);
                        }}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        <FontAwesomeIcon icon={faXmark} className="cursor-pointer" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-3 sm:p-4">
                    <input
                        type="text"
                        placeholder={`Search ${header}...`}
                        className="w-full rounded-md p-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Upload Area */}
                <div className="p-4 sm:p-6 rounded-md text-center mx-2 sm:mx-4 my-2 sm:my-4 bg-gray-50">
                    <p className="text-sm text-gray-500 mb-2">
                        {header === "video" ? "MP4, WebM, Ogg" : header === "audio" ? "MP3, WAV, OGG, WebM" : "JPG, JPEG, WEBP, PNG, GIF"}
                    </p>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="bg-gray-100 p-4 rounded-full">
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 16v-8m0 0l-3 3m3-3l3 3m4 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4m14 0a2 2 0 00-2-2H7a2 2 0 00-2 2"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-sm">
                            {uploadMutation.isPending ? "Uploading..." : "Drag and drop files here or"}
                        </p>
                        <input
                            type="file"
                            multiple={header !== "images" && header !== "video" && header !== "audio"}
                            accept={
                                header === "video"
                                    ? "video/mp4,video/webm,video/ogg"
                                    : header === "audio"
                                        ? "audio/mpeg,audio/wav,audio/ogg,audio/webm"
                                        : "image/*"
                            }
                            className="text-center text-sm px-3 py-2 bg-[#605CA8] text-white rounded hover:bg-indigo-700 cursor-pointer"
                            onChange={(e) => void handleFiles(e.target.files)}
                            disabled={uploadMutation.isPending}
                        />

                        {uploadMutation.isError && (
                            <p className="text-xs text-red-500 mt-2">
                                Upload failed. Please try again.
                            </p>
                        )}
                    </div>
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 px-3 sm:px-6 pb-4 sm:pb-6 overflow-y-auto flex-1 max-h-96">
                    {isLoadingMedia ? (
                        <p className="col-span-2 sm:col-span-3 md:col-span-4 text-center text-gray-500 text-sm sm:text-base">{t('common.loading')}</p>
                    ) : mediaList.length === 0 ? (
                        <p className="col-span-2 sm:col-span-3 md:col-span-4 text-center text-gray-500 text-sm sm:text-base">{t('common.noItems')}</p>
                    ) : (
                        mediaList.map((item) => {
                            const fieldName =
                                header === "images"
                                    ? "imageUrl"
                                    : header === "additional images"
                                        ? "additionalImageUrls"
                                        : header === "video"
                                            ? "videoUrl"
                                            : header === "audio"
                                                ? "audioUrl"
                                                : "fileUrls";

                            const handleSelectMedia = () => {
                                const value = (header === "images" || header === "video" || header === "audio") ? item.url : [item.url];
                                const payload = {
                                    target: {
                                        name: fieldName,
                                        value,
                                        type: "text",
                                    },
                                };
                                handleChange(payload);
                                setShowModal(false);
                                setTimeout(onClose, 180);
                            };

                            // For images, show thumbnail
                            if (header === "images" || header === "additional images") {
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={handleSelectMedia}
                                        className="relative cursor-pointer rounded overflow-hidden group"
                                    >
                                        <img
                                            src={item.url}
                                            alt={item.fileName}
                                            className="w-full h-32 object-cover rounded-md hover:opacity-80 transition"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition text-xs font-semibold">Select</span>
                                        </div>
                                    </button>
                                );
                            }

                            // For video, audio, and files - show file info with all details
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={handleSelectMedia}
                                    className="relative cursor-pointer rounded overflow-hidden group bg-gray-100 p-3 flex flex-col items-start justify-start hover:bg-gray-200 transition h-auto"
                                >
                                    <div className="flex items-center gap-2 mb-2 w-full">
                                        <div className="text-2xl">
                                            {header === "video" ? "🎬" : header === "audio" ? "🎵" : "📄"}
                                        </div>
                                        <p className="text-xs font-semibold text-gray-700 truncate flex-1">
                                            {item.fileName}
                                        </p>
                                    </div>
                                    <div className="w-full space-y-1 text-xs text-gray-600">
                                        {item.sizeInBytes && (
                                            <p className="truncate">
                                                <span className="font-medium">Size:</span> {(item.sizeInBytes / 1024).toFixed(2)} KB
                                            </p>
                                        )}
                                        {item.mimeType && (
                                            <p className="truncate">
                                                <span className="font-medium">Type:</span> {item.mimeType}
                                            </p>
                                        )}
                                        {item.duration && (
                                            <p className="truncate">
                                                <span className="font-medium">Duration:</span> {formatDuration(item.duration)}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-3 sm:p-4 border-t">
                    <button
                        type="button"
                        onClick={() => {
                            setShowModal(false);
                            setTimeout(onClose, 180);
                        }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-200 rounded hover:bg-gray-300"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        </div>
    );
}
