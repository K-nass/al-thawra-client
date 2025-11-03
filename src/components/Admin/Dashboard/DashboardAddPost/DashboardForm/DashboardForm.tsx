import { useLocation, useNavigate } from "react-router-dom";
import FormHeader from "./FormHeader";
import PostDetailsForm, { type TagInterface } from "./PostDetailsForm";
import ContentEditor from "./ContentEditor";

import AdditionalImages from "./AdditionalImages";
import FileUpload from "./FileUpload";
import CategorySelect from "./CategorySelect";
import PublishSection from "./PublishSection";
import ImageUpload from "./ImageUpload";
import { useEffect, type ChangeEvent } from "react";
import { useArticleReducer } from "./usePostReducer/usePostReducer";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
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


  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, newTags?: string[]) {
    const { type, value, name, checked } = e.target;
    let payload: string | boolean | string[] | undefined = value;
    if (type === "checkbox") {
      payload = checked
    }
    else if (type === "radio" && (value === "true" || value === "false")) {
      payload = value === "true";
    }
    else if (name === "tagIds") {
      payload = newTags
    }
    dispatch({ type: "set-field", field: name, payload })
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

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${apiUrl}/posts/categories/dc197c7a-23f9-4195-bdb3-a02f6f93f67d/articles`,
        state
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Post created successfully:", data);
      alert("Post created successfully!");
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      alert("Failed to create post!");
    },
  });

  // #505458 new color i will use for form
  return (
    <form className="flex-1 overflow-y-auto p-6" onSubmit={(e) => {
      e.preventDefault()
    }}>
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
          <AdditionalImages state={state} handleChange={handleChange} />
          <FileUpload state={state} handleChange={handleChange} />
          <CategorySelect handleChange={handleChange} categories={categories?.data ??[]} isLoading={isLoadingCategories} />
          <PublishSection mutation={mutation} />
        </div>
      </div>
    </form>
  );
}
