import { useState, type ChangeEvent } from "react";
import type { ArticleInitialStateInterface } from "./usePostReducer/postData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export interface TagInterface {
  id: string,
  language: string,
  name: string
  postsCount: number
}
interface PostDetailsForm {
  state: ArticleInitialStateInterface,
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, newTags?: string[]) => void,
  isLoading: boolean,
  tags: TagInterface[]
}


export default function PostDetailsForm({ state, handleChange, tags }: PostDetailsForm) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      handleChange({ target: { name: "tagIds" } } as any, newTags);
    }
    setInputValue("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      handleAddTag(inputValue.trim());
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };
  return (
    <div className="bg-white  p-6 rounded-lg shadow-sm border border-slate-200 ">
      <h3 className="text-lg font-semibold border-b border-slate-200  pb-4 mb-6">
        Post Details
      </h3>

      <div className="space-y-6">
        {/* title */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            className="w-full bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary p-2"
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            value={state.title}
            onChange={handleChange}
          />
        </div>

        {/* slug */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="slug">
            Slug
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            If you leave it blank, it will be generated automatically.
          </p>
          <input
            className="w-full bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary p-2"
            type="text"
            id="slug"
            name="slug"
            placeholder="Slug"
            value={state.slug ?? ""}
            onChange={handleChange}
          />
        </div>

        {/* Meta Tag */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="summary">
            Summary &amp; Description (Meta Tag)
          </label>
          <textarea
            className="w-full bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary"
            id="summary"
            name="metaDescription"
            placeholder="Summary &amp; Description (Meta Tag)"
            value={state.metaDescription ?? ""}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* metaKeywords */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="keywords">
            Keywords (Meta Tag)
          </label>
          <input
            className="w-full bg-slate-50  border-slate-300  rounded focus:ring-primary focus:border-primary p-2"
            type="text"
            id="keywords"
            name="metaKeywords"
            placeholder="Keywords (Meta Tag)"
            value={state.metaKeywords ?? ""}
            onChange={handleChange}
          />
        </div>

        {/* {Visibility} */}
        <div>
          <label className="block text-sm font-medium mb-2">Visibility</label>
          <div className="flex items-center space-x-6">
            <label className="flex items-center" htmlFor="visibility-true">
              <input
                className="text-primary focus:ring-primary"
                name="visibility"
                type="radio"
                value="true"
                id="visibility-true"
                checked={state.visibility === true}
                onChange={handleChange}
              />
              <span className="ml-2">Show</span>
            </label>
            <label className="flex items-center" htmlFor="visibility-false">
              <input
                className="text-primary focus:ring-primary"
                name="visibility"
                type="radio"
                value="false"
                id="visibility-false"
                checked={state.visibility === false}
                onChange={handleChange}
              />
              <span className="ml-2">Hide</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Add to Slider */}
          <label className="flex items-center">
            <input
              className="rounded text-primary focus:ring-primary"
              name="addToSlider"
              type="checkbox"
              checked={state.addToSlider === true}
              onChange={handleChange}
            />
            <span className="ml-2">Add to Slider</span>
          </label>
          {/* Add to Featured */}
          <label className="flex items-center">
            <input
              className="rounded text-primary focus:ring-primary"
              name="addToFeatured"
              type="checkbox"
              checked={state.addToFeatured === true}
              onChange={handleChange}
            />
            <span className="ml-2">Add to Featured</span>
          </label>
          {/* Add to Breaking */}
          <label className="flex items-center">
            <input
              className="rounded text-primary focus:ring-primary"
              name="addToBreaking"
              type="checkbox"
              checked={state.addToBreaking === true}
              onChange={handleChange}
            />
            <span className="ml-2">Add to Breaking</span>
          </label>
          {/* Add to Recommended */}
          <label className="flex items-center">
            <input
              className="rounded text-primary focus:ring-primary"
              type="checkbox"
              name="addToRecommended"
              checked={state.addToRecommended === true}
              onChange={handleChange}
            />
            <span className="ml-2">Add to Recommended</span>
          </label>
          {/* Show Only to Registered Users */}
          <label className="flex items-center">
            <input
              className="rounded text-primary focus:ring-primary"
              type="checkbox"
              name="showOnlyToRegisteredUsers"
              checked={state.showOnlyToRegisteredUsers === true}
              onChange={handleChange}
            />
            <span className="ml-2">Show Only to Registered Users</span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="tags">
            Tags
          </label>

          <div className="flex flex-wrap items-center gap-2 border p-2 rounded bg-slate-50">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="bg-primary px-2 py-1 rounded cursor-pointer"
                
                title="Click to remove"
              >
                {tag}
                <FontAwesomeIcon icon={faXmark} className="ml-1 text-sm hover:text-red-400" onClick={() => handleRemoveTag(tag)} />
              </span>
            ))}

            <input
              className="flex-1 bg-transparent outline-none p-1"
              id="tags"
              name="tagIds"
              placeholder="Type tag and hit Enter"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                className={`px-3 p-2 rounded font-semibold cursor-pointer ${selectedTags.includes(tag.name)
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddTag(tag.name);
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Optional URL */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="optional-url"
          >
            Optional URL
          </label>
          <input
            className="w-full bg-slate-50 border-slate-300 rounded focus:ring-primary focus:border-primary p-2"
            id="optional-url"
            name="optionalURL"
            placeholder="Optional URL"
            type="text"
            value={state.optionalURL ?? ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
