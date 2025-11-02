import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = 'https://omnia-backend-fyuo.onrender.com'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [knowledgeBase, setKnowledgeBase] = useState([])
  const [categories, setCategories] = useState([])
  const [events, setEvents] = useState([])
  const [taskCategories, setTaskCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('users')
  const [activeKnowledgeTab, setActiveKnowledgeTab] = useState(null)
  const [showCreateArticleModal, setShowCreateArticleModal] = useState(false)
  const [showEditArticleModal, setShowEditArticleModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [newArticle, setNewArticle] = useState({
    title: '',
    type: 'lesson',
    content: '',
    category: ''
  })
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false)
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({
    title: '',
    description: '',
    icon: '📚'
  })
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    bio: ''
  })
  const [showCreateEventModal, setShowCreateEventModal] = useState(false)
  const [showEditEventModal, setShowEditEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [showEventRegistrations, setShowEventRegistrations] = useState(false)
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState(null)
  const [eventRegistrations, setEventRegistrations] = useState([])
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    full_description: '',
    date: '',
    time: '',
    location: '',
    image: '',
    category: '',
    organizer: ''
  })
  const [showCreateTaskCategoryModal, setShowCreateTaskCategoryModal] = useState(false)
  const [showEditTaskCategoryModal, setShowEditTaskCategoryModal] = useState(false)
  const [editingTaskCategory, setEditingTaskCategory] = useState(null)
  const [newTaskCategory, setNewTaskCategory] = useState({
    name: '',
    description: ''
  })
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [newTask, setNewTask] = useState({
    question: '',
    answer: '',
    solution: '',
    category_id: '',
    difficulty: 'легкая'
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Проверка админ доступа
    const isAdmin = localStorage.getItem('isAdmin')
    const adminToken = localStorage.getItem('adminAccessToken')
    
    if (!isAdmin || !adminToken) {
      navigate('/admin/login')
      return
    }

    // Загрузка данных
    loadData()
  }, [navigate])

  const loadData = async () => {
    try {
      setError('')
      
      // Загружаем пользователей из базы данных
      const usersResponse = await fetch(`${API_BASE_URL}/api/users/`, {
        headers: {
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        }
      })
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.data || [])
      } else {
        setError('Ошибка админ панели: не удалось загрузить пользователей')
        setUsers([])
      }
      
      // Загружаем категории из API
      try {
        const categoriesResponse = await fetch(`${API_BASE_URL}/api/knowledge/categories`)
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.data)
          // Устанавливаем первую категорию как активную
          if (categoriesData.data.length > 0) {
            setActiveKnowledgeTab(categoriesData.data[0].id)
            // Устанавливаем первую категорию по умолчанию для новой статьи
            setNewArticle(prev => ({ ...prev, category: categoriesData.data[0].id }))
          }
        }
      } catch (categoriesError) {
        console.error('Categories load error:', categoriesError)
      }

      // Загружаем базу знаний из API
      try {
        const knowledgeResponse = await fetch(`${API_BASE_URL}/api/knowledge/articles`);
        if (knowledgeResponse.ok) {
          const knowledgeData = await knowledgeResponse.json();
          console.log('Loaded articles:', knowledgeData.data);
          setKnowledgeBase(knowledgeData.data || []);
        } else {
          console.error('Failed to load knowledge base');
          setKnowledgeBase([]);
        }
      } catch (knowledgeError) {
        console.error('Error loading knowledge base:', knowledgeError);
        setKnowledgeBase([]);
      }

      // Загружаем события из API
      try {
        const eventsResponse = await fetch(`${API_BASE_URL}/api/events`);
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.data || []);
        } else {
          console.error('Failed to load events');
          setEvents([]);
        }
      } catch (eventsError) {
        console.error('Error loading events:', eventsError);
        setEvents([]);
      }

      // Загружаем категории задач из API
      try {
        const taskCategoriesResponse = await fetch(`${API_BASE_URL}/api/task-categories`, {
          headers: {
            'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
          }
        });
        if (taskCategoriesResponse.ok) {
          const taskCategoriesData = await taskCategoriesResponse.json();
          setTaskCategories(taskCategoriesData.data || []);
          // Устанавливаем первую категорию задач по умолчанию для новой задачи
          if (taskCategoriesData.data.length > 0) {
            setNewTask(prev => ({ ...prev, category_id: taskCategoriesData.data[0].id }))
          }
        } else {
          console.error('Failed to load task categories');
          setTaskCategories([]);
        }
      } catch (taskCategoriesError) {
        console.error('Error loading task categories:', taskCategoriesError);
        setTaskCategories([]);
      }

      // Загружаем задачи из API
      try {
        const tasksResponse = await fetch(`${API_BASE_URL}/api/tasks`, {
          headers: {
            'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
          }
        });
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          setTasks(tasksData.data || []);
        } else {
          console.error('Failed to load tasks');
          setTasks([]);
        }
      } catch (tasksError) {
        console.error('Error loading tasks:', tasksError);
        setTasks([]);
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Ошибка админ панели: проблема соединения с сервером')
      setUsers([])
      setKnowledgeBase([])
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  const deleteUser = async (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
          }
        })

        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId))
        } else {
          console.error('Failed to delete user')
          alert('Ошибка удаления пользователя')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Ошибка удаления пользователя')
      }
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        },
        body: JSON.stringify(newUser)
      })

      if (response.ok) {
        const result = await response.json()
        setUsers([...users, result.data])
        setShowCreateUserModal(false)
        setNewUser({
          name: '',
          surname: '',
          email: '',
          password: '',
          phone: '',
          bio: ''
        })
        alert('Пользователь успешно создан')
      } else {
        const error = await response.json()
        console.error('Failed to create user:', error.error)
        alert('Ошибка создания пользователя: ' + error.error)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Ошибка создания пользователя')
    }
  }

  const handleCreateArticle = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/knowledge/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        },
        body: JSON.stringify(newArticle)
      })

      if (response.ok) {
        const result = await response.json()
        setKnowledgeBase([...knowledgeBase, result.data])
        setShowCreateArticleModal(false)
        setNewArticle({
          title: '',
          type: 'lesson',
          content: '',
          category: categories.length > 0 ? categories[0].id : ''
        })
        // Перезагружаем данные, чтобы обновить список статей
        await loadData()
        alert('Статья успешно создана')
      } else {
        const error = await response.json()
        console.error('Failed to create article:', error.message)
        alert('Ошибка создания статьи: ' + error.message)
      }
    } catch (error) {
      console.error('Error creating article:', error)
      alert('Ошибка создания статьи')
    }
  }

  const deleteArticle = async (articleId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/knowledge/articles/${articleId}`, {
          method: 'DELETE',
          headers: {
            'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
          }
        })

        if (response.ok) {
          setKnowledgeBase(knowledgeBase.filter(article => article.id !== articleId))
          // Перезагружаем данные для синхронизации
          await loadData()
        } else {
          const error = await response.json()
          console.error('Failed to delete article:', error.message)
          alert('Ошибка удаления статьи')
        }
      } catch (error) {
        console.error('Error deleting article:', error)
        alert('Ошибка удаления статьи')
      }
    }
  }

  const handleEditArticle = (article) => {
    setEditingArticle({
      id: article.id,
      title: article.title,
      type: article.type,
      content: article.content,
      category: article.category
    })
    setShowEditArticleModal(true)
  }

  const handleUpdateArticle = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/knowledge/articles/${editingArticle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        },
        body: JSON.stringify({
          title: editingArticle.title,
          type: editingArticle.type,
          category: editingArticle.category,
          content: editingArticle.content
        })
      })

      if (response.ok) {
        const result = await response.json()
        const updatedArticles = knowledgeBase.map(article => 
          article.id === editingArticle.id ? result.data : article
        )
        
        setKnowledgeBase(updatedArticles)
        setShowEditArticleModal(false)
        setEditingArticle(null)
        // Перезагружаем данные для синхронизации
        await loadData()
        alert('Статья успешно обновлена')
      } else {
        const error = await response.json()
        console.error('Failed to update article:', error.message)
        alert('Ошибка обновления статьи: ' + error.message)
      }
    } catch (error) {
      console.error('Error updating article:', error)
      alert('Ошибка обновления статьи')
    }
  }

  const deletePost = (postId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      setPosts(posts.filter(post => post.id !== postId))
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/knowledge/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        },
        body: JSON.stringify(newCategory)
      })

      if (response.ok) {
        const result = await response.json()
        setCategories([...categories, result.data])
        setShowCreateCategoryModal(false)
        setNewCategory({
          title: '',
          description: '',
          icon: '📚'
        })
        // Перезагружаем данные для синхронизации
        await loadData()
        alert('Категория успешно создана')
      } else {
        const error = await response.json()
        console.error('Failed to create category:', error.message)
        alert('Ошибка создания категории: ' + error.message)
      }
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Ошибка создания категории')
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory({
      id: category.id,
      title: category.title,
      description: category.description,
      icon: category.icon
    })
    setShowEditCategoryModal(true)
  }

  const handleUpdateCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/knowledge/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        },
        body: JSON.stringify({
          title: editingCategory.title,
          description: editingCategory.description,
          icon: editingCategory.icon
        })
      })

      if (response.ok) {
        const result = await response.json()
        const updatedCategories = categories.map(category => 
          category.id === editingCategory.id ? result.data : category
        )
        
        setCategories(updatedCategories)
        setShowEditCategoryModal(false)
        setEditingCategory(null)
        // Перезагружаем данные для синхронизации
        await loadData()
        alert('Категория успешно обновлена')
      } else {
        const error = await response.json()
        console.error('Failed to update category:', error.message)
        alert('Ошибка обновления категории: ' + error.message)
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Ошибка обновления категории')
    }
  }

  const deleteCategory = async (categoryId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию? Это также удалит все статьи в ней.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/knowledge/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
          }
        })

        if (response.ok) {
          setCategories(categories.filter(category => category.id !== categoryId))
          // Обновляем активную вкладку, если удаляемая категория была активной
          if (activeKnowledgeTab === categoryId && categories.length > 1) {
            const remainingCategories = categories.filter(category => category.id !== categoryId)
            setActiveKnowledgeTab(remainingCategories[0]?.id || '')
          }
          // Перезагружаем данные для синхронизации
          await loadData()
        } else {
          const error = await response.json()
          console.error('Failed to delete category:', error.message)
          alert('Ошибка удаления категории: ' + error.message)
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Ошибка удаления категории')
      }
    }
  }

  // Функции для работы с событиями
  const handleCreateEvent = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        },
        body: JSON.stringify(newEvent)
      })

      if (response.ok) {
        const result = await response.json()
        setEvents([...events, result.data])
        setShowCreateEventModal(false)
        setNewEvent({
          title: '',
          description: '',
          full_description: '',
          date: '',
          time: '',
          location: '',
          image: '',
          category: '',
          organizer: ''
        })
        await loadData()
        alert('Событие успешно создано')
      } else {
        const error = await response.json()
        console.error('Failed to create event:', error.message)
        alert('Ошибка создания события: ' + error.message)
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Ошибка создания события')
    }
  }

  const handleEditEvent = (event) => {
    setEditingEvent({
      id: event.id,
      title: event.title,
      description: event.description,
      full_description: event.full_description,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
      category: event.category,
      organizer: event.organizer
    })
    setShowEditEventModal(true)
  }

  const handleUpdateEvent = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        },
        body: JSON.stringify({
          title: editingEvent.title,
          description: editingEvent.description,
          full_description: editingEvent.full_description,
          date: editingEvent.date,
          time: editingEvent.time,
          location: editingEvent.location,
          image: editingEvent.image,
          category: editingEvent.category,
          organizer: editingEvent.organizer
        })
      })

      if (response.ok) {
        const result = await response.json()
        const updatedEvents = events.map(event => 
          event.id === editingEvent.id ? result.data : event
        )
        
        setEvents(updatedEvents)
        setShowEditEventModal(false)
        setEditingEvent(null)
        await loadData()
        alert('Событие успешно обновлено')
      } else {
        const error = await response.json()
        console.error('Failed to update event:', error.message)
        alert('Ошибка обновления события: ' + error.message)
      }
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Ошибка обновления события')
    }
  }

  const deleteEvent = async (eventId) => {
    if (window.confirm('Вы уверены, что хотите удалить это событие?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
          }
        })

        if (response.ok) {
          setEvents(events.filter(event => event.id !== eventId))
          await loadData()
        } else {
          const error = await response.json()
          console.error('Failed to delete event:', error.message)
          alert('Ошибка удаления события')
        }
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Ошибка удаления события')
      }
    }
  }

  const loadEventRegistrations = async (eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/registrations`, {
        headers: {
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setEventRegistrations(data.data)
      } else {
        console.error('Failed to load event registrations')
        setEventRegistrations([])
      }
    } catch (error) {
      console.error('Error loading event registrations:', error)
      setEventRegistrations([])
    }
  }

  const handleViewRegistrations = (event) => {
    setSelectedEventForRegistrations(event)
    setShowEventRegistrations(true)
    loadEventRegistrations(event.id)
  }

  // Функции для работы с категориями задач
  const handleCreateTaskCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/task-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        },
        body: JSON.stringify(newTaskCategory)
      })

      if (response.ok) {
        const result = await response.json()
        setTaskCategories([...taskCategories, result.data])
        setShowCreateTaskCategoryModal(false)
        setNewTaskCategory({
          name: '',
          description: ''
        })
        alert('Категория задач успешно создана')
      } else {
        const error = await response.json()
        console.error('Failed to create task category:', error.message)
        alert('Ошибка создания категории задач: ' + error.message)
      }
    } catch (error) {
      console.error('Error creating task category:', error)
      alert('Ошибка создания категории задач')
    }
  }

  const handleEditTaskCategory = (taskCategory) => {
    setEditingTaskCategory({
      id: taskCategory.id,
      name: taskCategory.name,
      description: taskCategory.description
    })
    setShowEditTaskCategoryModal(true)
  }

  const handleUpdateTaskCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/task-categories/${editingTaskCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        },
        body: JSON.stringify({
          name: editingTaskCategory.name,
          description: editingTaskCategory.description
        })
      })

      if (response.ok) {
        const result = await response.json()
        const updatedTaskCategories = taskCategories.map(category => 
          category.id === editingTaskCategory.id ? result.data : category
        )
        
        setTaskCategories(updatedTaskCategories)
        setShowEditTaskCategoryModal(false)
        setEditingTaskCategory(null)
        alert('Категория задач успешно обновлена')
      } else {
        const error = await response.json()
        console.error('Failed to update task category:', error.message)
        alert('Ошибка обновления категории задач: ' + error.message)
      }
    } catch (error) {
      console.error('Error updating task category:', error)
      alert('Ошибка обновления категории задач')
    }
  }

  const deleteTaskCategory = async (categoryId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию задач? Это также удалит все задачи в ней.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/task-categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
          }
        })

        if (response.ok) {
          setTaskCategories(taskCategories.filter(category => category.id !== categoryId))
          // Также удаляем связанные задачи из состояния
          setTasks(tasks.filter(task => task.category_id !== categoryId))
          alert('Категория задач удалена')
        } else {
          const error = await response.json()
          console.error('Failed to delete task category:', error.message)
          alert('Ошибка удаления категории задач: ' + error.message)
        }
      } catch (error) {
        console.error('Error deleting task category:', error)
        alert('Ошибка удаления категории задач')
      }
    }
  }

  // Функции для работы с задачами
  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        },
        body: JSON.stringify(newTask)
      })

      if (response.ok) {
        const result = await response.json()
        setTasks([...tasks, result.data])
        setShowCreateTaskModal(false)
        setNewTask({
          title: '',
          content: '',
          solution: '',
          topic: '',
          category_id: taskCategories.length > 0 ? taskCategories[0].id : '',
          difficulty: 'easy'
        })
        alert('Задача успешно создана')
      } else {
        const error = await response.json()
        console.error('Failed to create task:', error.message)
        alert('Ошибка создания задачи: ' + error.message)
      }
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Ошибка создания задачи')
    }
  }

  const handleEditTask = (task) => {
    setEditingTask({
      id: task.id,
      question: task.question,
      answer: task.answer,
      solution: task.solution,
      category_id: task.category_id,
      difficulty: task.difficulty
    })
    setShowEditTaskModal(true)
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
        },
        body: JSON.stringify({
          question: editingTask.question,
          answer: editingTask.answer,
          solution: editingTask.solution,
          category_id: editingTask.category_id,
          difficulty: editingTask.difficulty
        })
      })

      if (response.ok) {
        const result = await response.json()
        const updatedTasks = tasks.map(task => 
          task.id === editingTask.id ? result.data : task
        )
        
        setTasks(updatedTasks)
        setShowEditTaskModal(false)
        setEditingTask(null)
        alert('Задача успешно обновлена')
      } else {
        const error = await response.json()
        console.error('Failed to update task:', error.message)
        alert('Ошибка обновления задачи: ' + error.message)
      }
    } catch (error) {
      console.error('Error updating task:', error)
      alert('Ошибка обновления задачи')
    }
  }

  const deleteTask = async (taskId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Admin-Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`
          }
        })

        if (response.ok) {
          setTasks(tasks.filter(task => task.id !== taskId))
          alert('Задача удалена')
        } else {
          const error = await response.json()
          console.error('Failed to delete task:', error.message)
          alert('Ошибка удаления задачи')
        }
      } catch (error) {
        console.error('Error deleting task:', error)
        alert('Ошибка удаления задачи')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="w-12 h-12 border-b-2 border-red-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">Админ панель</h1>
              <p className="text-zinc-600">Управление платформой kiro.team.edu</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-600 rounded-lg cursor-pointer hover:bg-red-700"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-5">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-zinc-900">Пользователи</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-zinc-900">Статьи</h3>
            <p className="text-3xl font-bold text-green-600">{knowledgeBase.length}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-zinc-900">Категории</h3>
            <p className="text-3xl font-bold text-purple-600">{categories.length}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-zinc-900">События</h3>
            <p className="text-3xl font-bold text-orange-600">{events.length}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-zinc-900">Задачи</h3>
            <p className="text-3xl font-bold text-red-600">{tasks.length}</p>
          </div>
        </div>

        {/* Табы */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-zinc-200">
            <nav className="flex px-6 space-x-8">
              {[
                { id: 'users', name: 'Пользователи' },
                { id: 'knowledge', name: 'База знаний' },
                { id: 'events', name: 'События' },
                { id: 'tasks', name: 'Задачи' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Пользователи */}
            {activeTab === 'users' && (
              <div>
                {error && (
                  <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
                    {error}
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Управление пользователями</h3>
                  <button
                    onClick={() => setShowCreateUserModal(true)}
                    className="px-4 py-2 text-white bg-green-600 rounded-lg cursor-pointer hover:bg-green-700"
                  >
                    Создать пользователя
                  </button>
                </div>
                
                {users.length === 0 && !error ? (
                  <div className="p-8 text-center text-zinc-500">
                    <p className="text-lg">Нет данных</p>
                    <p className="text-sm">Пользователи не найдены в базе данных</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-200">
                      <thead className="bg-zinc-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium text-left uppercase text-zinc-500">ID</th>
                          <th className="px-6 py-3 text-xs font-medium text-left uppercase text-zinc-500">Имя</th>
                          <th className="px-6 py-3 text-xs font-medium text-left uppercase text-zinc-500">Email</th>
                          <th className="px-6 py-3 text-xs font-medium text-left uppercase text-zinc-500">Ранг</th>
                          <th className="px-6 py-3 text-xs font-medium text-left uppercase text-zinc-500">Дата регистрации</th>
                          <th className="px-6 py-3 text-xs font-medium text-left uppercase text-zinc-500">Действия</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-zinc-200">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-zinc-900">{user.id}</td>
                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-zinc-900">{user.name} {user.surname}</td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-zinc-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.rank === 'Новичок' ? 'text-zinc-800 bg-zinc-100' :
                                user.rank === 'Ученик' ? 'text-blue-800 bg-blue-100' :
                                user.rank === 'Исследователь' ? 'text-purple-800 bg-purple-100' :
                                user.rank === 'Мастер' ? 'text-yellow-800 bg-yellow-100' :
                                user.rank === 'Легенда' ? 'text-white bg-gradient-to-r from-yellow-400 to-red-500' :
                                'text-zinc-800 bg-zinc-100'
                              }`}>
                                {user.rank}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-zinc-500">{user.joinDate || user.join_date}</td>
                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="text-red-600 cursor-pointer hover:text-red-900"
                              >
                                Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* База знаний */}
            {activeTab === 'knowledge' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Управление базой знаний</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCreateCategoryModal(true)}
                      className="px-4 py-2 text-white bg-green-600 rounded-lg cursor-pointer hover:bg-green-700"
                    >
                      Создать категорию
                    </button>
                    <button
                      onClick={() => setShowCreateArticleModal(true)}
                      className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                    >
                      Создать статью
                    </button>
                  </div>
                </div>

                {/* Под-вкладки категорий */}
                {categories.length > 0 ? (
                  <div className="mb-6 border-b border-zinc-200">
                    <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
                      {categories.map((category) => (
                        <div key={category.id} className="relative flex items-center flex-shrink-0 group">
                          <button
                            onClick={() => setActiveKnowledgeTab(category.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
                              activeKnowledgeTab === category.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
                            }`}
                          >
                            {category.icon} {category.title}
                          </button>
                          {/* Кнопки управления категорией */}
                          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditCategory(category)
                              }}
                              className="p-1 text-xs text-blue-600 bg-white border border-blue-200 rounded cursor-pointer hover:bg-blue-50"
                              title="Редактировать категорию"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteCategory(category.id)
                              }}
                              className="p-1 text-xs text-red-600 bg-white border border-red-200 rounded cursor-pointer hover:bg-red-50"
                              title="Удалить категорию"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </nav>
                  </div>
                ) : (
                  <div className="p-8 mb-6 text-center border border-dashed rounded-lg border-zinc-300">
                    <p className="text-zinc-500">Нет категорий. Создайте первую категорию.</p>
                  </div>
                )}

                {/* Статьи в выбранной категории */}
                {activeKnowledgeTab && (
                  <div className="space-y-4">
                    {knowledgeBase
                      .filter(article => String(article.category) === String(activeKnowledgeTab))
                      .map((article) => (
                        <div key={article.id} className="p-4 border rounded-lg border-zinc-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-lg font-semibold">{article.title}</h4>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  article.type === 'lesson' ? 'text-green-800 bg-green-100' :
                                  article.type === 'course' ? 'text-blue-800 bg-blue-100' :
                                  article.type === 'guide' ? 'text-purple-800 bg-purple-100' :
                                  article.type === 'article' ? 'text-orange-800 bg-orange-100' :
                                  'text-zinc-800 bg-zinc-100'
                                }`}>
                                  {article.type}
                                </span>
                              </div>
                              <p className="mb-2 text-sm text-zinc-600">
                                {article.content.replace(/[#*`>\-]/g, '').substring(0, 120)}...
                              </p>
                              <p className="text-xs text-zinc-400">Дата: {article.date}</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleEditArticle(article)}
                                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 hover:text-blue-700"
                              >
                                Редактировать
                              </button>
                              <button
                                onClick={() => deleteArticle(article.id)}
                                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 hover:text-red-700"
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {knowledgeBase.filter(article => String(article.category) === String(activeKnowledgeTab)).length === 0 && (
                      <div className="p-8 text-center text-zinc-500">
                        <p className="text-lg">Нет статей в этой категории</p>
                        <p className="text-sm">Создайте первую статью для категории "{categories.find(cat => String(cat.id) === String(activeKnowledgeTab))?.title}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Посты */}
            {activeTab === 'posts' && (
              <div>
                <h3 className="mb-4 text-lg font-semibold">Управление постами</h3>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg border-zinc-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{post.title}</h4>
                          <p className="text-sm text-zinc-500">Автор: {post.author}</p>
                          <p className="text-sm text-zinc-500">❤️ {post.likes} 💬 {post.comments}</p>
                        </div>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-red-600 cursor-pointer hover:text-red-900"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* События */}
            {activeTab === 'events' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Управление событиями</h3>
                  <button
                    onClick={() => setShowCreateEventModal(true)}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                  >
                    Создать событие
                  </button>
                </div>

                {events.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500">
                    <p className="text-lg">Нет событий</p>
                    <p className="text-sm">Создайте первое событие</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="p-4 border rounded-lg border-zinc-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-semibold">{event.title}</h4>
                              {event.category && (
                                <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                                  {event.category}
                                </span>
                              )}
                            </div>
                            <p className="mb-2 text-sm text-zinc-600">{event.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-xs text-zinc-500 md:grid-cols-4">
                              <div>
                                <strong>Дата:</strong> {event.date}
                              </div>
                              <div>
                                <strong>Время:</strong> {event.time}
                              </div>
                              <div>
                                <strong>Место:</strong> {event.location || 'Не указано'}
                              </div>
                              <div>
                                <strong>Организатор:</strong> {event.organizer || 'Не указано'}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button 
                              onClick={() => handleViewRegistrations(event)}
                              className="text-green-600 cursor-pointer hover:text-green-900"
                            >
                              Участники
                            </button>
                            <button 
                              onClick={() => handleEditEvent(event)}
                              className="text-blue-600 cursor-pointer hover:text-blue-900"
                            >
                              Редактировать
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="text-red-600 cursor-pointer hover:text-red-900"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Задачи */}
            {activeTab === 'tasks' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Управление задачами</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCreateTaskCategoryModal(true)}
                      className="px-4 py-2 text-white bg-green-600 rounded-lg cursor-pointer hover:bg-green-700"
                    >
                      Создать категорию
                    </button>
                    <button
                      onClick={() => setShowCreateTaskModal(true)}
                      className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                    >
                      Создать задачу
                    </button>
                  </div>
                </div>

                {/* Категории задач */}
                <div className="mb-6">
                  <h4 className="mb-3 font-medium text-md">Категории задач</h4>
                  {taskCategories.length === 0 ? (
                    <div className="p-4 mb-4 text-center border border-dashed rounded-lg border-zinc-300">
                      <p className="text-zinc-500">Нет категорий задач. Создайте первую категорию.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 mb-6 md:grid-cols-3">
                      {taskCategories.map((category) => (
                        <div key={category.id} className="p-3 border rounded-lg border-zinc-200 bg-zinc-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-zinc-900">{category.name}</h5>
                              <p className="text-sm text-zinc-600">{category.description}</p>
                              <p className="text-xs text-zinc-400">
                                Задач: {tasks.filter(task => task.category_id === category.id).length}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEditTaskCategory(category)}
                                className="p-1 text-xs text-blue-600 bg-white border border-blue-200 rounded cursor-pointer hover:bg-blue-50"
                                title="Редактировать категорию"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => deleteTaskCategory(category.id)}
                                className="p-1 text-xs text-red-600 bg-white border border-red-200 rounded cursor-pointer hover:bg-red-50"
                                title="Удалить категорию"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Задачи */}
                <div>
                  <h4 className="mb-3 font-medium text-md">Все задачи</h4>
                  {tasks.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500">
                      <p className="text-lg">Нет задач</p>
                      <p className="text-sm">Создайте первую задачу</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tasks.map((task) => {
                        const category = taskCategories.find(cat => cat.id === task.category_id)
                        return (
                          <div key={task.id} className="p-4 border rounded-lg border-zinc-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <h5 className="font-semibold text-zinc-900">{task.title}</h5>
                                  <span className={`px-2 py-1 mr-2 text-xs rounded-full ${
                                    task.difficulty === 'легкая' ? 'text-green-800 bg-green-100' :
                                    task.difficulty === 'средняя' ? 'text-yellow-800 bg-yellow-100' :
                                    task.difficulty === 'сложная' ? 'text-red-800 bg-red-100' :
                                    'text-zinc-800 bg-zinc-100'
                                  }`}>
                                    {task.difficulty === 'easy' ? 'Легкая' : 
                                     task.difficulty === 'medium' ? 'Средняя' : 
                                     task.difficulty === 'hard' ? 'Сложная' : task.difficulty}
                                  </span>
                                  {category && (
                                    <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                                      {category.name}
                                    </span>
                                  )}
                                </div>
                                <p className="mb-2 text-sm text-zinc-600">
                                  <strong>Вопрос:</strong> {task.question}
                                </p>
                                <p className="mb-2 text-sm text-zinc-600">
                                  {task.question && task.question.length > 150 ? 
                                    `${task.question.substring(0, 150)}...` : 
                                    task.question
                                  }
                                </p>
                                <p className="text-xs text-zinc-400">
                                  Создана: {new Date(task.created_at).toLocaleDateString('ru-RU')}
                                </p>
                              </div>
                              <div className="flex flex-col gap-2 sm:flex-row">
                                <button 
                                  onClick={() => handleEditTask(task)}
                                  className="text-blue-600 cursor-pointer hover:text-blue-900"
                                >
                                  Редактировать
                                </button>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="text-red-600 cursor-pointer hover:text-red-900"
                                >
                                  Удалить
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal для создания пользователя */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Создать нового пользователя</h2>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Имя</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Фамилия</label>
                <input
                  type="text"
                  value={newUser.surname}
                  onChange={(e) => setNewUser({...newUser, surname: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Пароль</label>
                <input
                  type="text"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Телефон</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Биография</label>
                <textarea
                  value={newUser.bio}
                  onChange={(e) => setNewUser({...newUser, bio: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                />
              </div>
              <div className="mb-6">
                <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                  <p className="text-sm text-yellow-800">
                    <strong>Ранг будет рассчитан автоматически:</strong><br/>
                    Новичок - до месяца<br/>
                    Ученик - 1-3 месяца<br/>
                    Исследователь - 3-6 месяцев<br/>
                    Мастер - 6-12 месяцев<br/>
                    Легенда - больше 1 года
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-green-600 rounded-lg cursor-pointer hover:bg-green-700"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal для создания статьи */}
      {showCreateArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-semibold">Создать новую статью</h2>
            <form onSubmit={handleCreateArticle}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Заголовок</label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Тип статьи</label>
                <select
                  value={newArticle.type}
                  onChange={(e) => setNewArticle({...newArticle, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="lesson">Урок</option>
                  <option value="course">Курс</option>
                  <option value="guide">Руководство</option>
                  <option value="article">Статья</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Категория</label>
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.title}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Содержание</label>
                <textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                  className="w-full px-3 py-2 font-mono text-sm border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="15"
                  placeholder="Содержание"
                  required
                />
                <p className="mt-2 text-xs text-zinc-500">
                  💡 Поддерживается HTML
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateArticleModal(false)}
                  className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Создать статью
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal для редактирования статьи */}
      {showEditArticleModal && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl p-6 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-semibold">Редактировать статью</h2>
            <form onSubmit={handleUpdateArticle}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Левая колонка - форма редактирования */}
                <div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-zinc-700">Заголовок</label>
                    <input
                      type="text"
                      value={editingArticle.title}
                      onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-zinc-700">Тип статьи</label>
                    <select
                      value={editingArticle.type}
                      onChange={(e) => setEditingArticle({...editingArticle, type: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="lesson">Урок</option>
                      <option value="course">Курс</option>
                      <option value="guide">Руководство</option>
                      <option value="article">Статья</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-zinc-700">Категория</label>
                    <select
                      value={editingArticle.category}
                      onChange={(e) => setEditingArticle({...editingArticle, category: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-zinc-700">Содержание</label>
                    <textarea
                      value={editingArticle.content}
                      onChange={(e) => setEditingArticle({...editingArticle, content: e.target.value})}
                      className="w-full px-3 py-2 font-mono text-sm border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="20"
                      placeholder="Содержание"
                      required
                    />
                    <p className="mt-2 text-xs text-zinc-500">
                      💡 Поддерживается HTML
                    </p>
                  </div>
                </div>
                
                {/* Правая колонка - предварительный просмотр */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-zinc-700">Предварительный просмотр</h3>
                  <div className="p-4 border rounded-lg border-zinc-300 bg-zinc-50 max-h-[500px] overflow-y-auto">
                    <div className="prose-sm prose max-w-none">
                      <div 
                        className="break-words whitespace-pre-wrap"
                        style={{
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          lineHeight: '1.6'
                        }}
                        dangerouslySetInnerHTML={{
                          __html: editingArticle.content
                            .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-3 mt-4">$1</h1>')
                            .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mb-2 mt-3">$1</h2>')
                            .replace(/^### (.*$)/gm, '<h3 class="text-base font-medium mb-2 mt-2">$1</h3>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                            .replace(/`(.*?)`/g, '<code class="bg-zinc-200 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
                            .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
                            .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-zinc-300 pl-4 italic text-zinc-600 my-2">$1</blockquote>')
                            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-zinc-800 text-zinc-100 p-3 rounded mt-2 mb-2 overflow-x-auto"><code>$2</code></pre>')
                            .replace(/\n\n/g, '</p><p class="mb-2">')
                            .replace(/^(?!<[h|l|b|p|c])/gm, '<p class="mb-2">')
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 mt-6 space-x-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditArticleModal(false)
                    setEditingArticle(null)
                  }}
                  className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal для создания категории */}
      {showCreateCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Создать новую категорию</h2>
            <form onSubmit={handleCreateCategory}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Название категории</label>
                <input
                  type="text"
                  value={newCategory.title}
                  onChange={(e) => setNewCategory({...newCategory, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: Программирование"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Описание</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Описание категории..."
                  rows="3"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Иконка (эмодзи)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                    className="w-20 px-3 py-2 text-center border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="📚"
                    maxLength="4"
                    required
                  />
                  <span className="text-sm text-zinc-500">Выберите эмодзи для категории</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {['📚', '💻', '🎨', '🔧', '📊', '🚀', '🧠', '⚡'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewCategory({...newCategory, icon: emoji})}
                      className="p-2 border rounded cursor-pointer border-zinc-300 hover:bg-zinc-50"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateCategoryModal(false)}
                  className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-green-600 rounded-lg cursor-pointer hover:bg-green-700"
                >
                  Создать категорию
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal для редактирования категории */}
      {showEditCategoryModal && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Редактировать категорию</h2>
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Название категории</label>
                <input
                  type="text"
                  value={editingCategory.title}
                  onChange={(e) => setEditingCategory({...editingCategory, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: Программирование"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Описание</label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Описание категории..."
                  rows="3"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Иконка (эмодзи)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingCategory.icon}
                    onChange={(e) => setEditingCategory({...editingCategory, icon: e.target.value})}
                    className="w-20 px-3 py-2 text-center border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="📚"
                    maxLength="4"
                    required
                  />
                  <span className="text-sm text-zinc-500">Выберите эмодзи для категории</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {['📚', '💻', '🎨', '🔧', '📊', '🚀', '🧠', '⚡'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditingCategory({...editingCategory, icon: emoji})}
                      className="p-2 border rounded cursor-pointer border-zinc-300 hover:bg-zinc-50"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditCategoryModal(false)
                    setEditingCategory(null)
                  }}
                  className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal для создания события */}
      {showCreateEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-semibold">Создать новое событие</h2>
            <form onSubmit={handleCreateEvent}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Название события *</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Например: React Meetup Moscow"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Категория</label>
                  <input
                    type="text"
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Frontend, Backend, UI/UX, QA"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Дата *</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Время *</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Место проведения</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Адрес или ссылка на онлайн-событие"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Ссылка на фото</label>
                <input
                  type="url"
                  value={newEvent.image}
                  onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Организатор</label>
                <input
                  type="text"
                  value={newEvent.organizer}
                  onChange={(e) => setNewEvent({...newEvent, organizer: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Название организации или имя организатора"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Краткое описание</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Краткое описание события для списка"
                  rows="3"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Полное описание</label>
                <textarea
                  value={newEvent.full_description}
                  onChange={(e) => setNewEvent({...newEvent, full_description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Подробное описание события для страницы детального просмотра"
                  rows="5"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateEventModal(false)}
                  className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Создать событие
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal для редактирования события */}
      {showEditEventModal && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-semibold">Редактировать событие</h2>
            <form onSubmit={handleUpdateEvent}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Название события *</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Например: React Meetup Moscow"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Категория</label>
                  <input
                    type="text"
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({...editingEvent, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Frontend, Backend, UI/UX, QA"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Дата *</label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Время *</label>
                  <input
                    type="time"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Место проведения</label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Адрес или ссылка на онлайн-событие"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Ссылка на фото</label>
                <input
                  type="url"
                  value={editingEvent.image}
                  onChange={(e) => setEditingEvent({...editingEvent, image: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Организатор</label>
                <input
                  type="text"
                  value={editingEvent.organizer}
                  onChange={(e) => setEditingEvent({...editingEvent, organizer: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Название организации или имя организатора"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Краткое описание</label>
                <textarea
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Краткое описание события для списка"
                  rows="3"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Полное описание</label>
                <textarea
                  value={editingEvent.full_description}
                  onChange={(e) => setEditingEvent({...editingEvent, full_description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Подробное описание события для страницы детального просмотра"
                  rows="5"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditEventModal(false)
                    setEditingEvent(null)
                  }}
                  className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal для просмотра зарегистрированных пользователей */}
      {showEventRegistrations && selectedEventForRegistrations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl p-6 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Участники события: {selectedEventForRegistrations.title}
              </h2>
              <button
                onClick={() => {
                  setShowEventRegistrations(false)
                  setSelectedEventForRegistrations(null)
                  setEventRegistrations([])
                }}
                className="text-zinc-500 hover:text-zinc-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-zinc-600">
                Всего зарегистрировано: <strong>{eventRegistrations.length}</strong> человек
              </p>
            </div>
            
            {eventRegistrations.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                <p className="text-lg">Нет зарегистрированных участников</p>
                <p className="text-sm">Пользователи еще не записались на это событие</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-left uppercase text-zinc-500">Пользователь</th>
                      <th className="px-6 py-3 text-xs font-medium text-left uppercase text-zinc-500">Email</th>
                      <th className="px-6 py-3 text-xs font-medium text-left uppercase text-zinc-500">Ранг</th>
                      <th className="px-6 py-3 text-xs font-medium text-left uppercase text-zinc-500">Дата регистрации</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-zinc-200">
                    {eventRegistrations.map((registration) => (
                      <tr key={registration.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {registration.avatar && (
                              <img
                                className="w-8 h-8 mr-3 rounded-full"
                                src={registration.avatar}
                                alt={`${registration.name} ${registration.surname}`}
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-zinc-900">
                                {registration.name} {registration.surname}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-zinc-500">
                          {registration.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            registration.rank === 'Новичок' ? 'text-zinc-800 bg-zinc-100' :
                            registration.rank === 'Ученик' ? 'text-blue-800 bg-blue-100' :
                            registration.rank === 'Исследователь' ? 'text-purple-800 bg-purple-100' :
                            registration.rank === 'Мастер' ? 'text-yellow-800 bg-yellow-100' :
                            registration.rank === 'Легенда' ? 'text-white bg-gradient-to-r from-yellow-400 to-red-500' :
                            'text-zinc-800 bg-zinc-100'
                          }`}>
                            {registration.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-zinc-500">
                          {new Date(registration.registration_date).toLocaleDateString('ru-RU')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="flex justify-end pt-4 mt-6 border-t border-zinc-200">
              <button
                onClick={() => {
                  setShowEventRegistrations(false)
                  setSelectedEventForRegistrations(null)
                  setEventRegistrations([])
                }}
                className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal для создания категории задач */}
      {showCreateTaskCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Создать категорию задач</h2>
            <form onSubmit={handleCreateTaskCategory}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Название категории *</label>
                <input
                  type="text"
                  value={newTaskCategory.name}
                  onChange={(e) => setNewTaskCategory({...newTaskCategory, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: Программирование"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Описание *</label>
                <textarea
                  value={newTaskCategory.description}
                  onChange={(e) => setNewTaskCategory({...newTaskCategory, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Описание категории задач..."
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateTaskCategoryModal(false)}
                  className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-green-600 rounded-lg cursor-pointer hover:bg-green-700"
                >
                  Создать категорию
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal для редактирования категории задач */}
      {showEditTaskCategoryModal && editingTaskCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Редактировать категорию задач</h2>
            <form onSubmit={handleUpdateTaskCategory}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Название категории *</label>
                <input
                  type="text"
                  value={editingTaskCategory.name}
                  onChange={(e) => setEditingTaskCategory({...editingTaskCategory, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: Программирование"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Описание *</label>
                <textarea
                  value={editingTaskCategory.description}
                  onChange={(e) => setEditingTaskCategory({...editingTaskCategory, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Описание категории задач..."
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditTaskCategoryModal(false)
                    setEditingTaskCategory(null)
                  }}
                  className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal для создания задачи */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl p-6 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-semibold">Создать новую задачу</h2>
            <form onSubmit={handleCreateTask}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Содержание задачи *</label>
                  <textarea
                    value={newTask.question}
                    onChange={(e) => setNewTask({...newTask, question: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Опишите условие задачи..."
                    rows={4}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Ответ *</label>
                  <textarea
                    value={newTask.answer}
                    onChange={(e) => setNewTask({...newTask, answer: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Краткий ответ на задачу..."
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Категория *</label>
                  <select
                    value={newTask.category_id}
                    onChange={(e) => setNewTask({...newTask, category_id: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {taskCategories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Сложность *</label>
                  <select
                    value={newTask.difficulty}
                    onChange={(e) => setNewTask({...newTask, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="легкая">Легкая</option>
                    <option value="средняя">Средняя</option>
                    <option value="сложная">Сложная</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Решение задачи *</label>
                <textarea
                  value={newTask.solution}
                  onChange={(e) => setNewTask({...newTask, solution: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Подробное решение задачи, объяснение, код..."
                  rows="8"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateTaskModal(false)}
                  className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Создать задачу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal для редактирования задачи */}
      {showEditTaskModal && editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl p-6 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-semibold">Редактировать задачу</h2>
            <form onSubmit={handleUpdateTask}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Содержание задачи *</label>
                  <textarea
                    value={editingTask.question}
                    onChange={(e) => setEditingTask({...editingTask, question: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Опишите условие задачи..."
                    rows={4}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Ответ *</label>
                  <textarea
                    value={editingTask.answer}
                    onChange={(e) => setEditingTask({...editingTask, answer: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Краткий ответ на задачу..."
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Категория *</label>
                  <select
                    value={editingTask.category_id}
                    onChange={(e) => setEditingTask({...editingTask, category_id: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {taskCategories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-zinc-700">Сложность *</label>
                  <select
                    value={editingTask.difficulty}
                    onChange={(e) => setEditingTask({...editingTask, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="легкая">Легкая</option>
                    <option value="средняя">Средняя</option>
                    <option value="сложная">Сложная</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Решение задачи *</label>
                <textarea
                  value={editingTask.solution}
                  onChange={(e) => setEditingTask({...editingTask, solution: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Подробное решение задачи, объяснение, код..."
                  rows="8"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditTaskModal(false)
                    setEditingTask(null)
                  }}
                  className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}