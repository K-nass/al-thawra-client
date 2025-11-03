import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import type { HandleChangeType } from "./types";
import { useMutation } from "@tanstack/react-query";

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
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);

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

    // --- Get Media Mutation ---
    const getMediaMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.get<MediaResponse>(`${apiUrl}/media`);
            return response.data;
        },
        onSuccess: (data) => {
            setMediaList(data.items);
        },
        onError: (error) => {
            console.error("Failed to fetch media:", error);
        },
    });

    // --- Show Modal Animation & Fetch Media ---
    useEffect(() => {
        setTimeout(() => setShowModal(true), 10);
        getMediaMutation.mutate(); // fetch media on modal open
    }, []);

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
            setShowModal(false);
            setTimeout(onClose, 180);
        } catch (err) {
            console.error("File upload error:", err);
            alert("Failed to upload files. Please try again.");
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
                className={`bg-white w-full max-w-5xl rounded-lg shadow-lg transform transition-all duration-500 ease-out ${showModal ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
                    }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-semibold capitalize">{header}</h2>
                    <button
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
                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Search images..."
                        className="w-full rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Upload Area */}
                <div className="p-6 rounded-md text-center mx-4 my-4 bg-gray-50">
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
                            {uploadMutation.isLoading ? "Uploading..." : "Drag and drop files here or"}
                        </p>
                        <input
                            type="file"
                            multiple={header !== "images"}
                            className="text-center text-sm px-3 py-2 bg-[#605CA8] text-white rounded hover:bg-indigo-700 cursor-pointer"
                            onChange={(e) => void handleFiles(e.target.files)}
                            disabled={uploadMutation.isLoading}
                        />

                        {uploadMutation.isError && (
                            <p className="text-xs text-red-500 mt-2">
                                Upload failed. Please try again.
                            </p>
                        )}
                    </div>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-4 gap-4 px-6 pb-6 overflow-y-auto max-h-96">
                    {getMediaMutation.isLoading ? (
                        <p className="col-span-4 text-center text-gray-500">Loading images...</p>
                    ) : mediaList.length === 0 ? (
                        <p className="col-span-4 text-center text-gray-500">No media found.</p>
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
                <div className="flex justify-end p-4 cursor-pointer">
                    <button
                        onClick={() => {
                            setShowModal(false);
                            setTimeout(onClose, 180);
                        }}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
