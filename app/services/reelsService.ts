import axios from "../lib/axios";

// ---------- Types ----------

export interface Reel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  caption: string;
  duration: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isPublished: boolean;
  createdAt: string;
  userId: string;
  userName: string | null;
  userAvatarUrl: string | null;
  tags: string[];
  isLikedByCurrentUser: boolean | null;
}

export interface ReelsResponse {
  reels: Reel[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ReelsApiError {
  type: string | null;
  title: string | null;
  status: number | null;
  detail: string | null;
  instance: string | null;
  errors: Record<string, string[]>;
}

// ---------- Service ----------

class ReelsService {
  private readonly baseUrl = "/reels";

  /**
   * Fetch reels with cursor-based pagination.
   * GET /reels?Cursor=<cursor>&Limit=<limit>
   */
  async getReels(cursor?: string, limit: number = 5): Promise<ReelsResponse> {
    try {
      const params: Record<string, string | number> = { Limit: limit };
      if (cursor) {
        params.Cursor = cursor;
      }

      const response = await axios.get<ReelsResponse>(this.baseUrl, { params });
      return {
        reels: response.data.reels || [],
        nextCursor: response.data.nextCursor ?? null,
        hasMore: response.data.hasMore ?? false,
      };
    } catch (error: any) {
      throw this.parseError(error);
    }
  }

  /**
   * Fetch a single reel by ID.
   */
  async getReelById(id: string): Promise<Reel> {
    try {
      const response = await axios.get<Reel>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.parseError(error);
    }
  }

  /**
   * Like a reel.
   */
  async likeReel(id: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${id}/like`);
    } catch (error: any) {
      throw this.parseError(error);
    }
  }

  /**
   * Unlike a reel.
   */
  async unlikeReel(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}/like`);
    } catch (error: any) {
      throw this.parseError(error);
    }
  }

  /**
   * Parse API errors into a structured shape.
   */
  private parseError(error: any): Error {
    if (error?.response?.status === 422) {
      const data = error.response.data as ReelsApiError;
      const messages = Object.values(data.errors || {}).flat();
      return new Error(messages.join(", ") || "خطأ في البيانات المدخلة");
    }

    if (error?.response?.data?.detail) {
      return new Error(error.response.data.detail);
    }

    if (!error?.response && error?.request) {
      return new Error("فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.");
    }

    return error instanceof Error ? error : new Error("حدث خطأ غير متوقع");
  }
}

export const reelsService = new ReelsService();
