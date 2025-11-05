import { useState } from "react";
import FileModal from "./FileModal";
import type { HandleChangeType } from "./types";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

interface AdditionalImagesProps {
  handleChange: HandleChangeType;
}

export default function AdditionalImages({ handleChange }: AdditionalImagesProps) {
  const [open, setOpen] = useState(false);

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("files", file);
    const res = await axios.post(`${apiUrl}/uploads`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const d = res.data;
    if (Array.isArray(d)) return d[0]?.url ?? d[0]?.id ?? "";
    return d?.url ?? d?.data?.url ?? "";
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 space-y-3">
      <h3 className="text-base font-semibold">Additional Images</h3>
      <p className="text-sm text-slate-500">
        More main images (slider will be active)
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-sm px-3 py-2 bg-[#605CA8] text-white rounded hover:bg-indigo-700 cursor-pointer"
      >
        Select Image
      </button>
      {open && (
        <FileModal
          onClose={() => setOpen(false)}
          header="additional images"
          handleChange={handleChange}
        />
      )}

      <label className="block mt-2">
        <input
          type="file"
          multiple
          className="w-full"
          onChange={async (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            const uploaded = await Promise.all(Array.from(files).map((f) => uploadFile(f)));
            const payload = { target: { name: "additionalImageUrls", value: uploaded, type: "text" } } as Parameters<HandleChangeType>[0];
            handleChange(payload);
          }}
        />
      </label>
    </div>
  );
}