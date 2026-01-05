import { verifyToken, extractToken } from '../utils/jwt.js';

/**
 * Middleware de autenticação
 * Verifica se o usuário está autenticado através do token JWT
 */
export const authenticate = (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token não fornecido',
        message: 'É necessário estar autenticado para acessar este recurso'
      });
    }

    const decoded = verifyToken(token);
    
    // Adiciona informações do usuário ao request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Token inválido',
      message: error.message || 'Token expirado ou inválido'
    });
  }
};

/**
 * Middleware de autorização por role
 * Verifica se o usuário tem a role necessária para acessar o recurso
 * @param {...string} allowedRoles - Roles permitidas
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Não autenticado',
        message: 'É necessário estar autenticado'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acesso negado',
        message: 'Você não tem permissão para acessar este recurso'
      });
    }

    next();
  };
};

