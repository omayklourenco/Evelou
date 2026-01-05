import { api } from '../config/api';
import { Order } from '../../types';

export interface CreateOrderRequest {
  eventId: string;
  tickets: {
    typeId: string;
    quantity: number;
  }[];
  buyerName: string;
  buyerEmail: string;
  buyerCpf: string;
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
}

export interface OrdersResponse {
  orders: Order[];
}

export const orderService = {
  async getOrders(): Promise<OrdersResponse> {
    return api.get<OrdersResponse>('/api/orders');
  },

  async getOrderById(id: string): Promise<Order> {
    return api.get<Order>(`/api/orders/${id}`);
  },

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return api.post<Order>('/api/orders', data);
  },
};

