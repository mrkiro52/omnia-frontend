import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_USER_AVATAR } from '../assets/images'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [showRankModal, setShowRankModal] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    localStorage.removeItem('userAccessToken')
    navigate('login')
  }

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('userAccessToken')
      if (!token) {
        navigate('login')
        return
      }

      const response = await fetch('https://omnia-backend-fyuo.onrender.com/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setUser(result.data)
          setFormData(result.data)
        } else {
          console.error('Invalid response format:', result)
          navigate('login')
        }
      } else if (response.status === 401) {
        // Токен недействителен
        localStorage.removeItem('userAccessToken')
        localStorage.removeItem('user')
        localStorage.removeItem('isAuthenticated')
        navigate('login')
      } else {
        console.error('Failed to load profile, status:', response.status)
        const errorData = await response.json().catch(() => ({}))
        console.error('Error details:', errorData)
        alert('Ошибка загрузки профиля. Попробуйте перезайти в аккаунт.')
        navigate('login')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      alert('Ошибка соединения с сервером. Проверьте подключение к интернету.')
      navigate('login')
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('userAccessToken')
      if (!token) {
        navigate('login')
        return
      }

      const response = await fetch('https://omnia-backend-fyuo.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          avatar: formData.avatar
        })
      })

      if (response.ok) {
        const result = await response.json()
        setUser(result.data)
        localStorage.setItem('user', JSON.stringify(result.data))
        setIsEditing(false)
        alert('Профиль успешно обновлен')
      } else {
        const error = await response.json()
        console.error('Failed to update profile:', error)
        alert('Ошибка обновления профиля: ' + (error.message || 'Неизвестная ошибка'))
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Ошибка обновления профиля')
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Функция для определения ранга и цвета рамки
  const getRankInfo = (rank) => {
    switch (rank) {
      case 'Новичок':
        return { rank: 'Новичок', borderColor: 'border-zinc-400', bgColor: 'bg-zinc-100', textColor: 'text-zinc-700' }
      case 'Ученик':
        return { rank: 'Ученик', borderColor: 'border-blue-400', bgColor: 'bg-blue-100', textColor: 'text-blue-700' }
      case 'Исследователь':
        return { rank: 'Исследователь', borderColor: 'border-purple-400', bgColor: 'bg-purple-100', textColor: 'text-purple-700' }
      case 'Мастер':
        return { rank: 'Мастер', borderColor: 'border-yellow-400', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' }
      case 'Легенда':
        return { rank: 'Легенда', borderColor: 'bg-gradient-to-r from-yellow-400 to-red-500 p-[4px]', bgColor: 'bg-gradient-to-r from-yellow-100 to-red-100', textColor: 'text-red-700' }
      default:
        return { rank: 'Новичок', borderColor: 'border-zinc-400', bgColor: 'bg-zinc-100', textColor: 'text-zinc-700' }
    }
  }

  const rankInfo = user ? getRankInfo(user.rank) : { rank: 'Новичок', borderColor: 'border-zinc-400', bgColor: 'bg-zinc-100', textColor: 'text-zinc-700' }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (

    <div className="pb-20 space-y-6 lg:pb-0">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">Профиль</h1>
        <p className="text-zinc-600">Управляйте своей личной информацией</p>
      </div>

      <div className="p-6 bg-white border shadow-sm rounded-2xl border-zinc-200">
        <div className="flex flex-col mb-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col items-center sm:flex-row sm:items-center">
            <div className="relative mb-4 sm:mb-0">
              {rankInfo.rank === 'Легенда' ? (
                <div className={`${rankInfo.borderColor} rounded-full`}>
                  <img
                    src={user.avatar || DEFAULT_USER_AVATAR}
                    alt={`${user.name} ${user.surname}`}
                    className="object-cover w-20 h-20 rounded-full"
                  />
                </div>
              ) : (
                <img
                  src={user.avatar || DEFAULT_USER_AVATAR}
                  alt={`${user.name} ${user.surname}`}
                  className={`w-20 h-20 rounded-full object-cover border-4 ${rankInfo.borderColor}`}
                />
              )}
            </div>
            <div className="text-center sm:ml-6 sm:text-left">
                            <div className="flex flex-col items-center mt-1 space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                <span 
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                    rankInfo.rank === 'Легенда' 
                      ? rankInfo.bgColor + ' ' + rankInfo.textColor
                      : rankInfo.bgColor + ' ' + rankInfo.textColor
                  }`}
                  onClick={() => setShowRankModal(true)}
                >
                  {rankInfo.rank}
                </span>
                <p className="text-sm text-zinc-500">
                  В сообществе с {new Date(user.joinDate).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">
                {user.name} {user.surname}
              </h2>
              <p className="text-zinc-600">{user.email}</p>
            </div>
          </div>
          {/* Кнопка редактирования: на мобильных/малых экранах под данными, на больших справа */}
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="mt-6 lg:mt-0 w-full sm:w-max lg:w-auto px-4 py-2 lg:py-2 text-base lg:text-base text-white transition-colors bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700
              md:px-3 md:py-1.5 md:text-sm
              sm:px-2 sm:py-1 sm:text-sm"
          >
            {isEditing ? 'Сохранить' : 'Редактировать'}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-zinc-700">Имя</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-zinc-900">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-zinc-700">Фамилия</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => handleChange('surname', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-zinc-900">{user.surname}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-zinc-700">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-zinc-900">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-zinc-700">Телефон</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-zinc-900">{user.phone}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-zinc-700">О себе</label>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-zinc-900">{user.bio}</p>
            )}
          </div>

          {isEditing && (
            <div>
              <label className="block mb-2 text-sm font-medium text-zinc-700">URL аватарки</label>
              <input
                type="url"
                value={formData.avatar || ''}
                onChange={(e) => handleChange('avatar', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Вставьте ссылку на изображение для вашего аватара
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно с информацией о рангах */}
      {showRankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center h-screen p-4 bg-black bg-opacity-20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-zinc-900">Система рангов</h3>
              <button
                onClick={() => setShowRankModal(false)}
                className="p-2 transition-colors rounded-full cursor-pointer hover:bg-zinc-100"
              >
                <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3 text-zinc-700">
                <p className="text-lg font-medium">Что означают ранги?</p>
                <p>Ранги в kiro.team.edu — это показатель вашего статуса и опыта в сообществе. Они отражают время, проведенное в закрытой социальной сети, и открывают доступ к дополнительным возможностям.</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-zinc-900">Уровни рангов:</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center p-4 bg-zinc-50 rounded-xl">
                    <div className="flex-shrink-0 w-12 h-12 mr-4 border-4 rounded-full border-zinc-400"></div>
                    <div>
                      <h5 className="font-medium text-zinc-900">Новичок</h5>
                      <p className="text-sm text-zinc-600">Меньше месяца в kiro.team.edu</p>
                      <p className="text-xs text-zinc-500">Серебристо-серая рамка</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                    <div className="flex-shrink-0 w-12 h-12 mr-4 border-4 border-blue-400 rounded-full"></div>
                    <div>
                      <h5 className="font-medium text-zinc-900">Ученик</h5>
                      <p className="text-sm text-zinc-600">1-3 месяца в сообществе</p>
                      <p className="text-xs text-zinc-500">Голубая рамка</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                    <div className="flex-shrink-0 w-12 h-12 mr-4 border-4 border-purple-400 rounded-full"></div>
                    <div>
                      <h5 className="font-medium text-zinc-900">Исследователь</h5>
                      <p className="text-sm text-zinc-600">3-6 месяцев активности</p>
                      <p className="text-xs text-zinc-500">Фиолетовая рамка</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-yellow-50 rounded-xl">
                    <div className="flex-shrink-0 w-12 h-12 mr-4 border-4 border-yellow-400 rounded-full"></div>
                    <div>
                      <h5 className="font-medium text-zinc-900">Мастер</h5>
                      <p className="text-sm text-zinc-600">6-12 месяцев опыта</p>
                      <p className="text-xs text-zinc-500">Золотая рамка</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-linear-to-r from-yellow-50 to-red-50 rounded-xl">
                    <div className="flex justify-center items-center w-12 h-12 bg-linear-to-r from-yellow-400 to-red-500 p-[2px] rounded-full mr-4 flex-shrink-0">
                      <div className="w-10 h-10 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h5 className="font-medium text-zinc-900">Легенда</h5>
                      <p className="text-sm text-zinc-600">Больше года в сообществе</p>
                      <p className="text-xs text-zinc-500">Огненно-золотая градиентная рамка</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl">
                <h4 className="mb-3 text-lg font-semibold text-indigo-900">Преимущества рангов:</h4>
                <ul className="space-y-2 text-sm text-indigo-800">
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-600">•</span>
                    <span><strong>Статус и признание:</strong> Ваш ранг виден всем участникам сообщества</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-600">•</span>
                    <span><strong>Расширенные возможности:</strong> Доступ к созданию постов и участию в дискуссиях</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-600">•</span>
                    <span><strong>Снятие ограничений:</strong> Увеличение лимитов на количество постов и комментариев</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-600">•</span>
                    <span><strong>Эксклюзивный доступ:</strong> Закрытые мероприятия и встречи с опытными участниками</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-600">•</span>
                    <span><strong>Менторство:</strong> Возможность становиться ментором для новичков</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowRankModal(false)}
                  className="px-6 py-2 text-white transition-colors bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700"
                >
                  Понятно
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Кнопка выхода - в самом низу страницы, только на мобильных устройствах */}
      <div className="lg:hidden">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-red-700 transition-colors border border-red-200 rounded-lg cursor-pointer bg-red-50 hover:bg-red-100"
        >
          Выйти из аккаунта
        </button>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}