import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LOGO_MAIN, DEFAULT_USER_AVATAR } from '../assets/images'

const navigation = [
  {
    name: 'Dashboard',
    href: 'dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15v-4m4 4v-6m4 6V9" />
      </svg>
    )
  },
  {
    name: 'Профиль',
    href: 'profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    name: 'Лента постов',
    href: 'posts',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
      </svg>
    )
  },
  {
    name: 'База знаний',
    href: 'knowledge-base',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    name: 'События',
    href: 'events',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  }
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Функция для определения цвета рамки по рангу
  const getRankBorderColor = (rank) => {
    switch(rank) {
      case 'Новичок':
        return 'bg-gradient-to-r from-zinc-400 to-zinc-600 p-[2px] rounded-full'
      case 'Ученик':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 p-[2px] rounded-full'
      case 'Исследователь':
        return 'bg-gradient-to-r from-sky-400 to-sky-600 p-[2px] rounded-full'
      case 'Мастер':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 p-[2px] rounded-full'
      case 'Легенда':
        return 'bg-gradient-to-r from-yellow-400 to-red-500 p-[2px] rounded-full'
      default:
        return 'bg-gradient-to-r from-zinc-400 to-zinc-600 p-[2px] rounded-full'
    }
  }

  return (
    <>
      {/* Десктопная версия */}
      <div className="flex-col hidden w-64 h-full bg-white border-r lg:flex border-zinc-200">
        {/* Заголовок */}
        <div className="p-6 border-b border-zinc-200">
          <div className="flex items-center space-x-3">
            <img 
              src={LOGO_MAIN} 
              alt="Omnia Logo" 
              className="w-10 h-10"
            />
            <div className='pb-1'>
              <h1 className="text-xl font-bold text-zinc-900">Omnia</h1>
              <p className="text-sm leading-none text-zinc-600">Всё для избранных</p>
            </div>
          </div>
        </div>

        {/* Профиль пользователя */}
        <div className="p-4 transition-colors border-b cursor-pointer border-zinc-200 hover:bg-zinc-50" onClick={handleProfileClick}>
          <div className="flex items-center space-x-3">
            <div className={getRankBorderColor(user.rank)}>
              <img
                src={user.avatar || DEFAULT_USER_AVATAR}
                alt={user.name}
                className="object-cover w-10 h-10 rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-zinc-900">
                {user.name} {user.surname}
              </p>
              <p className="text-xs truncate text-zinc-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Навигация */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === `/${item.href}` || 
                            (item.href === 'events' && location.pathname.startsWith('/events/'))
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 border-r-2 border-sky-700'
                    : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Кнопка выхода */}
        <div className="p-4 border-t border-zinc-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-700 transition-colors rounded-lg cursor-pointer hover:bg-red-50"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти
          </button>
        </div>
      </div>

      {/* Мобильная версия - плавающий островок */}
      <div className="fixed z-50 transform -translate-x-1/2 lg:hidden bottom-6 left-1/2">
        <div className="px-6 py-3 bg-white border rounded-full shadow-lg border-zinc-200">
          <div className="flex items-center space-x-4">
            {navigation.map((item) => {
              const isActive = location.pathname === `/${item.href}` || 
                              (item.href === 'events' && location.pathname.startsWith('/events/'))
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`p-3 rounded-full transition-colors ${
                    isActive
                      ? 'bg-sky-100 text-sky-700'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  {item.icon}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}