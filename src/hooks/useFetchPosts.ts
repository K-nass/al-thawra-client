import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

interface FetchPostsParams {
  category?: string | null;
  authorId?: string | null;
  status?: string | null;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isSlider?: boolean;
  language?: string | null;
  from?: string | null;
  to?: string | null;
  pageNumber?: number;
  pageSize?: number;
  searchPhrase?: string | null;
}

export function useFetchPosts(params: FetchPostsParams = {}) {
  async function fetchPosts() {
    const {
      category,
      authorId,
      status,
      isFeatured,
      isBreaking,
      isSlider,
      language,
      from,
      to,
      pageNumber,
      pageSize,
      searchPhrase,
    } = params;

    const hasFilters =
      category ||
      authorId ||
      status ||
      isFeatured ||
      isBreaking ||
      isSlider ||
      language ||
      from ||
      to ||
      pageNumber ||
      pageSize ||
      searchPhrase;

    if (!hasFilters || category === "all") {
      return await axios.get(`${apiUrl}/posts/categories/articles`);
    }

    const queryParams = new URLSearchParams();

    if (category) queryParams.append("CategorySlug", category);
    if (authorId) queryParams.append("AuthorId", authorId);
    if (status) queryParams.append("Status", status);
    if (isFeatured !== undefined) queryParams.append("IsFeatured", String(isFeatured));
    if (isBreaking !== undefined) queryParams.append("IsBreaking", String(isBreaking));
    if (isSlider !== undefined) queryParams.append("IsSlider", String(isSlider));
    if (language) queryParams.append("Language", language);
    if (from) queryParams.append("From", from);
    if (to) queryParams.append("To", to);
    if (pageNumber) queryParams.append("PageNumber", String(pageNumber));
    if (pageSize) queryParams.append("PageSize", String(pageSize));
    if (searchPhrase) queryParams.append("SearchPhrase", searchPhrase);

    return await axios.get(
      `${apiUrl}/posts/categories/articles?${queryParams.toString()}`
    );
  }

  return useQuery({
    queryKey: ["posts", params],
    queryFn: fetchPosts,
  });
}
