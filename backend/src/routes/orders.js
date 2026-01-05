import express from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { orderModel } from '../models/orderModel.js';

const router = express.Router();

// Schema de validação para criar pedido
const createOrderSchema = z.object({
  eventId: z.string(),
  tickets: z.array(z.object({
    typeId: z.string(),
    quantity: z.number().int().positive(),
  })),
  buyerName: z.string().min(2),
  buyerEmail: z.string().email(),
  buyerCpf: z.string(),
  paymentMethod: z.enum(['credit_card', 'pix', 'boleto']),
});

// GET /api/orders - Listar pedidos do usuário (requer autenticação)
router.get('/', authenticate, async (req, res) => {
  try {
    // Buscar pedidos do banco de dados do usuário autenticado
    const orders = await orderModel.findByUserId(req.user.id);

    // Formatar pedidos para resposta
    const formattedOrders = orders.map(order => ({
      id: order.id,
      buyerName: order.buyer_name,
      buyerEmail: order.buyer_email,
      buyerCpf: order.buyer_cpf,
      eventId: order.event_id,
      eventName: order.event_name,
      eventBanner: order.event_banner,
      eventDate: order.event_date,
      tickets: order.tickets.map(ticket => ({
        typeId: ticket.type_id,
        typeName: ticket.type_name,
        quantity: ticket.quantity,
        price: parseFloat(ticket.price),
      })),
      total: parseFloat(order.total),
      netAmount: parseFloat(order.net_amount),
      status: order.status,
      paymentMethod: order.payment_method,
      createdAt: order.created_at,
    }));

    res.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// GET /api/orders/:id - Buscar pedido por ID (requer autenticação)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar pedido do banco de dados (apenas do usuário autenticado)
    const order = await orderModel.findById(id, req.user.id);
    
    if (!order) {
      return res.status(404).json({ 
        error: 'Pedido não encontrado',
        message: 'O pedido solicitado não existe ou não pertence a você'
      });
    }

    // Formatar pedido para resposta
    const formattedOrder = {
      id: order.id,
      buyerName: order.buyer_name,
      buyerEmail: order.buyer_email,
      buyerCpf: order.buyer_cpf,
      eventId: order.event_id,
      eventName: order.event_name,
      eventBanner: order.event_banner,
      eventDate: order.event_date,
      tickets: order.tickets.map(ticket => ({
        typeId: ticket.type_id,
        typeName: ticket.type_name,
        quantity: ticket.quantity,
        price: parseFloat(ticket.price),
      })),
      total: parseFloat(order.total),
      netAmount: parseFloat(order.net_amount),
      status: order.status,
      paymentMethod: order.payment_method,
      refundReason: order.refund_reason,
      refundRequestedAt: order.refund_requested_at,
      createdAt: order.created_at,
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

// POST /api/orders - Criar pedido (requer autenticação)
router.post('/', authenticate, async (req, res) => {
  try {
    const data = createOrderSchema.parse(req.body);
    
    // Criar pedido no banco de dados
    const order = await orderModel.create(data, req.user.id);

    // Formatar pedido para resposta
    const formattedOrder = {
      id: order.id,
      buyerName: order.buyer_name,
      buyerEmail: order.buyer_email,
      buyerCpf: order.buyer_cpf,
      eventId: order.event_id,
      eventName: order.event_name,
      eventBanner: order.event_banner,
      eventDate: order.event_date,
      tickets: order.tickets.map(ticket => ({
        typeId: ticket.type_id,
        typeName: ticket.type_name,
        quantity: ticket.quantity,
        price: parseFloat(ticket.price),
      })),
      total: parseFloat(order.total),
      netAmount: parseFloat(order.net_amount),
      status: order.status,
      paymentMethod: order.payment_method,
      createdAt: order.created_at,
    };

    res.status(201).json(formattedOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      });
    }
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

export default router;

