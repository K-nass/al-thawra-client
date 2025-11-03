import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

export default function FileModal({ onClose, header }: { onClose: () => void,header:string }) {
    const [selected, setSelected] = useState<number | null>(null);
    const [fileName, setFileName] = useState<string>("");

    const images = [
        "https://picsum.photos/id/1018/400/300",
        "https://picsum.photos/id/1015/400/300",
        "https://picsum.photos/id/1019/400/300",
        "https://picsum.photos/id/1020/400/300",
        "https://picsum.photos/id/1021/400/300",
    ];

    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        setTimeout(() => setShowModal(true), 10);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
                className={`bg-white w-full max-w-5xl rounded-lg shadow-lg transform transition-all duration-500 ease-out ${showModal ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
                    }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-semibold">{header}</h2>
                    <button
                        onClick={onClose}
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
                        className="w-full  rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        <p className="text-gray-600 text-sm">Drag and drop files here or</p>
                        <label className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                            Browse Files
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFileName(file.name);
                                }}
                            />
                        </label>

                        {fileName && (
                            <p className="text-xs text-gray-700 mt-2">
                                Selected file: <span className="font-medium">{fileName}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-4 gap-4 px-6 pb-6 overflow-y-auto max-h-96">
                    {images.map((src, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelected(idx)}
                            className={`relative cursor-pointer rounded overflow-hidden ${selected === idx
                                ? "border-blue-500"
                                : "border-transparent hover:border-gray-300"
                                }`}
                        >
                            <img
                                src={src}
                                alt={`Image ${idx}`}
                                className="w-full h-32 object-cover"
                            />
                            {selected === idx && (
                                <div className="absolute inset-0 bg-blue-500/40 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-4 cursor-pointer">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

