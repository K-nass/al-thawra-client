import axios from "../lib/axios";

// Post type definition based on API response
export interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  imageDescription?: string;
  status: string;
  language: string;
  postType: "Article" | "Video" | "Audio" | "Gallery";
  isFeatured: boolean;
  isBreaking: boolean;
  isSlider: boolean;
  isRecommended: boolean;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  createdBy: string;
  publishedAt: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  ownerIsAuthor: boolean;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  authorSlug: string;
  tags: string[];
}

// Paginated response structure
export interface PaginatedPostsResponse {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
  items: Post[];
}

// Query parameters for fetching posts
export interface PostQueryParams {
  pageNumber?: number;
  pageSize?: number;
  categorySlug?: string;
  authorName?: string;
  hasAuthor?: boolean;
  status?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isSlider?: boolean;
  isRecommended?: boolean;
  language?: string;
  type?: string;
  from?: string;
  to?: string;
  includeLikedByUsers?: boolean;
  searchPhrase?: string;
}

class PostsService {
  private readonly baseUrl = "/posts";

  /**
   * Get all posts with optional filters
   */
  async getPosts(params?: PostQueryParams): Promise<PaginatedPostsResponse> {
    try {
      // Map camelCase params to PascalCase for API
      // API only accepts PageSize values of 15, 30, 60, or 90
      const apiParams: any = {
        PageNumber: params?.pageNumber || 1,
        PageSize: params?.pageSize || 15,
      };

      // Add optional filters with correct casing
      if (params?.categorySlug) apiParams.CategorySlug = params.categorySlug;
      if (params?.authorName) apiParams.AuthorName = params.authorName;
      if (params?.hasAuthor !== undefined) apiParams.HasAuthor = params.hasAuthor;
      if (params?.status) apiParams.Status = params.status;
      if (params?.isFeatured !== undefined) apiParams.IsFeatured = params.isFeatured;
      if (params?.isBreaking !== undefined) apiParams.IsBreaking = params.isBreaking;
      if (params?.isSlider !== undefined) apiParams.IsSlider = params.isSlider;
      if (params?.isRecommended !== undefined) apiParams.IsRecommended = params.isRecommended;
      if (params?.language) apiParams.Language = params.language;
      if (params?.type) apiParams.Type = params.type;
      if (params?.from) apiParams.From = params.from;
      if (params?.to) apiParams.To = params.to;
      if (params?.includeLikedByUsers !== undefined) apiParams.IncludeLikedByUsers = params.includeLikedByUsers;
      if (params?.searchPhrase) apiParams.SearchPhrase = params.searchPhrase;

      const response = await axios.get<PaginatedPostsResponse>(this.baseUrl, {
        params: apiParams,
      });
    //   console.log("################")
    //   console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching posts:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get slider posts
   */
  async getSliderPosts(pageSize: number = 15, type="Article"): Promise<Post[]> {
    try {
      const response = await this.getPosts({
        isSlider: true,
        pageSize,
        type,
      });
      return response.items;
    } catch (error: any) {
      console.error("Error fetching slider posts:", error.message);
      throw error;
    }
  }

  /**
   * Get featured posts
   */
  async getFeaturedPosts(pageSize: number = 15, type="Article"): Promise<Post[]> {
    try {
      const response = await this.getPosts({
        isFeatured: true,
        pageSize,
        type,
      });
      return response.items;
    } catch (error: any) {
      console.error("Error fetching featured posts:", error.message);
      throw error;
    }
  }

  /**
   * Get recommended posts
   */
  async getRecommendedPosts(pageSize: number = 15, type="Article"): Promise<Post[]> {
    try {
      const response = await this.getPosts({
        isRecommended: true,
        pageSize,
        type,
      });
      return response.items;
    } catch (error: any) {
      console.error("Error fetching recommended posts:", error.message);
      throw error;
    }
  }

  /**
   * Get breaking news posts
   */
  async getBreakingNews(pageSize: number = 15, type="Article"): Promise<Post[]> {
    try {
      const response = await this.getPosts({
        isBreaking: true,
        pageSize,
        type,
      });
      return response.items;
    } catch (error: any) {
      console.error("Error fetching breaking news:", error.message);
      throw error;
    }
  }

  /**
   * Get posts with authors (Writers & Opinions)
   */
  async getPostsWithAuthors(pageSize: number = 15, type="Article"): Promise<Post[]> {
    try {
      const response = await this.getPosts({
        hasAuthor: true,
        pageSize,
        type,
      });
      return response.items;
    } catch (error: any) {
      console.error("Error fetching posts with authors:", error.message);
      throw error;
    }
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(
    categorySlug: string,
    params?: Omit<PostQueryParams, "categorySlug">,
    type="Article"
  ): Promise<PaginatedPostsResponse> {
    try {
      return await this.getPosts({
        ...params,
        categorySlug,
        type,
      });
    } catch (error: any) {
      console.error(`Error fetching posts for category ${categorySlug}:`, error.message);
      throw error;
    }
  }

  /**
   * Get posts by type (Article, Video, Audio, Gallery)
   */
  async getPostsByType(
    type: string,
    params?: Omit<PostQueryParams, "type">
  ): Promise<PaginatedPostsResponse> {
    try {
      return await this.getPosts({
        ...params,
        type,
      });
    } catch (error: any) {
      console.error(`Error fetching posts of type ${type}:`, error.message);
      throw error;
    }
  }

  /**
   * Get single post by slug
   */
  async getPostBySlug(slug: string): Promise<Post> {
    try {
      const response = await axios.get<Post>(`${this.baseUrl}/${slug}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching post ${slug}:`, error.message);
      throw error; 
    }
  }

  /**
   * Increment post view count
   */
  async incrementViewCount(postId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${postId}/view`);
    } catch (error: any) {
      console.error(`Error incrementing view count for post ${postId}:`, error.message);
      throw error;
    }
  }

  /**
   * Like a post
   */
  async likePost(postId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${postId}/like`);
    } catch (error: any) {
      console.error(`Error liking post ${postId}:`, error.message);
      throw error;
    }
  }

  /**
   * Unlike a post
   */
  async unlikePost(postId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${postId}/like`);
    } catch (error: any) {
      console.error(`Error unliking post ${postId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get user's liked posts
   */
  async getLikedPosts(params?: PostQueryParams): Promise<PaginatedPostsResponse> {
    try {
      const response = await axios.get<PaginatedPostsResponse>(`${this.baseUrl}/liked`, {
        params: {
          PageNumber: params?.pageNumber || 1,
          PageSize: params?.pageSize || 15,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching liked posts:", error.message);
      throw error;
    }
  }
}

export const postsService = new PostsService();
