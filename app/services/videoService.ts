import axios from "../lib/axios";

// Video/Episode interface matching the backend response
export interface Video {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  image: string | null;
  imageDescription: string | null;
  videoUrl: string | null;
  videoEmbedCode: string | null;
  videoThumbnailUrl: string | null;
  duration: string | null;
  viewCount: number;
  videoFiles: string[];
  status: string;
  language: string;
  isFeatured: boolean;
  isBreaking: boolean;
  isSlider: boolean;
  isRecommended: boolean;
  viewsCount: number;
  likesCount: number;
  isLikedByCurrentUser: boolean | null;
  createdAt: string;
  createdBy: string | null;
  publishedAt: string | null;
  authorId: string | null;
  authorName: string | null;
  authorImage: string | null;
  ownerIsAuthor: boolean;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  tags: string[];
  likedByUsers: Array<{
    userName: string;
    imageUrl: string | null;
  }>;
}

// Paginated response interface
export interface PaginatedVideosResponse {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
  items: Video[];
}

// Query parameters for fetching videos
export interface VideoQueryParams {
  pageNumber?: number;
  pageSize?: number;
  categorySlug?: string;
  isFeatured?: boolean;
  isSlider?: boolean;
  isRecommended?: boolean;
  language?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

class VideoService {
  private readonly baseUrl = "/posts";

  /**
   * Get all videos with optional filters
   */
  async getVideos(params?: VideoQueryParams): Promise<PaginatedVideosResponse> {
    try {
      // Map camelCase params to PascalCase for API
      // API only accepts PageSize values of 15, 30, 60, or 90
      const apiParams: any = {
        PageNumber: params?.pageNumber || 1,
        PageSize: params?.pageSize || 15,
      };

      // Add optional filters with correct casing
      if (params?.categorySlug) apiParams.CategorySlug = params.categorySlug;
      if (params?.isFeatured !== undefined) apiParams.IsFeatured = params.isFeatured;
      if (params?.isSlider !== undefined) apiParams.IsSlider = params.isSlider;
      if (params?.isRecommended !== undefined) apiParams.IsRecommended = params.isRecommended;
      if (params?.language) apiParams.Language = params.language;
      if (params?.sortBy) apiParams.SortBy = params.sortBy;
      if (params?.sortOrder) apiParams.SortOrder = params.sortOrder;

      // Videos are just posts with Type=Video
      apiParams.Type = "Video";

      const response = await axios.get<PaginatedVideosResponse>(this.baseUrl, {
        params: apiParams,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching videos:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get featured video
   */
  async getFeaturedVideo(): Promise<Video | null> {
    try {
      const response = await this.getVideos({
        isFeatured: true,
        pageSize: 15, // API only accepts 15, 30, 60, or 90
      });
      return response.items[0] || null;
    } catch (error : any) {
      console.error("Error fetching featured video:", error.message);
      throw error;
    }
  }

  /**
   * Get slider videos
   */
  async getSliderVideos(pageSize: number = 5): Promise<Video[]> {
    try {
      const response = await this.getVideos({
        isSlider: true,
        pageSize,
      });
      return response.items;
    } catch (error) {
      console.error("Error fetching slider videos:", error);
      throw error;
    }
  }

  /**
   * Get recommended videos
   */
  async getRecommendedVideos(pageSize: number = 10): Promise<Video[]> {
    try {
      const response = await this.getVideos({
        isRecommended: true,
        pageSize,
      });
      return response.items;
    } catch (error) {
      console.error("Error fetching recommended videos:", error);
      throw error;
    }
  }

  /**
   * Get videos by category
   */
  async getVideosByCategory(
    categorySlug: string,
    params?: Omit<VideoQueryParams, "categorySlug">
  ): Promise<PaginatedVideosResponse> {
    try {
      const response = await this.getVideos({
        ...params,
        categorySlug,
      });
      return response;
    } catch (error) {
      console.error(`Error fetching videos for category ${categorySlug}:`, error);
      throw error;
    }
  }

  /**
   * Get video by ID
   */
  async getVideoById(id: string): Promise<Video> {
    try {
      const response = await axios.get<Video>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching video ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get video by slug
   */
  async getVideoBySlug(slug: string): Promise<Video> {
    try {
      const response = await axios.get<Video>(`${this.baseUrl}/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching video by slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Increment video view count
   */
  async incrementViewCount(id: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${id}/view`);
    } catch (error) {
      console.error(`Error incrementing view count for video ${id}:`, error);
      throw error;
    }
  }

  /**
   * Like a video
   */
  async likeVideo(id: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${id}/like`);
    } catch (error) {
      console.error(`Error liking video ${id}:`, error);
      throw error;
    }
  }

  /**
   * Unlike a video
   */
  async unlikeVideo(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}/like`);
    } catch (error) {
      console.error(`Error unliking video ${id}:`, error);
      throw error;
    }
  }
}

export const videoService = new VideoService();