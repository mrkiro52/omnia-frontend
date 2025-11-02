import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  const userToken = localStorage.getItem('userAccessToken')
  
  if (!isAuthenticated || !userToken) {
    return <Navigate to="/login" replace />
  }
  
  return children
}