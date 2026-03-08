import axiosInstance from '../lib/axios';

export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  avatarImageUrl: string | null;
  slug: string;
  aboutMe: string;
  socialAccounts: {
    [key: string]: string;
  };
  permissions: string[];
  hasAllPermissions: boolean;
}

export interface UpdateProfileData {
  userName?: string;
  aboutMe?: string;
  slug?: string;
  email?: string;
  avatarImage?: File; // Changed from avatarImageUrl to avatarImage (File)
  socialAccounts?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    telegram?: string;
    whatsApp?: string;
    discord?: string;
    tiktok?: string;
    twitch?: string;
    vk?: string;
    pinterest?: string;
    personalWebsiteUrl?: string;
  };
}

class ProfileService {
  // Get current user profile
  async getCurrentProfile(token?: string): Promise<UserProfile> {
    try {
      const config = token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {};

      const response = await axiosInstance.get<UserProfile>('/users/profile', config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId: string, data: UpdateProfileData, token?: string): Promise<UserProfile> {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Add UserId - REQUIRED by API
      formData.append('UserId', userId);

      // Add text fields
      if (data.userName) formData.append('UserName', data.userName);
      if (data.aboutMe) formData.append('AboutMe', data.aboutMe);
      if (data.slug) formData.append('Slug', data.slug);
      if (data.email) formData.append('Email', data.email);

      // Add avatar image file
      if (data.avatarImage) {

        formData.append('AvatarImage', data.avatarImage);
      }

      // Add social accounts
      if (data.socialAccounts) {
        if (data.socialAccounts.facebook) formData.append('Facebook', data.socialAccounts.facebook);
        if (data.socialAccounts.twitter) formData.append('Twitter', data.socialAccounts.twitter);
        if (data.socialAccounts.instagram) formData.append('Instagram', data.socialAccounts.instagram);
        if (data.socialAccounts.linkedin) formData.append('LinkedIn', data.socialAccounts.linkedin);
        if (data.socialAccounts.youtube) formData.append('YouTube', data.socialAccounts.youtube);
        if (data.socialAccounts.telegram) formData.append('Telegram', data.socialAccounts.telegram);
        if (data.socialAccounts.whatsApp) formData.append('WhatsApp', data.socialAccounts.whatsApp);
        if (data.socialAccounts.discord) formData.append('Discord', data.socialAccounts.discord);
        if (data.socialAccounts.tiktok) formData.append('TikTok', data.socialAccounts.tiktok);
        if (data.socialAccounts.twitch) formData.append('Twitch', data.socialAccounts.twitch);
        if (data.socialAccounts.vk) formData.append('VK', data.socialAccounts.vk);
        if (data.socialAccounts.pinterest) formData.append('Pinterest', data.socialAccounts.pinterest);
        if (data.socialAccounts.personalWebsiteUrl) formData.append('PersonalWebsiteUrl', data.socialAccounts.personalWebsiteUrl);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      };

      const url = `/users/${userId}`;

      // Log FormData contents

      try {
        const response = await axiosInstance.put<UserProfile>(url, formData, config);
        return response.data;
      } catch (error: any) {
        throw error;
      }
    } catch (error: any) {

      throw error;
    }
  }

  // Upload avatar image to media library
  async uploadAvatar(file: File): Promise<{ uploadId: string; fileName: string; status: string }> {
    try {

      const formData = new FormData();
      formData.append('File', file);


      const response = await axiosInstance.post<{
        uploadId: string;
        fileName: string;
        status: string;
        message: string;
        uploadedAt: string;
        signalRHubUrl: string;
      }>('/media/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      return {
        uploadId: response.data.uploadId,
        fileName: response.data.fileName,
        status: response.data.status
      };
    } catch (error: any) {

      if (error.response?.data) {

      }

      throw error;
    }
  }

  // Get user's saved/liked posts
  async getSavedPosts(pageNumber: number = 1, pageSize: number = 15) {
    try {
      const response = await axiosInstance.get('/posts/liked', {
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProfileService();
