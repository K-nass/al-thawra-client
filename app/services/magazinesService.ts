import axios from "../lib/axios";

// Magazine type definition based on API response
export interface Magazine {
  issueNumber: string;
  pdfUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

// Paginated response structure
export interface PaginatedMagazinesResponse {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
  items: Magazine[];
}

class MagazinesService {
  private readonly baseUrl = "/magazines";

  /**
   * Get all magazines with pagination
   */
  async getMagazines(params?: {
    pageSize?: number;
    pageNumber?: number;
  }): Promise<PaginatedMagazinesResponse> {
    try {
      const apiParams: any = {
        PageSize: params?.pageSize || 15,
        PageNumber: params?.pageNumber || 1,
      };

      const response = await axios.get<PaginatedMagazinesResponse>(this.baseUrl, {
        params: apiParams,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching magazines:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get a single magazine by issue number
   */
  async getMagazineByIssueNumber(issueNumber: string): Promise<Magazine | null> {
    try {
      const response = await this.getMagazines({ pageSize: 100 });
      const magazine = response.items.find(m => m.issueNumber === issueNumber);
      return magazine || null;
    } catch (error: any) {
      console.error(`Error fetching magazine ${issueNumber}:`, error.message);
      return null;
    }
  }

  /**
   * Get magazine by date (for today's issue)
   */
  async getMagazineByDate(date: string): Promise<Magazine | null> {
    try {
      const response = await axios.get<Magazine>(`${this.baseUrl}/by-date`, {
        params: {
          Date: date,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching magazine for date ${date}:`, error.message);
      return null;
    }
  }

  /**
   * Get today's magazine
   */
  async getTodaysMagazine(): Promise<Magazine | null> {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    return this.getMagazineByDate(today);
  }

  /**
   * Get the latest magazine
   */
  async getLatestMagazine(): Promise<Magazine | null> {
    try {
      const response = await this.getMagazines({ pageSize: 15, pageNumber: 1 });
      return response.items.length > 0 ? response.items[0] : null;
    } catch (error: any) {
      console.error("Error fetching latest magazine:", error.message);
      return null;
    }
  }
}

export const magazinesService = new MagazinesService();
