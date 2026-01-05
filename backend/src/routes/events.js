import express from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middleware/auth.js';
import { eventModel } from '../models/eventModel.js';

const router = express.Router();

// Schema de validação para criar evento
const createEventSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  isOnline: z.boolean().default(false),
  tickets: z.array(z.object({
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
  })),
});

// GET /api/events - Listar eventos
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    const result = await eventModel.findAll({
      category,
      search,
      page: parseInt(page),
      limit: parseInt(limit),
      status: 'published', // Apenas eventos publicados
    });

    // Formatar eventos para resposta (ajustar nomes de campos)
    const formattedEvents = result.events.map(event => ({
      id: event.id,
      slug: event.slug,
      name: event.name,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      isOnline: event.is_online,
      thumbnail: event.thumbnail,
      banner: event.banner,
      organizerId: event.organizer_id,
      organizerName: event.organizer_name,
      status: event.status,
      tickets: event.tickets.map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        price: parseFloat(ticket.price),
        quantity: ticket.quantity,
        available: ticket.available,
        description: ticket.description,
      })),
    }));

    res.json({
      events: formattedEvents,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

// GET /api/events/:id - Buscar evento por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await eventModel.findById(id);
    
    if (!event) {
      return res.status(404).json({ 
        error: 'Evento não encontrado',
        message: 'O evento solicitado não existe'
      });
    }

    // Formatar evento para resposta
    const formattedEvent = {
      id: event.id,
      slug: event.slug,
      name: event.name,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      isOnline: event.is_online,
      thumbnail: event.thumbnail,
      banner: event.banner,
      organizerId: event.organizer_id,
      organizerName: event.organizer_name,
      status: event.status,
      tickets: event.tickets.map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        price: parseFloat(ticket.price),
        quantity: ticket.quantity,
        available: ticket.available,
        description: ticket.description,
      })),
    };

    res.json(formattedEvent);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
});

// GET /api/events/slug/:slug - Buscar evento por slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const event = await eventModel.findBySlug(slug);
    
    if (!event) {
      return res.status(404).json({ 
        error: 'Evento não encontrado',
        message: 'O evento solicitado não existe'
      });
    }

    // Formatar evento para resposta
    const formattedEvent = {
      id: event.id,
      slug: event.slug,
      name: event.name,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      isOnline: event.is_online,
      thumbnail: event.thumbnail,
      banner: event.banner,
      organizerId: event.organizer_id,
      organizerName: event.organizer_name,
      status: event.status,
      tickets: event.tickets.map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        price: parseFloat(ticket.price),
        quantity: ticket.quantity,
        available: ticket.available,
        description: ticket.description,
      })),
    };

    res.json(formattedEvent);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
});

// POST /api/events - Criar evento (requer autenticação de organizador ou admin)
router.post('/', authenticate, authorize('ORGANIZER', 'ADMIN'), async (req, res) => {
  try {
    const data = createEventSchema.parse(req.body);
    
    // Criar evento no banco de dados
    const event = await eventModel.create(data, req.user.id);

    // Formatar evento para resposta
    const formattedEvent = {
      id: event.id,
      slug: event.slug,
      name: event.name,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      isOnline: event.is_online,
      thumbnail: event.thumbnail,
      banner: event.banner,
      organizerId: event.organizer_id,
      organizerName: event.organizer_name,
      status: event.status,
      tickets: event.tickets.map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        price: parseFloat(ticket.price),
        quantity: ticket.quantity,
        available: ticket.available,
        description: ticket.description,
      })),
    };

    res.status(201).json(formattedEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      });
    }
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// PUT /api/events/:id - Atualizar evento (requer autenticação de organizador ou admin)
router.put('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const data = createEventSchema.partial().parse(req.body);
    
    // Atualizar evento no banco de dados
    const event = await eventModel.update(id, data, req.user.id);

    // Formatar evento para resposta
    const formattedEvent = {
      id: event.id,
      slug: event.slug,
      name: event.name,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      isOnline: event.is_online,
      thumbnail: event.thumbnail,
      banner: event.banner,
      organizerId: event.organizer_id,
      organizerName: event.organizer_name,
      status: event.status,
      tickets: event.tickets.map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        price: parseFloat(ticket.price),
        quantity: ticket.quantity,
        available: ticket.available,
        description: ticket.description,
      })),
    };

    res.json(formattedEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      });
    }
    if (error.message === 'Evento não encontrado' || error.message.includes('permissão')) {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

// DELETE /api/events/:id - Deletar evento (requer autenticação de organizador ou admin)
router.delete('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Deletar evento do banco de dados
    await eventModel.delete(id, req.user.id);
    
    res.json({ message: 'Evento deletado com sucesso', id });
  } catch (error) {
    if (error.message === 'Evento não encontrado' || error.message.includes('permissão')) {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ error: 'Erro ao deletar evento' });
  }
});

export default router;

