import { query } from '../database/connection.js';

export const orderModel = {
  /**
   * Lista pedidos do usuário
   */
  async findByUserId(userId) {
    const result = await query(
      `SELECT 
        o.id,
        o.buyer_name,
        o.buyer_email,
        o.buyer_cpf,
        o.event_id,
        o.total,
        o.net_amount,
        o.status,
        o.payment_method,
        o.created_at,
        e.name as event_name,
        e.banner as event_banner,
        e.date as event_date
      FROM orders o
      LEFT JOIN events e ON o.event_id = e.id
      WHERE o.buyer_id = $1
      ORDER BY o.created_at DESC`,
      [userId]
    );

    // Buscar tickets de cada pedido
    const orders = await Promise.all(
      result.rows.map(async (order) => {
        const orderTickets = await this.findTicketsByOrderId(order.id);
        return {
          ...order,
          tickets: orderTickets,
        };
      })
    );

    return orders;
  },

  /**
   * Busca pedido por ID
   */
  async findById(id, userId = null) {
    let queryText = `SELECT 
      o.id,
      o.buyer_id,
      o.buyer_name,
      o.buyer_email,
      o.buyer_cpf,
      o.event_id,
      o.total,
      o.net_amount,
      o.status,
      o.payment_method,
      o.refund_reason,
      o.refund_requested_at,
      o.created_at,
      e.name as event_name,
      e.banner as event_banner,
      e.date as event_date
    FROM orders o
    LEFT JOIN events e ON o.event_id = e.id
    WHERE o.id = $1`;

    const params = [id];

    if (userId) {
      queryText += ' AND o.buyer_id = $2';
      params.push(userId);
    }

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      return null;
    }

    const order = result.rows[0];
    const tickets = await this.findTicketsByOrderId(id);

    return {
      ...order,
      tickets,
    };
  },

  /**
   * Cria novo pedido
   */
  async create(orderData, userId) {
    const {
      eventId,
      tickets,
      buyerName,
      buyerEmail,
      buyerCpf,
      paymentMethod,
    } = orderData;

    // Calcular total
    let total = 0;
    for (const ticket of tickets) {
      // Buscar preço do ticket
      const ticketResult = await query(
        'SELECT price FROM tickets WHERE id = $1',
        [ticket.typeId]
      );
      if (ticketResult.rows.length === 0) {
        throw new Error(`Ticket ${ticket.typeId} não encontrado`);
      }
      total += ticketResult.rows[0].price * ticket.quantity;
    }

    // Calcular valor líquido (descontar taxa de 10%)
    const netAmount = total * 0.9;

    // Gerar ID do pedido
    const orderId = `EVL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const result = await query(
      `INSERT INTO orders (
        id, buyer_id, buyer_name, buyer_email, buyer_cpf,
        event_id, total, net_amount, status, payment_method
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        orderId,
        userId,
        buyerName,
        buyerEmail,
        buyerCpf,
        eventId,
        total,
        netAmount,
        'pending',
        paymentMethod,
      ]
    );

    const order = result.rows[0];

    // Criar order_tickets
    await Promise.all(
      tickets.map(async (ticket) => {
        const ticketResult = await query(
          'SELECT price, name FROM tickets WHERE id = $1',
          [ticket.typeId]
        );
        if (ticketResult.rows.length === 0) {
          throw new Error(`Ticket ${ticket.typeId} não encontrado`);
        }

        await query(
          `INSERT INTO order_tickets (order_id, ticket_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, ticket.typeId, ticket.quantity, ticketResult.rows[0].price]
        );

        // Atualizar disponibilidade do ticket
        await query(
          'UPDATE tickets SET available = available - $1 WHERE id = $2',
          [ticket.quantity, ticket.typeId]
        );
      })
    );

    return await this.findById(orderId, userId);
  },

  /**
   * Busca tickets de um pedido
   */
  async findTicketsByOrderId(orderId) {
    const result = await query(
      `SELECT 
        ot.ticket_id as type_id,
        t.name as type_name,
        ot.quantity,
        ot.price
      FROM order_tickets ot
      LEFT JOIN tickets t ON ot.ticket_id = t.id
      WHERE ot.order_id = $1`,
      [orderId]
    );
    return result.rows;
  },

  /**
   * Atualiza status do pedido
   */
  async updateStatus(id, status, userId = null) {
    let queryText = 'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    const params = [status, id];

    if (userId) {
      queryText += ' AND buyer_id = $3';
      params.push(userId);
    }

    await query(queryText, params);
    return await this.findById(id, userId);
  },
};

