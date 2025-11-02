import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('https://omnia-backend-fyuo.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (data.success) {
        // Сохраняем данные пользователя и токен
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(data.data.user))
        localStorage.setItem('userAccessToken', data.data.token)
        
        // Перенаправляем пользователя
        navigate('/knowledge-base')
      } else {
        setError(data.message || 'Ошибка авторизации')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Ошибка соединения с сервером')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-zinc-50 to-zinc-100">
      <div className="w-full max-w-md">
        <div className="p-8 bg-white shadow-xl rounded-3xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-zinc-900">Добро пожаловать</h1>
            <p className="text-zinc-600">Войдите в образовательное сообщество</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-zinc-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 transition-all duration-200 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-zinc-700">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 transition-all duration-200 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-medium text-white transition-all duration-200 bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/admin/login" 
              className="text-sm transition-colors text-zinc-500 hover:text-zinc-700"
            >
              Вход для администратора
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}