import { useState } from "react";
import type { HandleChangeType } from "./types";
import type { ArticleInitialStateInterface } from "./usePostReducer/postData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import type { ApiValidationError } from './types';

const apiUrl = import.meta.env.VITE_API_URL;

export interface TagInterface {
  id: string; 
  language: string;
  name: string;
  postsCount: number;
}
interface PostDetailsForm {
  state: ArticleInitialStateInterface;
  handleChange: HandleChangeType;
  isLoading: boolean;
  tags: TagInterface[];
  errors?: ApiValidationError['errors'];
}


export default function PostDetailsForm({ 
  state, 
  handleChange, 
  tags,
  errors 
}: PostDetailsForm) {
  // store selected tags as objects so we preserve id + name
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string }[]>([]);
  const [inputValue, setInputValue] = useState("");

  // use react-query mutation to create tags on server
  const createTagMutation = useMutation({
    mutationFn: async (name: string) => {
      const payload = {
        tags: [
          {
            name,
            language: "English",
          },
        ],
      };
      const res = await axios.post(`${apiUrl}/tags`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      // according to your example the API returns an array of created tags
      return res.data as Array<{ id: string; name: string; language?: string }>;
    },
  });

  // adds an existing tag (from tags list) by id
  const handleAddExistingTag = (tag: TagInterface) => {
    if (selectedTags.find((t) => t.id === tag.id)) return;
    const newSelected = [...selectedTags, { id: tag.id, name: tag.name }];
    setSelectedTags(newSelected);
    const ids = newSelected.map((t) => t.id);
    const syntheticEvent = { target: { name: "tagIds", value: ids, type: "text" } } as Parameters<HandleChangeType>[0];
    handleChange(syntheticEvent, ids);
    setInputValue("");
  };

  // adds a tag typed by the user: create it on server then add
  const handleAddTag = async (tagName: string) => {
    if (!tagName) return;
    // if an existing tag with same name exists, add that one
    const existing = tags.find((t) => t.name.toLowerCase() === tagName.toLowerCase());
    if (existing) {
      handleAddExistingTag(existing);
      return;
    }

    try {
      const created = await createTagMutation.mutateAsync(tagName);
      // created is expected to be an array; pick first created item's id
      const createdItem = Array.isArray(created) ? created[0] : created;
      const createdId: string | undefined = createdItem?.id ?? createdItem?.data?.id;
      if (!createdId) throw new Error("Tag creation returned no id");

      const newSelected = [...selectedTags, { id: createdId, name: tagName }];
      setSelectedTags(newSelected);
      const ids = newSelected.map((t) => t.id);
      const syntheticEvent = { target: { name: "tagIds", value: ids, type: "text" } } as Parameters<HandleChangeType>[0];
      handleChange(syntheticEvent, ids)
    } catch (err) {
      console.error("Failed to create tag", err);
    } finally {
      setInputValue("");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      void handleAddTag(inputValue.trim());
    }
  };

  const handleRemoveTag = (id: string) => {
    const newSelected = selectedTags.filter((t) => t.id !== id);
    setSelectedTags(newSelected);
    const ids = newSelected.map((t) => t.id);
    const syntheticEvent = { target: { name: "tagIds", value: ids, type: "text" } } as Parameters<HandleChangeType>[0];
    handleChange(syntheticEvent, ids);
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
                key={tag.id}
                className="bg-primary px-2 py-1 rounded cursor-pointer"
                title="Click to remove"
              >
                {tag.name}
                <FontAwesomeIcon icon={faXmark} className="ml-1 text-sm hover:text-red-400" onClick={() => handleRemoveTag(tag.id)} />
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
                className={`px-3 p-2 rounded font-semibold cursor-pointer ${selectedTags.find((t) => t.id === tag.id)
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddExistingTag(tag);
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Optional URL */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="optional-url">
            Optional URL
          </label>
          <input
            className={`w-full bg-slate-50 border ${
              errors?.OptionalURL ? 'border-red-500' : 'border-slate-300'
            } rounded focus:ring-primary focus:border-primary p-2`}
            id="optional-url"
            name="optionalURL"
            placeholder="Enter URL (http:// will be added if missing)"
            type="url"
            value={state.optionalURL ?? ''}
            onChange={handleChange}
          />
        </div>

        {/* URL Validation Errors Section */}

      </div>
    </div>
  );
}
