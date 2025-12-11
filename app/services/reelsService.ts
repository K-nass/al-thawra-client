import axios from "../lib/axios";

export interface Reel {
  id: string;
  videoUrl: string;
  caption: string;
  duration: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isPublished: boolean;
  createdAt: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  tags: string[];
}

export interface ReelsResponse {
  reels: Reel[];
  nextCursor?: string;
  hasMore: boolean;
}

class ReelsService {
  private readonly baseUrl = "/reels";

  /**
   * Fetch reels with optional cursor for pagination
   */
  async getReels(cursor?: string): Promise<ReelsResponse> {
    try {
      // Assuming GET /api/v1/reels?cursor=...
      // The axios instance likely handles the /api/v1 prefix based on other services
      const params: any = {};
      if (cursor) {
        params.cursor = cursor;
      }

      // Note: Adjusting endpoint path if necessary based on system convention.
      // Assuming 'axios' is configured with base URL.
      // If other services use relative paths like "/posts", this should be "/reels"
      // Check videoService: uses "/posts"
      const response = await axios.get<ReelsResponse>(this.baseUrl, { params });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching reels:", error.response?.data || error.message);
      throw error;
    }
  }

  /* 
   * Like a reel
   */
  async likeReel(id: string): Promise<void> {
      try {
        await axios.post(`${this.baseUrl}/${id}/like`);
      } catch (error) {
        console.error(`Error liking reel ${id}:`, error);
        throw error;
      }
    }
  
    /**
     * Unlike a reel
     */
    async unlikeReel(id: string): Promise<void> {
      try {
        await axios.delete(`${this.baseUrl}/${id}/like`);
      } catch (error) {
        console.error(`Error unliking reel ${id}:`, error);
        throw error;
      }
    }
}

export const reelsService = new ReelsService();
