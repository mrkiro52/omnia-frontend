import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('https://omnia-backend-fyuo.onrender.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (data.success) {
        // Сохраняем токен и данные админа
        localStorage.setItem('isAdmin', 'true')
        localStorage.setItem('adminAccessToken', data.data.token)
        localStorage.setItem('adminUser', JSON.stringify(data.data.user))
        navigate('/admin')
      } else {
        setError(data.message || 'Неверные данные администратора')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      setError('Ошибка соединения с сервером')
    }

    setIsLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-zinc-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-bold text-center text-zinc-900">
            Админ панель
          </h2>
          <p className="mt-2 text-sm text-center text-zinc-600">
            Введите данные администратора
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-700">
                Имя пользователя
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border rounded-lg shadow-sm border-zinc-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Введите логин"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border rounded-lg shadow-sm border-zinc-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Введите пароль"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg cursor-pointer group hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Проверка...' : 'Войти в админ панель'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm cursor-pointer text-zinc-600 hover:text-zinc-900"
            >
              ← Вернуться к обычному входу
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}