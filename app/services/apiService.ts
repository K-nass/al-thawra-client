import axiosInstance from '../lib/axios';

class ApiService {
  // Generic GET request
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  }

  // Generic POST request
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  }

  // Generic PUT request
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await axiosInstance.put<T>(url, data);
    return response.data;
  }

  // Generic PATCH request
  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await axiosInstance.patch<T>(url, data);
    return response.data;
  }

  // Generic DELETE request
  async delete<T>(url: string): Promise<T> {
    const response = await axiosInstance.delete<T>(url);
    return response.data;
  }

  // Posts endpoints
  async getPosts(page = 1, limit = 10) {
    return this.get('/posts', { page, limit });
  }

  async getPostById(id: string) {
    return this.get(`/posts/${id}`);
  }

  async getPostsByCategory(categorySlug: string, page = 1, limit = 10) {
    return this.get(`/posts/category/${categorySlug}`, { page, limit });
  }

  async getPostsByAuthor(authorSlug: string, page = 1, limit = 10) {
    return this.get(`/posts/author/${authorSlug}`, { page, limit });
  }

  // Categories endpoints
  async getCategories() {
    return this.get('/categories');
  }

  async getCategoryBySlug(slug: string) {
    return this.get(`/categories/${slug}`);
  }

  // Authors endpoints
  async getAuthors() {
    return this.get('/authors');
  }

  async getAuthorBySlug(slug: string) {
    return this.get(`/authors/${slug}`);
  }

  // Search endpoint
  async search(query: string, page = 1, limit = 10) {
    return this.get('/search', { q: query, page, limit });
  }

  // Comments endpoints
  async getComments(postId: string) {
    return this.get(`/posts/${postId}/comments`);
  }

  async createComment(postId: string, content: string) {
    return this.post(`/posts/${postId}/comments`, { content });
  }

  async deleteComment(commentId: string) {
    return this.delete(`/comments/${commentId}`);
  }
}

export default new ApiService();
