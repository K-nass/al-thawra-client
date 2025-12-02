import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axiosInstance from '../lib/axios';
import authService from './authService';

export interface UploadResponse {
  uploadId: string;
  fileName: string;
  status: string;
  message: string;
  uploadedAt: string;
  signalRHubUrl: string;
}

class MediaServiceImpl {
  private connection: HubConnection | null = null;

  private getHubUrl(): string {
    const hubPath = '/hubs/media-upload';
    const apiBase = axiosInstance.defaults.baseURL;
    
    if (!apiBase) return hubPath;
    
    try {
      if (apiBase.startsWith('http')) {
        const url = new URL(apiBase);
        return `${url.origin}${hubPath}`;
      }
      return `${apiBase}${hubPath}`;
    } catch (e) {
      return hubPath;
    }
  }

  private async ensureConnection(): Promise<HubConnection> {
    if (this.connection?.state === 'Connected') {
      return this.connection;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(this.getHubUrl(), {
        accessTokenFactory: () => authService.getToken() || '',
        withCredentials: false
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    await this.connection.start();
    console.log('🟢 SignalR Connected');
    return this.connection;
  }

  async uploadImage(
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<{ fileName: string; url?: string }> {
    try {
      // 1. Start upload
      const formData = new FormData();
      formData.append('File', file);

      const response = await axiosInstance.post<UploadResponse>('/media/upload-image', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
           if (progressEvent.total && onProgress) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percent);
           }
        }
      });

      const { uploadId, fileName } = response.data;
      
      // 2. Poll the upload status endpoint to get the final URL
      const maxAttempts = 20; // 20 attempts * 500ms = 10 seconds max
      const pollInterval = 500; // 500ms between polls
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const statusResponse = await axiosInstance.get(`/media/upload-status/${uploadId}`);
          const { status, url, progressPercentage } = statusResponse.data;
          
          // Update progress if callback provided
          if (onProgress && progressPercentage) {
            onProgress(progressPercentage);
          }
          
          if (status === 'Completed' && url) {
            return { fileName, url };
          }
          
          if (status === 'Failed') {
            throw new Error('Image processing failed');
          }
          
          // Still processing, wait before next poll
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        } catch (error: any) {
          // If this is the last attempt, throw the error
          if (attempt === maxAttempts) {
            throw new Error('Failed to get upload status after multiple attempts');
          }
          // Otherwise, wait and try again
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
      }
      
      // Timeout - return fileName only as fallback
      console.warn('Upload status polling timeout, returning fileName only');
      return { fileName };

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}

export default new MediaServiceImpl();
