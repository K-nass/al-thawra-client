import { useLocation, useNavigate } from "react-router-dom";
import FormHeader from "./FormHeader";
import PostDetailsForm, { type TagInterface } from "./PostDetailsForm";
import ContentEditor from "./ContentEditor";
import GalleryItems from "./GalleryItems";
import SortedListItems from "./SortedListItems";

import AdditionalImages from "./AdditionalImages";
import FileUpload from "./FileUpload";
import CategorySelect from "./CategorySelect";
import PublishSection from "./PublishSection";
import ImageUpload from "./ImageUpload";
import { useEffect, type ChangeEvent, useState } from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import ApiNotification from "../../../../Common/ApiNotification";
import { usePostReducer } from "./usePostReducer/usePostReducer";
import type { ArticleInitialStateInterface, GalleryInitialStateInterface, SortedListInitialStateInterface } from "./usePostReducer/postData";
import { postConfig } from "./usePostReducer/postConfig";
const apiUrl = import.meta.env.VITE_API_URL;
interface TagResponse {
  data: {
    items: TagInterface[]
  }
}


export default function DashboardForm() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const type = query.get("type");
  const navigate = useNavigate();
  const [state, dispatch] = usePostReducer(type);

  useEffect(() => {
    if (!type) {
      navigate("/admin/post-format");
    }
  }, [type, navigate]);

  console.log(state);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  type CustomChangeEvent =
    | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    | {
      target: {
        name: string;
        value: string | string[] | any;
        type: string;
        checked?: boolean;
      };
    };

  function handleChange(e: CustomChangeEvent, newTags?: string[]) {
    const { type, value, name } = e.target;
    let payload: string | boolean | string[] | object[] | undefined = value;

    if ('checked' in e.target && type === "checkbox") {
      payload = e.target.checked;
    }
    else if (type === "radio" && (value === "true" || value === "false")) {
      payload = value === "true";
    }
    else if (name === "tagIds" && newTags) {
      payload = newTags;
    }
    // Handle items array (for gallery)
    else if (name === "items" && Array.isArray(value)) {
      payload = value;
    }

    dispatch({ type: "set-field", field: name, payload });
    
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    // Clear nested item errors when items array changes
    if (name === "items" && Array.isArray(value)) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        Object.keys(newErrors).forEach(key => {
          if (key.startsWith('items.')) {
            delete newErrors[key];
          }
        });
        if (newErrors.items) delete newErrors.items;
        return newErrors;
      });
    }
  }

  // helpers: URL validation and state validation
  function isValidUrl(u: unknown): boolean {
    if (typeof u !== "string" || !u) return false;
    if (u.startsWith("blob:") || u.startsWith("data:")) return false;
    try {
      const url = new URL(u);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  function validateStateBeforeSubmit(s: ArticleInitialStateInterface | GalleryInitialStateInterface | SortedListInitialStateInterface) {
    const errors: Record<string, string> = {};
    
    // Required fields
    if (!s.title?.trim()) errors.title = "Title is required";
    if (!s.categoryId) errors.categoryId = "Category is required";
    
    // Image validations
    if (!s.imageUrl || !isValidUrl(s.imageUrl)) {
      errors.imageUrl = "Main image URL is required and must be a valid http(s) URL";
    }
    
    // Article-specific validations
    if ('content' in s && type === "article") {
      const articleState = s as ArticleInitialStateInterface;
      if (!articleState.content || articleState.content.trim().length < 50) {
        errors.content = "Content must be at least 50 characters";
      }
      
      // Additional Images validation
      if (articleState.additionalImageUrls?.length) {
        const invalidAdditionalImages = articleState.additionalImageUrls.filter(url => !isValidUrl(url));
        if (invalidAdditionalImages.length) {
          errors.additionalImageUrls = "All additional image URLs must be valid http(s) URLs";
        }
      }
      
      // File URLs validation
      if (articleState.fileUrls?.length) {
        const fileUrlsArray = Array.isArray(articleState.fileUrls) ? articleState.fileUrls : [articleState.fileUrls];
        const invalidFiles = fileUrlsArray.filter((url: string) => !isValidUrl(url));
        if (invalidFiles.length) {
          errors.fileUrls = "All file URLs must be valid http(s) URLs";
        }
      }
    }
    
    // Gallery-specific validations
    if ('items' in s && type === "gallery") {
      const galleryState = s as GalleryInitialStateInterface;
      if (!galleryState.items || galleryState.items.length === 0) {
        errors.items = "At least one gallery item is required";
      } else {
        galleryState.items.forEach((item, index) => {
          if (!item.title?.trim()) {
            errors[`items.${index}.title`] = "Title is required";
          }
          if (!item.imageUrl || !isValidUrl(item.imageUrl)) {
            errors[`items.${index}.imageUrl`] = "Image URL is required and must be a valid http(s) URL";
          }
        });
      }
    }
    
    // Sorted-list-specific validations
    if ('items' in s && type === "sorted-list") {
      const sortedListState = s as SortedListInitialStateInterface;
      if (!sortedListState.items || sortedListState.items.length === 0) {
        errors.items = "At least one sorted list item is required";
      } else {
        sortedListState.items.forEach((item, index) => {
          if (!item.title?.trim()) {
            errors[`items.${index}.title`] = "Title is required";
          }
          if (!item.imageUrl || !isValidUrl(item.imageUrl)) {
            errors[`items.${index}.imageUrl`] = "Image URL is required and must be a valid http(s) URL";
          }
        });
      }
    }
    
    // Optional URL validation
    if (s.optionalURL && !isValidUrl(s.optionalURL)) {
      errors.optionalURL = "Optional URL must be a valid http(s) URL";
    }

    // Tag IDs validation - only validate if there are tag IDs and any are invalid
    if (s.tagIds && s.tagIds.length > 0) {
      const invalidTagIds = s.tagIds.filter(id => !id || (typeof id === 'string' && !id.trim()));
      if (invalidTagIds.length > 0) {
        errors.tagIds = "All tag IDs must be valid";
      }
    }

    return errors;
  }

  async function fetchTags() {
    return await axios.get(`${apiUrl}/tags`);
  }

  const { data: tags, isLoading: isLoadingTags } = useQuery<TagResponse>({
    queryKey: ["tags"],
    queryFn: fetchTags,
  })

  async function fetchCategories() {
    return await axios.get(`${apiUrl}/categories`)
  }

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  })

  // mutation accepts payload and uses payload.categoryId for the route
  const mutation = useMutation({
    // use state from closure so callers can call mutate() without args
    mutationFn: async () => {
      const payload = state as ArticleInitialStateInterface | GalleryInitialStateInterface | SortedListInitialStateInterface;
      const categoryId = payload.categoryId;
      if (!categoryId) throw new Error("categoryId missing");
      if (!type) throw new Error("Post type is required");
      
      const config = postConfig[type as keyof typeof postConfig];
      if (!config) throw new Error(`Unknown post type: ${type}`);
      
      const endpoint = config.endpoint;
      const response = await axios.post(`${apiUrl}/posts/categories/${categoryId}/${endpoint}`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      const msg = (data && (data.message || data.title)) ?? "Post created successfully";
      setNotification({ type: "success", message: String(msg) });
      console.log("Post created successfully:", data);
    },
    onError: (error: unknown) => {
      let message = "Failed to create post";
      if (axios.isAxiosError(error)) {
        const d = error.response?.data;
        if (d?.title) message = String(d.title);
        else if (d?.message) message = String(d.message);
        else if (d?.errors) message = JSON.stringify(d.errors);
        else message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      setNotification({ type: "error", message });
      console.error("Error creating post:", error);
    },
  });

  // #505458 new color i will use for form
  return (
    <>
      {notification && (
        <ApiNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form
        className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const errors = validateStateBeforeSubmit(state as ArticleInitialStateInterface | GalleryInitialStateInterface | SortedListInitialStateInterface);
          setFieldErrors(errors);
          if (Object.keys(errors).length > 0) {
            // Scroll to first error
            const firstErrorField = document.querySelector('[data-error-field]');
            if (firstErrorField) {
              firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
          }
          // Clear errors and submit
          setFieldErrors({});
          mutation.mutate();
        }}
      >
        <FormHeader type={type} />
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <div className="grow space-y-4 md:space-y-6">
            {/* left column */}
            <PostDetailsForm type = {type} state={state} handleChange={handleChange} tags={tags?.data.items ?? []} isLoading={isLoadingTags} fieldErrors={fieldErrors} />
            {type === "gallery" ? (
              <GalleryItems state={state as GalleryInitialStateInterface} handleChange={handleChange} errors={fieldErrors} />
            ) : type === "sorted-list" ? (
              <SortedListItems state={state as SortedListInitialStateInterface} handleChange={handleChange} errors={fieldErrors} />
            ) : (
              <ContentEditor state={state as ArticleInitialStateInterface} handleChange={handleChange} errors={fieldErrors} />
            )}
          </div>
          <div className="w-full lg:w-80 lg:shrink-0 space-y-4 md:space-y-6">
            {/* right column */}
            <ImageUpload state={state} handleChange={handleChange} errors={fieldErrors} />
            {type !== "gallery" && type !== "sorted-list" && (
              <>
                <AdditionalImages handleChange={handleChange} />
                <FileUpload handleChange={handleChange} />
              </>
            )}
            <CategorySelect
              handleChange={handleChange}
              categories={categories?.data ?? []}
              isLoading={isLoadingCategories}
              value={state.categoryId}
              errors={fieldErrors}
            />
            <PublishSection mutation={mutation} />
          </div>
        </div>
      </form>
    </>
  );
}
