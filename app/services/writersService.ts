import axiosInstance from "../lib/axios";

export interface WriterSocialAccounts {
  facebook?: string | null;
  Facebook?: string | null;
  twitter?: string | null;
  Twitter?: string | null;
  instagram?: string | null;
  Instagram?: string | null;
  linkedin?: string | null;
  LinkedIn?: string | null;
  youtube?: string | null;
  YouTube?: string | null;
  telegram?: string | null;
  Telegram?: string | null;
  whatsApp?: string | null;
  WhatsApp?: string | null;
}

export interface Writer {
  id: string;
  name: string;
  birthDate: string;
  bio: string | null;
  imageUrl: string | null;
  createdAt?: string;
  facebook?: string | null;
  facebookUrl?: string | null;
  twitter?: string | null;
  twitterUrl?: string | null;
  instagram?: string | null;
  instagramUrl?: string | null;
  linkedin?: string | null;
  linkedIn?: string | null;
  linkedInUrl?: string | null;
  youtube?: string | null;
  youtubeUrl?: string | null;
  telegram?: string | null;
  telegramUrl?: string | null;
  whatsApp?: string | null;
  whatsAppUrl?: string | null;
  socialAccounts?: WriterSocialAccounts | null;
}

class WritersService {
  private readonly baseUrl = "/writers";

  async getWriterById(id: string): Promise<Writer> {
    const response = await axiosInstance.get<Writer>(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const writersService = new WritersService();
