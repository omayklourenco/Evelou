/**
 * Middleware de tratamento de erros
 * Captura erros e retorna respostas padronizadas
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err);

  // Erro de validação Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.errors,
    });
  }

  // Erro JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token inválido',
      message: err.message,
    });
  }

  // Erro padrão
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

