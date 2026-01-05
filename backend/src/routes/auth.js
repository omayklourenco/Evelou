import express from 'express';
import { z } from 'zod';
import { generateToken } from '../utils/jwt.js';
import { authenticate } from '../middleware/auth.js';
import { userModel } from '../models/userModel.js';

const router = express.Router();

// Schema de validação para login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['BUYER', 'ORGANIZER', 'ADMIN']).optional(),
});

// Schema de validação para registro
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['BUYER', 'ORGANIZER', 'ADMIN']).default('BUYER'),
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    
    // Buscar e verificar usuário no banco de dados
    const user = await userModel.verifyPassword(data.email, data.password);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar role se especificada
    if (data.role && user.role !== data.role) {
      return res.status(403).json({ 
        error: 'Role incorreta',
        message: `Este usuário não tem a role ${data.role}`
      });
    }

    // Formatar usuário para resposta
    const formattedUser = userModel.formatUser(user);

    // Gerar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      user: formattedUser,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      });
    }
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    
    // Verificar se email já existe
    const existingUser = await userModel.findByEmail(data.email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email já cadastrado',
        message: 'Este email já está em uso'
      });
    }
    
    // Criar usuário no banco (hash da senha é feito no model)
    const user = await userModel.create(data);

    // Formatar usuário para resposta
    const formattedUser = userModel.formatUser(user);

    // Gerar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      user: formattedUser,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      });
    }
    
    // Erro de constraint do banco (email duplicado)
    if (error.code === '23505') {
      return res.status(409).json({ 
        error: 'Email já cadastrado',
        message: 'Este email já está em uso'
      });
    }
    
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // TODO: Invalidar token no banco de dados
  res.json({ message: 'Logout realizado com sucesso' });
});

// GET /api/auth/me - Requer autenticação
router.get('/me', authenticate, async (req, res) => {
  try {
    // Buscar dados completos do usuário no banco de dados
    const user = await userModel.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuário não encontrado',
        message: 'Usuário não existe no banco de dados'
      });
    }

    // Formatar usuário para resposta
    const formattedUser = userModel.formatUser(user);

    res.json(formattedUser);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
  }
});

export default router;

