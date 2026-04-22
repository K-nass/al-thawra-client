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
  layout: string | number;
  layoutName?: string | null;
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

export type ImplementedLayoutId = "Layout2" | "Layout4" | "Layout5" | "Layout6" | "Layout7" | "Layout8" | "Layout11";

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

  private normalizeCategory(category: Category): Category {
    const layoutName =
      typeof category.layoutName === "string" ? category.layoutName.trim() : "";

    let normalizedLayout: string | number = category.layout;
    if (layoutName) {
      normalizedLayout = layoutName;
    } else if (typeof category.layout === "number" && Number.isFinite(category.layout)) {
      normalizedLayout = `Layout${category.layout}`;
    }

    return {
      ...category,
      layout: normalizedLayout,
      subCategories: Array.isArray(category.subCategories)
        ? category.subCategories.map((sub) => this.normalizeCategory(sub))
        : [],
    };
  }

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
      return (response.data || []).map((cat) => this.normalizeCategory(cat));
    } catch (error: any) {

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
      return this.normalizeCategory(response.data);
    } catch (error: any) {

      throw error;
    }
  }
}

export const categoriesService = new CategoriesService();
