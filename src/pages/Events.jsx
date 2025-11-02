import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function Events() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('all')

  // Загружаем события при инициализации
  useEffect(() => {
    loadEvents()
  }, [])

  // Функция для проверки, является ли строка ссылкой
  const isUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const loadEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://omnia-backend-fyuo.onrender.com/api/events')
      if (response.ok) {
        const data = await response.json()
        
        // Проверяем регистрацию пользователя для каждого события
        const userToken = localStorage.getItem('userAccessToken')
        const formattedEvents = await Promise.all(data.data.map(async (event) => {
          let isRegistered = false
          
          if (userToken) {
            try {
              const registrationResponse = await fetch(`https://omnia-backend-fyuo.onrender.com/api/events/${event.id}/check-registration`, {
                headers: {
                  'Authorization': `Bearer ${userToken}`
                }
              })
              if (registrationResponse.ok) {
                const registrationData = await registrationResponse.json()
                isRegistered = registrationData.isRegistered
              }
            } catch (error) {
              console.log('Error checking registration:', error)
            }
          }
          
          return {
            ...event,
            fullDate: new Date(`${event.date} ${event.time}`),
            isRegistered
          }
        }))
        
        setEvents(formattedEvents)
      } else {
        console.error('Failed to load events')
        setEvents([])
      }
    } catch (error) {
      console.error('Error loading events:', error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  // Если передан ID события, показываем детальную страницу
  if (eventId) {
    const event = events.find(e => e.id === parseInt(eventId))
    
    if (!event && !loading) {
      return (
        <div className="py-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900">Событие не найдено</h2>
          <button
            onClick={() => navigate('/events')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Вернуться к списку событий
          </button>
        </div>
      )
    }

    if (loading || !event) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
          </div>
        </div>
      )
    }

    const handleRegister = async () => {
      const userToken = localStorage.getItem('userAccessToken')
      
      if (!userToken) {
        alert('Необходимо войти в аккаунт для регистрации на событие')
        navigate('/login')
        return
      }
      
      try {
        const url = `https://omnia-backend-fyuo.onrender.com/api/events/${event.id}/register`
        const method = event.isRegistered ? 'DELETE' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const result = await response.json()
          
          // Обновляем локальное состояние
          setEvents(prev => prev.map(e => 
            e.id === event.id 
              ? { 
                  ...e, 
                  isRegistered: !e.isRegistered
                }
              : e
          ))
          
          alert(result.message)
        } else {
          const error = await response.json()
          alert(error.message || 'Ошибка при регистрации')
        }
      } catch (error) {
        console.error('Error registering for event:', error)
        alert('Ошибка при регистрации на событие')
      }
    }

    return (
      <div className="flex justify-center">
        <div className="w-full max-w-2xl space-y-6">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center text-indigo-600 transition-colors cursor-pointer hover:text-indigo-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к событиям
          </button>

          <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-zinc-200">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-64"
            />
          )}
          
          <div className="p-6">
            <div className="mb-4">
              {event.category && (
                <span className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                  {event.category}
                </span>
              )}
            </div>

            <h1 className="mb-4 text-3xl font-bold text-zinc-900">{event.title}</h1>

            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
              <div className="flex items-center text-zinc-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(event.date).toLocaleDateString('ru-RU')}
              </div>
              <div className="flex items-center text-zinc-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {event.time}
              </div>
              {event.location && (
                <div className="flex items-center text-zinc-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {isUrl(event.location) ? (
                    <a 
                      href={event.location} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      {event.location}
                    </a>
                  ) : (
                    event.location
                  )}
                </div>
              )}
            </div>

            {event.organizer && (
              <div className="mb-4">
                <p className="text-sm text-zinc-600">
                  <strong>Организатор:</strong> {event.organizer}
                </p>
              </div>
            )}

            <p className="mb-6 leading-relaxed text-zinc-700">
              {event.full_description || event.description}
            </p>

            <button
              onClick={handleRegister}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer ${
                event.isRegistered
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {event.isRegistered ? 'Отменить регистрацию' : 'Зарегистрироваться'}
            </button>
          </div>
        </div>
        </div>
      </div>
    )
  }

  // Основная страница со списком событий
  const handleRegister = async (eventId) => {
    const userToken = localStorage.getItem('userAccessToken')
    
    if (!userToken) {
      alert('Необходимо войти в аккаунт для регистрации на событие')
      navigate('/login')
      return
    }
    
    const event = events.find(e => e.id === eventId)
    if (!event) return
    
    try {
      const url = `https://omnia-backend-fyuo.onrender.com/api/events/${eventId}/register`
      const method = event.isRegistered ? 'DELETE' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        
        // Обновляем локальное состояние
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                isRegistered: !event.isRegistered
              }
            : event
        ))
        
        // Показываем сообщение об успешной регистрации/отмене
        if (!event.isRegistered) {
          alert('Вы успешно зарегистрированы на событие!')
        } else {
          alert('Регистрация отменена')
        }
      } else {
        const error = await response.json()
        alert(error.message || 'Ошибка при регистрации')
      }
    } catch (error) {
      console.error('Error registering for event:', error)
      alert('Ошибка при регистрации на событие')
    }
  }

  // Фильтрация событий по табам
  const filteredEvents = selectedTab === 'all' 
    ? events 
    : events.filter(event => event.isRegistered)

  if (loading) {
    return (
      <div className="pb-20 space-y-6 lg:pb-0">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20 space-y-6 lg:pb-0">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">События</h1>
        <p className="text-zinc-600">Участвуйте в мероприятиях сообщества и развивайтесь вместе с нами</p>
      </div>

      {/* Табы для фильтрации событий */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            selectedTab === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
          }`}
        >
          Все события
        </button>
        <button
          onClick={() => setSelectedTab('registered')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            selectedTab === 'registered'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
          }`}
        >
          Мои записи
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="p-8 text-center text-zinc-500">
          <p className="text-lg">
            {selectedTab === 'all' ? 'Нет доступных событий' : 'Вы не записаны ни на одно событие'}
          </p>
          <p className="text-sm">
            {selectedTab === 'all' ? 'События будут добавлены позже' : 'Найдите интересное событие и запишитесь'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <div key={event.id} className="overflow-hidden transition-shadow bg-white border shadow-sm rounded-2xl border-zinc-200 hover:shadow-md">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="object-cover w-full h-48"
                />
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  {event.category && (
                    <span className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                      {event.category}
                    </span>
                  )}
                </div>

                <h3 className="mb-2 text-xl font-semibold text-zinc-900">{event.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-zinc-600">{event.description}</p>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-sm text-zinc-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(event.date).toLocaleDateString('ru-RU')} в {event.time}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-sm text-zinc-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {isUrl(event.location) ? (
                        <a 
                          href={event.location} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                          {event.location}
                        </a>
                      ) : (
                        event.location
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="flex-1 px-4 py-2 transition-colors border rounded-lg cursor-pointer border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                  >
                    Подробнее
                  </button>
                  <button
                    onClick={() => handleRegister(event.id)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                      event.isRegistered
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {event.isRegistered ? 'Отменить' : 'Участвовать'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}