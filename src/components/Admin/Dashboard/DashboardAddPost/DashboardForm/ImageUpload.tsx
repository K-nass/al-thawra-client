import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ArticleInitialStateInterface, GalleryInitialStateInterface, SortedListInitialStateInterface } from "./usePostReducer/postData";
import { useState, type ChangeEvent } from "react";
import FileModal from "./FileModal";

interface ImageUploadProps {
  state: ArticleInitialStateInterface | GalleryInitialStateInterface | SortedListInitialStateInterface,
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | {
      target: {
        name: string;
        value: string | string[];
        type: string;
      };
    }
  ) => void,
  errors?: Record<string, string>,
}

export default function ImageUpload({ state, handleChange, errors = {} }: ImageUploadProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-slate-200 space-y-3 sm:space-y-4" data-error-field={errors.imageUrl ? true : undefined}>
      <h3 className="text-base font-semibold  ">Image</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 -mt-2">
        Main post image
      </p>
      <div className="border-2 border-dashed border-slate-300  rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <span className="material-icons-sharp text-5xl text-slate-400 dark:text-slate-500">
          <FontAwesomeIcon icon={faImage} />
        </span>
        <button 
          type="button"
          className="mt-2 text-sm px-3 py-1.5 border border-slate-300  rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          onClick={() => setOpen(true)}
        >
          Select Image
        </button>
      </div>
      {open && <FileModal onClose={() => setOpen(false)} header="images" handleChange={handleChange} />}
      <p className="text-center text-sm text-slate-500">or Add Image Url</p>
      <input
        className={`w-full text-sm bg-slate-50 border rounded focus:ring-primary focus:border-primary p-2 ${
          errors.imageUrl ? 'border-red-500' : 'border-slate-300'
        }`}
        placeholder="Add Image Url"
        type="text"
        name="imageUrl"
        value={state.imageUrl}
        onChange={handleChange}
      />
      {errors.imageUrl && (
        <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>
      )}
      <input
        className="w-full text-sm bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary p-2"
        placeholder="Image Description"
        type="text"
        name="imageDescription"
        value={Array.isArray(state.imageDescription) ? "" : (state.imageDescription ?? "")}
        onChange={handleChange}
      />
    </div>
  );
}
