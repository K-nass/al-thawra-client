import { apiClient } from './client';
import type { Post, CreatePostDto, UpdatePostDto } from '../types/post.types';

export const postsApi = {
  // Get all posts
  getAll: async () => {
    const response = await apiClient.get<Post[]>('/posts');
    return response.data;
  },

  // Get single post by ID
  getById: async (id: string | number) => {
    const response = await apiClient.get<Post>(`/posts/${id}`);
    return response.data;
  },

  // Create new post
  create: async (data: CreatePostDto) => {
    const response = await apiClient.post<Post>('/posts', data);
    return response.data;
  },

  // Update post
  update: async (id: string | number, data: UpdatePostDto) => {
    const response = await apiClient.put<Post>(`/posts/${id}`, data);
    return response.data;
  },

  // Delete post
  delete: async (id: string | number) => {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },

  // Get posts by category
  getByCategory: async (category: string) => {
    const response = await apiClient.get<Post[]>(`/posts?category=${category}`);
    return response.data;
  },
};
