  import axiosInstance from "../lib/axios";
import { cache, CacheTTL } from "../lib/cache";

export interface UserProfile {
  userName: string;
  email: string;
  profileImageUrl?: string;
  aboutMe?: string;
  memberSince: string;
  lastSeen: string;
  socialAccounts?: Record<string, any>;
  posts: {
    pageSize: number;
    pageNumber: number;
    totalCount: number;
    totalPages: number;
    itemsFrom: number;
    itemsTo: number;
    items: any[];
  };
}

export interface UserProfileParams {
  username: string;
  pageNumber?: number;
  pageSize?: number;
}

class UserService {
  private readonly baseUrl = "/users";

  /**
   * Get user profile with posts
   */
  async getUserProfile(params: UserProfileParams): Promise<UserProfile> {
    try {
      const { username, pageNumber = 1, pageSize = 10 } = params;
      
      // Use cache for better performance
      const cacheKey = `user-profile-${username}-${pageNumber}-${pageSize}`;
      
      return await cache.getOrFetch<UserProfile>(
        cacheKey,
        async () => {
          const queryParams = new URLSearchParams({
            UserName: username,
            ...(pageNumber && { PageNumber: pageNumber.toString() }),
            ...(pageSize && { PageSize: pageSize.toString() })
          });

          const response = await axiosInstance.get<UserProfile>(
            `${this.baseUrl}/profile/${username}?${queryParams.toString()}`
          );
          
          return response.data;
        },
        CacheTTL.MEDIUM
      );
    } catch (error: any) {
      console.error("Error fetching user profile:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get user posts by category
   */
  async getUserPostsByCategory(username: string, categorySlug?: string): Promise<any[]> {
    try {
      const profile = await this.getUserProfile({ username });
      
      if (!categorySlug) {
        return profile.posts.items || [];
      }
      
      return (profile.posts.items || []).filter((post: any) => 
        post.categorySlug === categorySlug
      );
    } catch (error: any) {
      console.error("Error fetching user posts by category:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get user categories with post counts
   */
  async getUserCategories(username: string): Promise<Array<{slug: string, name: string, count: number}>> {
    try {
      const profile = await this.getUserProfile({ username });
      const posts = profile.posts.items || [];
      
      // Category name mapping
      const categoryNameMap: Record<string, string> = {
        "alriyadah": "الرياضة",
        "technology": "التكنولوجيا", 
        "entertainment-television": "الترفيه والتلفزيون",
        "entertainment-awards": "الجوائز والترفيه",
        "mahalliyat-خدمات-ومرافق": "الخدمات والمرافق",
        "alriyadah-دوريات-محلية": "الدوريات المحلية",
        "sports-tennis": "التنس",
        "business-startups": "الشركات الناشئة",
        "huquq-wa-munathamat-قانون-وعدالة": "القانون والعدالة",
        "news": "الأخبار",
        "mahalliyat": "المحليات",
        "iqtisad": "الاقتصاد",
        "siyasah": "السياسة",
        "thaqafah": "الثقافة",
        "riyadah": "الرياضة",
        "technology-ai": "الذكاء الاصطناعي",
        "health": "الصحة",
        "education": "التعل��م"
      };
      
      // Count posts by category
      const categoryStats: Record<string, {slug: string, name: string, count: number}> = {};
      
      posts.forEach((post: any) => {
        if (post.categorySlug) {
          if (!categoryStats[post.categorySlug]) {
            categoryStats[post.categorySlug] = {
              slug: post.categorySlug,
              name: categoryNameMap[post.categorySlug] || post.categoryName || post.categorySlug,
              count: 0
            };
          }
          categoryStats[post.categorySlug].count++;
        }
      });
      
      return Object.values(categoryStats).sort((a, b) => b.count - a.count);
    } catch (error: any) {
      console.error("Error fetching user categories:", error.response?.data || error.message);
      throw error;
    }
  }
}

export const userService = new UserService();
