import { apiClient } from './client';
import type { User, CreateUserDto, UpdateUserDto } from '../types/user.types';

export const usersApi = {
  // Get all users
  getAll: async () => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  // Get single user by ID
  getById: async (id: string | number) => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  // Create new user
  create: async (data: CreateUserDto) => {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  // Update user
  update: async (id: string | number, data: UpdateUserDto) => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  delete: async (id: string | number) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // Get latest users
  getLatest: async (limit: number = 5) => {
    const response = await apiClient.get<User[]>(`/users?_sort=createdAt&_order=desc&_limit=${limit}`);
    return response.data;
  },
};
