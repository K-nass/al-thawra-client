import { useLocation, useNavigate } from "react-router-dom";
import FormHeader from "./FormHeader";
import PostDetailsForm, { type TagInterface } from "./PostDetailsForm";
import ContentEditor from "./ContentEditor";

import AdditionalImages from "./AdditionalImages";
import FileUpload from "./FileUpload";
import CategorySelect from "./CategorySelect";
import PublishSection from "./PublishSection";
import ImageUpload from "./ImageUpload";
import { useEffect, type ChangeEvent, useState } from "react";
import { useArticleReducer } from "./usePostReducer/usePostReducer";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import ApiNotification from "../../../../Common/ApiNotification";
import type { ArticleInitialStateInterface } from "./usePostReducer/postData";
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
  useEffect(() => {
    if (!type) {
      navigate("/admin/post-format");
    }
  }, [type, navigate]);

  const [state, dispatch] = useArticleReducer(type)
  console.log(state);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // First, define a custom type for the change event
  type CustomChangeEvent =
    | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    | {
      target: {
        name: string;
        value: string | string[];
        type: string;
        checked?: boolean;
      };
    };

  function handleChange(e: CustomChangeEvent, newTags?: string[]) {
    const { type, value, name } = e.target;
    let payload: string | boolean | string[] | undefined = value;

    if ('checked' in e.target && type === "checkbox") {
      payload = e.target.checked;
    }
    else if (type === "radio" && (value === "true" || value === "false")) {
      payload = value === "true";
    }
    else if (name === "tagIds" && newTags) {
      payload = newTags;
    }

    dispatch({ type: "set-field", field: name, payload });
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

  function validateStateBeforeSubmit(s: ArticleInitialStateInterface) {
    const errors: string[] = [];
    
    // Required fields
    if (!s.title?.trim()) errors.push("Title is required");
    if (!s.content || s.content.trim().length < 50) errors.push("Content must be at least 50 characters");
    if (!s.categoryId) errors.push("CategoryId is required");
    
    // Image validations
    if (!s.imageUrl || !isValidUrl(s.imageUrl)) {
      errors.push("Main image URL is required and must be a valid http(s) URL");
    }
    
    // Additional Images validation
    if (s.additionalImageUrls?.length) {
      const invalidAdditionalImages = s.additionalImageUrls.filter(url => !isValidUrl(url));
      if (invalidAdditionalImages.length) {
        errors.push("All additional image URLs must be valid http(s) URLs");
      }
    }
    
    // File URLs validation
    if (s.fileUrls?.length) {
      const invalidFiles = s.fileUrls.filter(url => !isValidUrl(url));
      if (invalidFiles.length) {
        errors.push("All file URLs must be valid http(s) URLs");
      }
    }
    
    // Optional URL validation
    if (s.optionalURL && !isValidUrl(s.optionalURL)) {
      errors.push("Optional URL must be a valid http(s) URL");
    }

    // Tag IDs validation
    if (s.tagIds?.length) {
      if (s.tagIds.some(id => !id)) {
        errors.push("All tag IDs must be valid");
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
      const payload = state as ArticleInitialStateInterface;
      const categoryId = payload.categoryId;
      if (!categoryId) throw new Error("categoryId missing");
      const response = await axios.post(`${apiUrl}/posts/categories/${categoryId}/articles`, payload);
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
        className="flex-1 overflow-y-auto p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const errors = validateStateBeforeSubmit(state as ArticleInitialStateInterface);
          if (errors.length) {
            setNotification({ type: "error", message: errors.join("; ") });
            return;
          }
          // submit using state from closure (mutationFn reads state)
          mutation.mutate();
        }}
      >
        <FormHeader type={type} />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="grow space-y-6">
            {/* left column */}
            <PostDetailsForm state={state} handleChange={handleChange} tags={tags?.data.items ?? []} isLoading={isLoadingTags} />
            <ContentEditor state={state} handleChange={handleChange} />
          </div>
          <div className="w-full lg:w-80 shrink space-y-6">
            {/* right column */}
            <ImageUpload state={state} handleChange={handleChange} />
            <AdditionalImages handleChange={handleChange} />
            <FileUpload handleChange={handleChange} />
            <CategorySelect
              handleChange={handleChange}
              categories={categories?.data ?? []}
              isLoading={isLoadingCategories}
              value={state.categoryId}
            />
            <PublishSection mutation={mutation} />
          </div>
        </div>
      </form>
    </>
  );
}
