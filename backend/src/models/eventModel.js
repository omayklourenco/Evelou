import { query } from '../database/connection.js';

export const eventModel = {
  /**
   * Lista eventos com filtros e paginação
   */
  async findAll(filters = {}) {
    const { category, search, page = 1, limit = 20, status = 'published' } = filters;
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`e.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (category) {
      whereConditions.push(`e.category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(
        e.name ILIKE $${paramIndex} OR 
        e.description ILIKE $${paramIndex} OR
        e.location ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    params.push(limit, offset);
    
    const result = await query(
      `SELECT 
        e.id,
        e.slug,
        e.name,
        e.description,
        e.category,
        e.date,
        e.time,
        e.location,
        e.is_online,
        e.thumbnail,
        e.banner,
        e.organizer_id,
        e.status,
        e.created_at,
        e.updated_at,
        u.name as organizer_name
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    // Buscar tickets para cada evento
    const events = await Promise.all(
      result.rows.map(async (event) => {
        const tickets = await this.findTicketsByEventId(event.id);
        return {
          ...event,
          tickets,
        };
      })
    );

    // Contar total para paginação
    const countResult = await query(
      `SELECT COUNT(*) as total FROM events e ${whereClause}`,
      params.slice(0, -2) // Remove limit e offset
    );
    const total = parseInt(countResult.rows[0].total);

    return {
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Busca evento por ID
   */
  async findById(id) {
    const result = await query(
      `SELECT 
        e.id,
        e.slug,
        e.name,
        e.description,
        e.category,
        e.date,
        e.time,
        e.location,
        e.is_online,
        e.thumbnail,
        e.banner,
        e.organizer_id,
        e.status,
        e.created_at,
        e.updated_at,
        u.name as organizer_name
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const event = result.rows[0];
    const tickets = await this.findTicketsByEventId(id);

    return {
      ...event,
      tickets,
    };
  },

  /**
   * Busca evento por slug
   */
  async findBySlug(slug) {
    const result = await query(
      `SELECT 
        e.id,
        e.slug,
        e.name,
        e.description,
        e.category,
        e.date,
        e.time,
        e.location,
        e.is_online,
        e.thumbnail,
        e.banner,
        e.organizer_id,
        e.status,
        e.created_at,
        e.updated_at,
        u.name as organizer_name
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const event = result.rows[0];
    const tickets = await this.findTicketsByEventId(event.id);

    return {
      ...event,
      tickets,
    };
  },

  /**
   * Cria novo evento
   */
  async create(eventData, organizerId) {
    const {
      name,
      description,
      category,
      date,
      time,
      location,
      isOnline = false,
      is_online = false,
      thumbnail,
      banner,
      tickets = [],
    } = eventData;
    
    const isOnlineValue = isOnline || is_online;

    // Gerar slug a partir do nome
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const result = await query(
      `INSERT INTO events (
        slug, name, description, category, date, time, location, 
        is_online, thumbnail, banner, organizer_id, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        slug,
        name,
        description,
        category,
        date,
        time,
        location,
        isOnlineValue,
        thumbnail || `https://picsum.photos/seed/${slug}/800/800`,
        banner || `https://picsum.photos/seed/${slug}/1920/820`,
        organizerId,
        'draft',
      ]
    );

    const event = result.rows[0];

    // Criar tickets se fornecidos
    if (tickets.length > 0) {
      await Promise.all(
        tickets.map((ticket) =>
          this.createTicket(event.id, ticket)
        )
      );
    }

    return await this.findById(event.id);
  },

  /**
   * Atualiza evento
   */
  async update(id, updates, organizerId) {
    const allowedFields = [
      'name',
      'description',
      'category',
      'date',
      'time',
      'location',
      'is_online',
      'isOnline', // Aceitar ambos os formatos
      'thumbnail',
      'banner',
      'status',
    ];
    
    // Converter isOnline para is_online
    if (updates.isOnline !== undefined) {
      updates.is_online = updates.isOnline;
      delete updates.isOnline;
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    // Verificar se o evento pertence ao organizador
    const event = await this.findById(id);
    if (!event) {
      throw new Error('Evento não encontrado');
    }
    if (event.organizer_id !== organizerId) {
      throw new Error('Você não tem permissão para editar este evento');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await query(
      `UPDATE events 
       SET ${fields.join(', ')} 
       WHERE id = $${paramIndex}`,
      values
    );

    return await this.findById(id);
  },

  /**
   * Deleta evento
   */
  async delete(id, organizerId) {
    // Verificar se o evento pertence ao organizador
    const event = await this.findById(id);
    if (!event) {
      throw new Error('Evento não encontrado');
    }
    if (event.organizer_id !== organizerId) {
      throw new Error('Você não tem permissão para deletar este evento');
    }

    // Deletar tickets primeiro (se houver constraint)
    await query('DELETE FROM tickets WHERE event_id = $1', [id]);

    // Deletar evento
    await query('DELETE FROM events WHERE id = $1', [id]);

    return true;
  },

  /**
   * Busca tickets de um evento
   */
  async findTicketsByEventId(eventId) {
    const result = await query(
      `SELECT 
        id,
        name,
        price,
        quantity,
        available,
        description
      FROM tickets
      WHERE event_id = $1
      ORDER BY price ASC`,
      [eventId]
    );
    return result.rows;
  },

  /**
   * Cria ticket para um evento
   */
  async createTicket(eventId, ticketData) {
    const { name, price, quantity, description } = ticketData;
    const result = await query(
      `INSERT INTO tickets (event_id, name, price, quantity, available, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [eventId, name, price, quantity, quantity, description]
    );
    return result.rows[0];
  },
};

