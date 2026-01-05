import { query } from '../database/connection.js';
import bcrypt from 'bcryptjs';

export const userModel = {
  /**
   * Busca usuário por email
   */
  async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },

  /**
   * Busca usuário por ID
   */
  async findById(id) {
    const result = await query(
      'SELECT id, name, email, role, avatar, stripe_status, is_verified, kyc_status, verification_date, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Cria novo usuário
   */
  async create(userData) {
    const { name, email, password, role = 'BUYER' } = userData;
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, avatar, is_verified, kyc_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, role, avatar, stripe_status, is_verified, kyc_status, verification_date, created_at, updated_at`,
      [
        name,
        email,
        hashedPassword,
        role,
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        role === 'ADMIN', // Admins já nascem verificados
        role === 'ORGANIZER' ? 'pending' : 'not_started',
      ]
    );
    
    return result.rows[0];
  },

  /**
   * Verifica senha do usuário
   */
  async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return null;
    }
    
    // Retorna usuário sem a senha
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  /**
   * Atualiza dados do usuário
   */
  async update(id, updates) {
    const allowedFields = ['name', 'avatar', 'stripe_status', 'is_verified', 'kyc_status', 'verification_date'];
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

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE users 
       SET ${fields.join(', ')} 
       WHERE id = $${paramIndex}
       RETURNING id, name, email, role, avatar, stripe_status, is_verified, kyc_status, verification_date, created_at, updated_at`,
      values
    );

    return result.rows[0] || null;
  },

  /**
   * Formata usuário para resposta da API (remove password_hash)
   */
  formatUser(user) {
    if (!user) return null;
    const { password_hash, ...formatted } = user;
    return formatted;
  },
};

