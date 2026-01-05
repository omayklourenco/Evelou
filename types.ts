
export enum UserRole {
  BUYER = 'BUYER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

export enum TeamRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  STAFF = 'STAFF',
}

export enum TicketStatus {
  VALID = 'VALID',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
}

export enum StripeStatus {
  PENDING = 'pending',
  INCOMPLETE = 'incomplete',
  ACTIVE = 'active',
  RESTRICTED = 'restricted',
}

export type KYCStatus = 'not_started' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  stripeStatus?: StripeStatus;
  isVerified?: boolean;
  kycStatus?: KYCStatus;
  verificationDate?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: 'active' | 'pending';
  joinedAt?: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  available: number;
  description?: string;
}

export interface Event {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  thumbnail: string;
  banner: string;
  organizerId: string;
  organizerName: string;
  tickets: TicketType[];
  status: 'published' | 'draft' | 'cancelled';
  rating?: number;
  reviewsCount?: number;
}

export interface Order {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerCpf: string;
  eventId: string;
  eventName: string;
  eventBanner: string;
  eventDate: string;
  tickets: {
    typeId: string;
    typeName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  netAmount: number;
  status: 'paid' | 'pending' | 'refunded' | 'failed' | 'refund_pending';
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
  createdAt: string;
  refundReason?: string;
  refundRequestedAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  limit: number;
  used: number;
  status: 'active' | 'expired';
  eventId?: string;
  expiryDate?: string;
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  code: string;
  commission: number; // Porcentagem
  salesCount: number;
  totalEarned: number;
  totalPaid: number; // NOVO: Controle manual de pagamento
  status: 'active' | 'paused';
  allowedEventIds: string[]; // Vazio = Todos os eventos
  cookieDays?: number;
}

export interface PurchasedTicket {
  id: string;
  orderId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  ticketName: string;
  buyerName: string;
  qrCode: string;
  status: TicketStatus;
}
