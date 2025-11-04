import {
  faB,
  faCode,
  faItalic,
  faList,
  faListOl,
  faStrikethrough,
  faUnderline,
  faCheck,
  faQuoteLeft,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faPalette,
  faPaintBrush,
  faLink,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ArticleInitialStateInterface } from "./usePostReducer/postData";
import type { ChangeEvent } from "react";

const icons = [
  faB,
  faItalic,
  faUnderline,
  faCode,
  faStrikethrough,
  faList,
  faListOl,
  faCheck,
  faQuoteLeft,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faPalette,
  faPaintBrush,
  faLink,
];

interface ContentEditorProps {
  state: ArticleInitialStateInterface,
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void,
  errors?: Record<string, string>,
}

export default function ContentEditor({ state, handleChange, errors = {} }: ContentEditorProps) {
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden" data-error-field={errors.content ? true : undefined}>
      <div className="p-2 border-b border-gray-200 flex flex-wrap items-center gap-1">
        {icons.map((icon, idx) => (
          <ToolBarItem key={idx} icon={icon} />
        ))}

        <div className="w-px h-6 bg-gray-200 mx-1" />
      </div>

      <div className="p-4">
        <textarea
          className={`w-full h-96 focus:ring-0 resize-none p-0 border-0 ${
            errors.content ? 'bg-red-50' : ''
          }`}
          placeholder="Start writing your content here..."
          name="content"
          value={state.content}
          onChange={handleChange}
        />
      </div>
      {errors.content && (
        <p className="text-red-500 text-xs mt-1 px-4 pb-2">{errors.content}</p>
      )}
    </div>
  );
}

function ToolBarItem({ icon }: { icon: IconDefinition }) {
  return (
    <button className="p-2 rounded hover:bg-gray-100  text-gray-600 ">
      <span className="material-symbols-outlined text-xl">
        <FontAwesomeIcon icon={icon} />
      </span>
    </button>
  );
}
