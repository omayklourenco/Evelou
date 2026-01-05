import { api } from '../config/api';
import { Event } from '../../types';

export interface EventsResponse {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface EventsQuery {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const eventService = {
  async getEvents(query?: EventsQuery): Promise<EventsResponse> {
    const params = new URLSearchParams();
    if (query?.category) params.append('category', query.category);
    if (query?.search) params.append('search', query.search);
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());

    const endpoint = `/api/events${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<EventsResponse>(endpoint);
  },

  async getEventById(id: string): Promise<Event> {
    return api.get<Event>(`/api/events/${id}`);
  },

  async getEventBySlug(slug: string): Promise<Event> {
    return api.get<Event>(`/api/events/slug/${slug}`);
  },

  async createEvent(data: Partial<Event>): Promise<Event> {
    return api.post<Event>('/api/events', data);
  },

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    return api.put<Event>(`/api/events/${id}`, data);
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/api/events/${id}`);
  },
};

