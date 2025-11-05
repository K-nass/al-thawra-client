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
import { useCategories } from "@/hooks/useCategories";
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

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

    
  }


  async function fetchTags() {
    return await axios.get(`${apiUrl}/tags`);
  }

  const { data: tags, isLoading: isLoadingTags } = useQuery<TagResponse>({
    queryKey: ["tags"],
    queryFn: fetchTags,
  })

  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const mutation = useMutation({
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
  console.log(state);
  
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
          e.preventDefault()
          mutation.mutate();
        }}
      >
        <FormHeader type={type} />
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <div className="grow space-y-4 md:space-y-6">
            {/* left column */}
            <PostDetailsForm type={type} state={state} handleChange={handleChange} tags={tags?.data.items ?? []} isLoading={isLoadingTags}/>
            {type === "gallery" ? (
              <GalleryItems state={state as GalleryInitialStateInterface} handleChange={handleChange}  />
            ) : type === "sorted-list" ? (
              <SortedListItems state={state as SortedListInitialStateInterface} handleChange={handleChange}  />
            ) : (
              <ContentEditor state={state as ArticleInitialStateInterface} handleChange={handleChange}  />
            )}
          </div>
          <div className="w-full lg:w-80 lg:shrink-0 space-y-4 md:space-y-6">
            {/* right column */}
            <ImageUpload state={state} handleChange={handleChange}  />
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
              
            />
            <PublishSection mutation={mutation} />
          </div>
        </div>
      </form>
    </>
  );
}
