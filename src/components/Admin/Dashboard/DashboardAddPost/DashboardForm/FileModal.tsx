import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import type { HandleChangeType } from "./types";
import { useMutation, useQuery } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL;

interface UploadResponse {
    url: string;
}

interface MediaItem {
    id: string;
    url: string;
    fileName: string;
    type: string;
    sizeInBytes: number;
    mimeType: string;
    uploadedAt: string;
}

interface MediaResponse {
    items: MediaItem[];
    totalCount: number;
}

interface FileModalProps {
    onClose: () => void;
    header: "images" | "additional images" | "files";
    handleChange: HandleChangeType;
}

export default function FileModal({ onClose, header, handleChange }: FileModalProps) {
    const [showModal, setShowModal] = useState(false);

    // --- Upload Mutation ---
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("File", file);
            const response = await axios.post<UploadResponse>(
                `${apiUrl}/media/upload-image`,
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
        queryKey: ["media"],
        queryFn: async () => {
            const response = await axios.get<MediaResponse>(`${apiUrl}/media`);
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
            const uploadedUrls = results.map((r) => r.url);

            const fieldName =
                header === "images"
                    ? "imageUrl"
                    : header === "additional images"
                        ? "additionalImageUrls"
                        : "fileUrls";

            const value = header === "images" ? uploadedUrls[0] : uploadedUrls;
            const payload = {
                target: {
                    name: fieldName,
                    value,
                    type: "text",
                },
            };

            handleChange(payload);
            // Refetch media after successful upload
            void refetchMedia();
            setShowModal(false);
            setTimeout(onClose, 180);
        } catch (err) {
            console.error("File upload error:", err);
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
                        placeholder="Search images..."
                        className="w-full rounded-md p-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Upload Area */}
                <div className="p-4 sm:p-6 rounded-md text-center mx-2 sm:mx-4 my-2 sm:my-4 bg-gray-50">
                    <p className="text-sm text-gray-500 mb-2">JPG, JPEG, WEBP, PNG, GIF</p>
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
                            multiple={header !== "images"}
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

                {/* Image Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 px-3 sm:px-6 pb-4 sm:pb-6 overflow-y-auto flex-1 max-h-96">
                    {isLoadingMedia ? (
                        <p className="col-span-2 sm:col-span-3 md:col-span-4 text-center text-gray-500 text-sm sm:text-base">Loading images...</p>
                    ) : mediaList.length === 0 ? (
                        <p className="col-span-2 sm:col-span-3 md:col-span-4 text-center text-gray-500 text-sm sm:text-base">No media found.</p>
                    ) : (
                        mediaList.map((item) => (
                            <div key={item.id} className="relative cursor-pointer rounded overflow-hidden">
                                <img
                                    src={item.url}
                                    alt={item.fileName}
                                    className="w-full h-32 object-cover rounded-md hover:opacity-80 transition"
                                />
                            </div>
                        ))
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
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
