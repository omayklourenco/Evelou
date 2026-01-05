
import { Order, PurchasedTicket, TicketStatus, Event } from './types';

export const CATEGORIES = [
  'Show',
  'Teatro',
  'Corporativo',
  'Curso',
  'Esporte',
  'Gastronomia',
  'Religioso',
  'Festa',
];

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    slug: 'festival-verao-2024',
    name: 'Festival de Verão 2024',
    description: 'O maior festival de música da região com atrações nacionais e internacionais.',
    category: 'Show',
    date: '2024-12-20',
    time: '18:00',
    location: 'Arena Praia, Salvador - BA',
    isOnline: false,
    thumbnail: 'https://picsum.photos/seed/thumb1/800/800',
    banner: 'https://picsum.photos/seed/event1/1920/820',
    organizerId: 'org1',
    organizerName: 'Evelou Produções',
    status: 'published',
    rating: 4.8,
    reviewsCount: 156,
    tickets: [
      { id: 't1', name: 'Pista', price: 120, quantity: 1000, available: 450 },
      { id: 't2', name: 'Camarote VIP', price: 350, quantity: 200, available: 10 },
    ],
  },
  {
    id: '2',
    slug: 'workshop-react-avancado',
    name: 'Workshop React Avançado',
    description: 'Aprenda padrões de design, hooks personalizados e performance em React.',
    category: 'Curso',
    date: '2024-11-15',
    time: '09:00',
    location: 'Plataforma Zoom',
    isOnline: true,
    thumbnail: 'https://picsum.photos/seed/thumb2/800/800',
    banner: 'https://picsum.photos/seed/event2/1920/820',
    organizerId: 'org2',
    organizerName: 'Tech Academy',
    status: 'published',
    rating: 5.0,
    reviewsCount: 89,
    tickets: [
      { id: 't3', name: 'Acesso Antecipado', price: 97, quantity: 50, available: 5 },
      { id: 't4', name: 'Ingresso Regular', price: 197, quantity: 150, available: 120 },
    ],
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'EVL-98421',
    buyerName: 'Marcos Oliveira',
    buyerEmail: 'marcos@email.com',
    buyerCpf: '123.456.789-00',
    eventId: '1',
    eventName: 'Festival de Verão 2024',
    eventBanner: 'https://picsum.photos/seed/event1/200/200',
    eventDate: '2024-12-20',
    tickets: [{ typeId: 't1', typeName: 'Pista', quantity: 2, price: 120 }],
    total: 240,
    netAmount: 216,
    status: 'paid',
    paymentMethod: 'credit_card',
    // Data de compra dinâmica para sempre permitir teste de estorno (7 dias)
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_PURCHASED_TICKETS: PurchasedTicket[] = [
  {
    id: 'TK-1001',
    orderId: 'EVL-98421',
    eventName: 'Festival de Verão 2024',
    eventDate: '2024-12-20',
    eventLocation: 'Arena Praia, Salvador - BA',
    ticketName: 'Pista',
    buyerName: 'Marcos Oliveira',
    qrCode: 'EVELOU-TICKET-1001-XYZ',
    status: TicketStatus.VALID
  },
];
