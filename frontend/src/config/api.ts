// Configuração da API
// A URL da API é definida via variável de ambiente VITE_API_URL
// Em desenvolvimento: http://localhost:3041
// Em produção: será configurada no docker-compose ou variáveis de ambiente

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3041';

export const apiConfig = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Função helper para fazer requisições
export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const url = `${apiConfig.baseURL}${endpoint}`;
  
  // Obter token do localStorage se existir
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // Se for erro 401 (não autorizado), limpar token
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      // Redirecionar para login se não estiver já na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Métodos HTTP helpers
export const api = {
  get: (endpoint: string) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint: string, data?: any) => 
    apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: (endpoint: string, data?: any) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) =>
    apiRequest(endpoint, { method: 'DELETE' }),
};

