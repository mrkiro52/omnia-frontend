import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const userToken = localStorage.getItem('userAccessToken')
  const user = localStorage.getItem('user')
  
  // Проверяем все необходимые данные для авторизации
  if (!isAuthenticated || !userToken || !user) {
    // Очищаем некорректные данные
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userAccessToken')
    localStorage.removeItem('user')
    
    return <Navigate to="/login" replace />
  }
  
  return children
}