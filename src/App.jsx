import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Импорт компонентов
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Импорт страниц
import Login from './pages/Login'
import KnowledgeBase from './pages/KnowledgeBase'
import Profile from './pages/Profile'
import Posts from './pages/Posts'
import Events from './pages/Events'
import Dashboard from './pages/Dashboard'
import Desktop from './pages/Desktop'

// Импорт админ компонентов
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import Landing from './pages/Landing'

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Админ маршруты */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
        
        {/* Защищенные маршруты с Layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* Редирект с корня на ленту постов */}
          <Route index element={<Navigate to="/posts" replace />} />
          
          {/* Основные страницы */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="desktop" element={<Desktop />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="profile" element={<Profile />} />
          <Route path="posts" element={<Posts />} />
          
          {/* Маршруты для событий */}
          <Route path="events" element={<Events />} />
          <Route path="events/:eventId" element={<Events />} />
        </Route>
        
        {/* Редирект на авторизацию для всех остальных маршрутов */}
        <Route path="*" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  )
}

export default App
