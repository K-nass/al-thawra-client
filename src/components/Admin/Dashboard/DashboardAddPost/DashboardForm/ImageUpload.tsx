import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ArticleInitialStateInterface } from "./usePostReducer/postData";
import { useState, type ChangeEvent } from "react";
import FileModal from "./FileModal";

interface ImageUploadProps {
  state: ArticleInitialStateInterface,
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | {
      target: {
        name: string;
        value: string | string[];
        type: string;
      };
    }
  ) => void,
}

export default function ImageUpload({ state, handleChange }: ImageUploadProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white  p-4 rounded-lg shadow-sm border border-slate-200  space-y-4">
      <h3 className="text-base font-semibold  ">Image</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 -mt-2">
        Main post image
      </p>
      <div className="border-2 border-dashed border-slate-300  rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <span className="material-icons-sharp text-5xl text-slate-400 dark:text-slate-500">
          <FontAwesomeIcon icon={faImage} />
        </span>
        <button className="mt-2 text-sm px-3 py-1.5 border border-slate-300  rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          onClick={() => setOpen(true)}>
          Select Image
        </button>
      </div>
      {open && <FileModal onClose={() => setOpen(false)} header="images" handleChange={handleChange} />}
      <p className="text-center text-sm text-slate-500">or Add Image Url</p>
      <input
        className="w-full text-sm bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary p-2"
        placeholder="Add Image Url"
        type="text"
        name="imageUrl"
        value={state.imageUrl}
        onChange={handleChange}
      />
      <input
        className="w-full text-sm bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary p-2"
        placeholder="Image Description"
        type="text"
        name="imageDescription"
        value={state.imageDescription ?? ""}
        onChange={handleChange}
      />
    </div>
  );
}
