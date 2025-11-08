import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

interface PageItem {
  id: string;
  title: string;
  slug: string;
  language: string;
  location: string;
  visibility: boolean;
  menuOrder: number;
  parentName: string | null;
  parentType: string | null;
  createdAt: string;
}

interface PagesResponse {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
  items: PageItem[];
}

interface FetchPagesParams {
  language?: string | null;
  location?: string | null;
  visibility?: boolean;
  parentMenuLinkId?: string | null;
  parentPageId?: string | null;
  sortBy?: string | null;
  sortDirection?: string | null;
  pageNumber?: number;
  pageSize?: number;
  searchPhrase?: string | null;
}

export function useFetchPages(params: FetchPagesParams) {
  return useQuery({
    queryKey: ["pages", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      if (params.language) queryParams.append("Language", params.language);
      if (params.location) queryParams.append("Location", params.location);
      if (params.visibility !== undefined) queryParams.append("Visibility", String(params.visibility));
      if (params.parentMenuLinkId) queryParams.append("ParentMenuLinkId", params.parentMenuLinkId);
      if (params.parentPageId) queryParams.append("ParentPageId", params.parentPageId);
      if (params.sortBy) queryParams.append("SortBy", params.sortBy);
      if (params.sortDirection) queryParams.append("SortDirection", params.sortDirection);
      if (params.pageNumber) queryParams.append("PageNumber", String(params.pageNumber));
      if (params.pageSize) queryParams.append("PageSize", String(params.pageSize));
      if (params.searchPhrase) queryParams.append("SearchPhrase", params.searchPhrase);

      const response = await apiClient.get<PagesResponse>(`/pages?${queryParams.toString()}`);
      return response.data;
    },
    retry: false, // Don't retry on 404
    enabled: true, // Always enabled, but we'll handle errors in the component
  });
}
