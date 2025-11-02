import { useState, useEffect } from 'react'

const CATEGORIES = ['Все', 'Frontend', 'Backend', 'QA', 'UI/UX', 'Резюме', 'Алгоритмы']

// Функция для определения ранга и цвета рамки
const getRankBorderColor = (authorName) => {
  // Текущий пользователь - Легенда
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (authorName === `${user.name} ${user.surname}` || authorName === 'Вы') {
    return 'bg-gradient-to-r from-yellow-400 to-red-500 p-[2px] rounded-full'
  }
  
  // Рандомные ранги для остальных пользователей
  const ranks = [
    'border-zinc-400 border-2', // Новичок
    'border-blue-400 border-2', // Ученик
    'border-purple-400 border-2', // Исследователь
    'border-yellow-400 border-2' // Мастер
  ]
  
  // Используем имя для создания постоянного рандома
  const nameHash = authorName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  return ranks[Math.abs(nameHash) % ranks.length]
}

const MOCK_POSTS = [
  {
    id: 1,
    author: {
      name: 'Анна Смирнова',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    category: 'Frontend',
    title: 'Лучшие практики работы с React Hooks',
    content: 'Поделюсь своими наблюдениями по работе с хуками в React. В этом посте разберем основные принципы использования useState, useEffect, useContext и создания кастомных хуков. Рассмотрим распространенные ошибки и лучшие практики, которые помогут писать более чистый и эффективный код. Особенно полезно для начинающих разработчиков, которые только знакомятся с функциональными компонентами.',
    likes: 24,
    comments: 8,
    timestamp: '2 часа назад',
    isLiked: false,
    commentsData: [
      {
        id: 1,
        author: {
          name: 'Иван Петров',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        content: 'Отличная статья! Особенно полезны примеры с useEffect. Можете больше рассказать про оптимизацию?',
        timestamp: '1 час назад'
      },
      {
        id: 2,
        author: {
          name: 'Мария Козлова',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        },
        content: 'Спасибо за подробное объяснение кастомных хуков. Это именно то, что я искала!',
        timestamp: '30 минут назад'
      }
    ]
  },
  {
    id: 2,
    author: {
      name: 'Дмитрий Козлов',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    category: 'Backend',
    title: 'Микросервисы vs Монолит: что выбрать?',
    content: 'Разбираем плюсы и минусы различных архитектурных подходов в современной разработке. В статье рассматриваются критерии выбора между монолитной и микросервисной архитектурой, анализируются реальные кейсы и проблемы масштабирования. Делюсь опытом миграции с монолита на микросервисы в крупном проекте, включая технические сложности, временные затраты и полученные результаты.',
    likes: 18,
    comments: 12,
    timestamp: '5 часов назад',
    isLiked: true,
    commentsData: [
      {
        id: 3,
        author: {
          name: 'Алексей Сидоров',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        content: 'У нас тоже была похожая миграция. Согласен, что главное - это команда и процессы.',
        timestamp: '3 часа назад'
      }
    ]
  },
  {
    id: 3,
    author: {
      name: 'Елена Волкова',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    category: 'UI/UX',
    title: 'Принципы создания интуитивных интерфейсов',
    content: 'Как сделать так, чтобы пользователи сразу понимали, как работать с вашим продуктом без длительного изучения интерфейса. Рассматриваем основные принципы интуитивного дизайна: ментальные модели пользователей, паттерны взаимодействия, визуальную иерархию и обратную связь. Практические советы по проведению пользовательских тестирований и итеративному улучшению интерфейса на основе реальной обратной связи.',
    likes: 31,
    comments: 6,
    timestamp: '1 день назад',
    isLiked: false,
    commentsData: []
  },
  {
    id: 4,
    author: {
      name: 'Максим Петров',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    category: 'QA',
    title: 'Автоматизация тестирования: с чего начать?',
    content: 'Пошаговый план внедрения автоматизации тестирования в существующий проект с нуля. Рассмотрим популярные инструменты и фреймворки: Selenium, Cypress, Playwright, Jest. Обсудим стратегии тестирования: модульные тесты, интеграционные тесты, E2E тестирование. Практические советы по написанию стабильных тестов, организации тестовых данных и интеграции в CI/CD пайплайн для непрерывной поставки качественного кода.',
    likes: 15,
    comments: 4,
    timestamp: '2 дня назад',
    isLiked: false,
    commentsData: []
  }
]

export default function Posts() {
  const [posts, setPosts] = useState(MOCK_POSTS)
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [newPost, setNewPost] = useState('')
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  const [expandedComments, setExpandedComments] = useState(null)
  const [newComment, setNewComment] = useState('')

  const filteredPosts = selectedCategory === 'Все' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ))
  }

  const handleToggleComments = (postId) => {
    setExpandedComments(expandedComments === postId ? null : postId)
    setNewComment('')
  }

  const handleAddComment = (postId) => {
    if (!newComment.trim()) return
    
    const comment = {
      id: Date.now(),
      author: {
        name: 'Вы',
        avatar: JSON.parse(localStorage.getItem('user') || '{}').avatar
      },
      content: newComment,
      timestamp: 'только что'
    }
    
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments + 1,
            commentsData: [...(post.commentsData || []), comment]
          }
        : post
    ))
    
    setNewComment('')
  }

  const handleAddPost = () => {
    if (!newPost.trim()) return
    
    // TODO: Заглушка - заменить на реальный API запрос
    const post = {
      id: Date.now(),
      author: {
        name: 'Вы',
        avatar: JSON.parse(localStorage.getItem('user') || '{}').avatar
      },
      category: selectedCategory === 'Все' ? 'Frontend' : selectedCategory,
      title: 'Новый пост',
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: 'только что',
      isLiked: false
    }
    
    setPosts(prev => [post, ...prev])
    setNewPost('')
    setShowNewPostForm(false)
  }

  return (
    <div className="pb-20 space-y-8 lg:pb-0">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 bg-clip-text">
            Лента постов
          </h1>
          <p className="text-lg text-zinc-600">Инсайды и мысли топовых участников сообщества</p>
        </div>
        <button
          onClick={() => setShowNewPostForm(true)}
          className="relative px-6 py-3 font-medium text-white transition-all duration-300 transform cursor-pointer group bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 sm:px-6 sm:py-3 w-max sm:w-auto"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Создать пост
          </span>
          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 rounded-2xl group-hover:opacity-100"></div>
        </button>
      </div>

      {/* Адаптивный макет */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Основной контент - посты */}
        <div className="lg:w-2/3">
          {/* Фильтры по категориям для мобильных устройств */}
          <div className="flex flex-wrap gap-3 mb-8 lg:hidden">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`group relative px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white/80 backdrop-blur-sm text-zinc-700 hover:bg-white hover:shadow-lg border border-zinc-200/50'
                }`}
              >
                <span className="relative z-10">{category}</span>
                {selectedCategory === category && (
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 rounded-2xl group-hover:opacity-100"></div>
                )}
              </button>
            ))}
          </div>

          {/* Форма создания поста */}
          {showNewPostForm && (
            <div className="relative p-8 mb-8 border shadow-2xl bg-gradient-to-br from-white via-sky-50/30 to-blue-50/30 backdrop-blur-sm border-white/50 rounded-3xl shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-blue-500/5 to-indigo-500/5 rounded-3xl"></div>
              <div className="relative z-10">
                <h3 className="mb-6 text-xl font-bold text-transparent bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 bg-clip-text">
                  Создать новый пост
                </h3>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Поделитесь своими мыслями..."
                  rows={4}
                  className="w-full px-4 py-3 transition-all duration-300 border resize-none bg-white/80 backdrop-blur-sm border-zinc-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowNewPostForm(false)}
                    className="cursor-pointer px-6 py-2.5 text-zinc-600 font-medium bg-white/80 backdrop-blur-sm border border-zinc-200/50 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-105"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleAddPost}
                    className="cursor-pointer group relative px-6 py-2.5 text-white font-medium bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                  >
                    <span className="relative z-10">Опубликовать</span>
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 rounded-xl group-hover:opacity-100"></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Список постов */}
          <div className="space-y-8">
            {filteredPosts.map((post) => (
              <div key={post.id} className="group relative w-full overflow-hidden bg-gradient-to-br from-white via-sky-50/20 to-blue-50/20 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl shadow-blue-500/10 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02]">
                <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-sky-500/5 via-blue-500/5 to-indigo-500/5 rounded-3xl group-hover:opacity-100"></div>
                <div className="relative z-10 p-8">
                  {/* Информация о пользователе */}
                  <div className="flex items-center mb-6">
                    {getRankBorderColor(post.author.name).includes('gradient') ? (
                      <div className={getRankBorderColor(post.author.name)}>
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="object-cover w-12 h-12 rounded-full"
                        />
                      </div>
                    ) : (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className={`w-12 h-12 rounded-full object-cover mr-4 ${getRankBorderColor(post.author.name)}`}
                      />
                    )}
                    {getRankBorderColor(post.author.name).includes('gradient') && <div className="mr-4"></div>}
                    <div className="flex-1">
                      <h3 className="font-semibold text-zinc-900">{post.author.name}</h3>
                      <div className="flex items-center text-sm text-zinc-500">
                        <span className="px-3 py-1.5 mr-3 text-xs font-medium text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 rounded-full shadow-lg shadow-blue-500/25">
                          {post.category}
                        </span>
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Контент поста */}
                  <div className="pb-6">
                    {post.title && (
                      <h2 className="mb-4 text-2xl font-bold leading-tight text-transparent bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-clip-text">{post.title}</h2>
                    )}
                    <p className="text-lg leading-relaxed text-zinc-700">{post.content}</p>
                  </div>

                  <div className="flex items-center gap-6 pt-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`group flex items-center space-x-2 px-4 py-3 rounded-2xl font-medium transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                        post.isLiked
                          ? 'text-red-600 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30'
                          : 'text-zinc-600 bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-lg border border-zinc-200/50'
                      }`}
                    >
                      <svg className={`w-5 h-5 transition-transform duration-300 ${post.isLiked ? 'scale-110' : 'group-hover:scale-110'}`} fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-semibold">{post.likes}</span>
                    </button>

                    <button
                      onClick={() => handleToggleComments(post.id)}
                      className="flex items-center px-4 py-3 space-x-2 font-medium transition-all duration-300 transform border cursor-pointer group rounded-2xl text-zinc-600 bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-lg border-zinc-200/50 hover:scale-105"
                    >
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span className="font-semibold">{post.comments}</span>
                    </button>
                  </div>

                  {/* Секция комментариев */}
                  {expandedComments === post.id && (
                    <div className="mt-6">
                      <div className="pt-6 space-y-6">
                        {/* Существующие комментарии */}
                        {(post.commentsData || []).length > 0 ? (
                          (post.commentsData || []).map((comment) => (
                            <div key={comment.id} className="flex items-start p-4 space-x-4 border bg-white/50 backdrop-blur-sm rounded-2xl border-white/60">
                              {getRankBorderColor(comment.author.name).includes('gradient') ? (
                                <div className={getRankBorderColor(comment.author.name).replace('p-[4px]', 'p-[2px]')}>
                                  <img
                                    src={comment.author.avatar}
                                    alt={comment.author.name}
                                    className="object-cover w-10 h-10 rounded-full"
                                  />
                                </div>
                              ) : (
                                <img
                                  src={comment.author.avatar}
                                  alt={comment.author.name}
                                  className={`w-10 h-10 rounded-full object-cover ${getRankBorderColor(comment.author.name).replace('border-2', 'border-2')}`}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold text-zinc-900">{comment.author.name}</h4>
                                  <span className="px-2 py-1 text-xs rounded-full text-zinc-500 bg-zinc-100">{comment.timestamp}</span>
                                </div>
                                <p className="mt-2 leading-relaxed text-zinc-700">{comment.content}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center py-12 text-center border bg-gradient-to-br from-white/50 to-indigo-50/30 backdrop-blur-sm rounded-2xl border-white/60">
                            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl">
                              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                              </svg>
                            </div>
                            <h4 className="mb-2 font-semibold text-zinc-800">Пока нет комментариев</h4>
                            <p className="text-zinc-600">Будьте первым, кто оставит комментарий!</p>
                          </div>
                        )}

                        {/* Форма добавления комментария */}
                        <div className="flex items-start pt-6 space-x-4">
                          {getRankBorderColor('Вы').includes('gradient') ? (
                            <div className={getRankBorderColor('Вы').replace('p-[4px]', 'p-[2px]')}>
                              <img
                                src={JSON.parse(localStorage.getItem('user') || '{}').avatar}
                                alt="Вы"
                                className="object-cover w-10 h-10 rounded-full"
                              />
                            </div>
                          ) : (
                            <img
                              src={JSON.parse(localStorage.getItem('user') || '{}').avatar}
                              alt="Вы"
                              className={`w-10 h-10 rounded-full object-cover ${getRankBorderColor('Вы').replace('border-2', 'border-2')}`}
                            />
                          )}
                          <div className="flex-1">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Напишите комментарий..."
                              rows={3}
                              className="w-full px-4 py-3 transition-all duration-300 border resize-none bg-white/80 backdrop-blur-sm border-zinc-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                            />
                            <div className="flex justify-end mt-3">
                              <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={!newComment.trim()}
                                className="group relative px-5 py-2.5 text-white font-medium bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                              >
                                <span className="relative z-10">Отправить</span>
                                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 rounded-xl group-hover:opacity-100"></div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Боковая панель категорий для десктопа */}
        <div className="hidden lg:block lg:w-1/3">
          <div className="sticky top-6">
            <div className="relative p-8 border shadow-2xl bg-gradient-to-br from-white via-sky-50/30 to-blue-50/30 backdrop-blur-sm border-white/50 rounded-3xl shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-blue-500/5 to-indigo-500/5 rounded-3xl"></div>
              <div className="relative z-10">
                <h3 className="mb-6 text-xl font-bold text-transparent bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 bg-clip-text">
                  Категории
                </h3>
                <div className="space-y-3">
                  {CATEGORIES.map((category) => {
                    const categoryCount = category === 'Все' 
                      ? posts.length 
                      : posts.filter(post => post.category === category).length
                    
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`group relative w-full text-left px-5 py-4 rounded-2xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-between transform hover:scale-[1.02] ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-white/60 backdrop-blur-sm text-zinc-700 hover:bg-white/80 hover:shadow-lg border border-zinc-200/50'
                        }`}
                      >
                        <span className="relative z-10">{category}</span>
                        <span className={`relative z-10 text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-300 ${
                          selectedCategory === category
                            ? 'bg-white/20 text-white'
                            : 'bg-gradient-to-r from-zinc-100 to-zinc-200 text-zinc-600 group-hover:from-indigo-100 group-hover:to-purple-100'
                        }`}>
                          {categoryCount}
                        </span>
                        {selectedCategory === category && (
                          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 rounded-2xl group-hover:opacity-100"></div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}