// Конфигурация API для приложения
export const API_CONFIG = {
  BASE_URL: 'https://omnia-backend-fyuo.onrender.com',
  ENDPOINTS: {
    // Аутентификация
    AUTH_LOGIN: '/api/auth/login',
    ADMIN_LOGIN: '/api/admin/login',
    
    // Пользователи
    USERS: '/api/users/',
    USER_PROFILE: '/api/users/profile',
    USER_CREATE: '/api/users/create',
    
    // База знаний
    KNOWLEDGE_CATEGORIES: '/api/knowledge/categories',
    KNOWLEDGE_ARTICLES: '/api/knowledge/articles',
    
    // События
    EVENTS: '/api/events',
    EVENT_REGISTRATIONS: (eventId) => `/api/events/${eventId}/registrations`,
    EVENT_CHECK_REGISTRATION: (eventId) => `/api/events/${eventId}/check-registration`,
    EVENT_REGISTER: (eventId) => `/api/events/${eventId}/register`,
    
    // Задачи
    TASK_CATEGORIES: '/api/task-categories',
    TASK_CATEGORIES_PUBLIC: '/api/task-categories/public',
    TASKS: '/api/tasks',
    TASKS_PUBLIC: '/api/tasks/public'
  }
}

// Вспомогательная функция для создания полного URL
export const createApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Вспомогательная функция для запросов с авторизацией
export const createAuthHeaders = (token, isAdmin = false) => {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    if (isAdmin) {
      headers['Admin-Authorization'] = `Bearer ${token}`
    } else {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}