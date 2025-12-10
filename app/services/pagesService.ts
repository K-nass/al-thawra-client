import axios from "../lib/axios";

// Page type definition based on API response
export interface Page {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  language: string;
  location: "Footer" | "TopMenu";
  visibility: boolean;
  menuOrder: number;
  showOnlyToRegisteredUsers: boolean;
  showTitle: boolean;
  showBreadcrumb: boolean;
  showRightColumn: boolean;
  keywords: string[];
  fullUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Paginated response structure
export interface PaginatedPagesResponse {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
  items: Page[];
}

class PagesService {
  private readonly baseUrl = "/pages";

  /**
   * Get all pages with optional filters
   */
  async getPages(params?: {
    location?: "Footer" | "TopMenu";
    language?: string;
    pageSize?: number;
  }): Promise<PaginatedPagesResponse> {
    try {
      const apiParams: any = {
        PageSize: params?.pageSize || 90, // Get all pages
        PageNumber: 1,
      };

      if (params?.location) apiParams.Location = params.location;
      if (params?.language) apiParams.Language = params.language;

      const response = await axios.get<PaginatedPagesResponse>(this.baseUrl, {
        params: apiParams,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching pages:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get footer pages
   */
  async getFooterPages(language: string = "Arabic"): Promise<Page[]> {
    try {
      const response = await this.getPages({
        location: "Footer",
        language,
      });
      // Sort by menuOrder
      return response.items.sort((a, b) => a.menuOrder - b.menuOrder);
    } catch (error: any) {
      console.error("Error fetching footer pages:", error.message);
      return [];
    }
  }

  /**
   * Get single page by slug
   */
  async getPageBySlug(slug: string, language: string = "Arabic"): Promise<Page> {
    try {
      const response = await axios.get<Page>(`${this.baseUrl}/slug/${slug}`, {
        params: {
          Language: language,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching page ${slug}:`, error.message);
      throw error;
    }
  }
}

export const pagesService = new PagesService();
