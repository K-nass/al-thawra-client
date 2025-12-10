import axios from "../lib/axios";

// Category type definition based on API response
export interface Category {
  id: string;
  name: string;
  slug: string;
  language: string;
  description: string;
  colorHex: string;
  order: number;
  isActive: boolean;
  showOnMenu: boolean;
  showOnHomepage: boolean;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  parentCategorySlug: string | null;
  postsCount: number;
  subCategoriesCount: number;
  subCategories: Category[];
}

// Query parameters for fetching categories
export interface CategoryQueryParams {
  language?: string;
  isActive?: boolean;
  withSub?: boolean;
  searchPhrase?: string;
  sortBy?: string;
}

class CategoriesService {
  private readonly baseUrl = "/categories";

  /**
   * Get all categories with optional filters
   */
  async getCategories(params?: CategoryQueryParams): Promise<Category[]> {
    try {
      // Map camelCase params to PascalCase for API
      const apiParams: any = {};

      // Add optional filters with correct casing
      if (params?.language) apiParams.Language = params.language;
      if (params?.isActive !== undefined) apiParams.IsActive = params.isActive;
      if (params?.withSub !== undefined) apiParams.WithSub = params.withSub;
      if (params?.searchPhrase) apiParams.SearchPhrase = params.searchPhrase;
      if (params?.sortBy) apiParams.SortBy = params.sortBy;

      const response = await axios.get<Category[]>(this.baseUrl, {
        params: apiParams,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching categories:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get active categories
   */
  async getActiveCategories(language?: string): Promise<Category[]> {
    try {
      return await this.getCategories({
        isActive: true,
        language,
      });
    } catch (error: any) {
      console.error("Error fetching active categories:", error.message);
      throw error;
    }
  }

  /**
   * Get categories to show on homepage
   */
  async getHomepageCategories(language?: string): Promise<Category[]> {
    try {
      const categories = await this.getCategories({
        isActive: true,
        language,
      });
      // Filter categories that should show on homepage
      return categories.filter(cat => cat.showOnHomepage);
    } catch (error: any) {
      console.error("Error fetching homepage categories:", error.message);
      throw error;
    }
  }

  /**
   * Get categories to show on menu
   */
  async getMenuCategories(language?: string): Promise<Category[]> {
    try {
      const categories = await this.getCategories({
        isActive: true,
        withSub: true,
        language,
      });
      // Filter categories that should show on menu
      return categories.filter(cat => cat.showOnMenu);
    } catch (error: any) {
      console.error("Error fetching menu categories:", error.message);
      throw error;
    }
  }

  /**
   * Get single category by slug
   */
  async getCategoryBySlug(slug: string, withSub: boolean = false): Promise<Category> {
    try {
      const params: any = {};
      if (withSub) params.WithSub = true;
      
      const response = await axios.get<Category>(`${this.baseUrl}/${slug}`, {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching category ${slug}:`, error.message);
      throw error;
    }
  }
}

export const categoriesService = new CategoriesService();
