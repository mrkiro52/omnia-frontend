import React, { useState, useEffect } from 'react';

const DailyTask = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState(() => {
    const saved = localStorage.getItem('dailyTask_selectedTopics');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDifficulties, setSelectedDifficulties] = useState(() => {
    const saved = localStorage.getItem('dailyTask_selectedDifficulties');
    return saved ? JSON.parse(saved) : ['средняя'];
  });
  const [currentTask, setCurrentTask] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const difficulties = [
    { id: 'легкая', name: 'Легкая' },
    { id: 'средняя', name: 'Средняя' },
    { id: 'сложная', name: 'Сложная' }
  ];

  // Загрузка категорий и задач с бэкенда
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Загружаем категории
        const categoriesResponse = await fetch('https://omnia-backend-fyuo.onrender.com/api/task-categories/public');

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          if (categoriesData.success) {
            setCategories(categoriesData.data);
            // Устанавливаем первые две категории как выбранные по умолчанию только если нет сохраненных
            const savedTopics = localStorage.getItem('dailyTask_selectedTopics');
            if (categoriesData.data.length > 0 && (!savedTopics || JSON.parse(savedTopics).length === 0)) {
              const defaultTopics = categoriesData.data.slice(0, 2).map(cat => cat.id.toString());
              setSelectedTopics(defaultTopics);
            }
          }
        }

        // Загружаем задачи
        const tasksResponse = await fetch('https://omnia-backend-fyuo.onrender.com/api/tasks/public');

        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          if (tasksData.success) {
            setAllTasks(tasksData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Инициализация первой задачи после загрузки данных
  useEffect(() => {
    if (!loading && allTasks.length > 0 && categories.length > 0 && !currentTask) {
      generateNewTask();
    }
  }, [loading, allTasks, categories, selectedTopics, selectedDifficulties]);

  // Сохранение выбранных категорий в localStorage
  useEffect(() => {
    localStorage.setItem('dailyTask_selectedTopics', JSON.stringify(selectedTopics));
  }, [selectedTopics]);

  // Сохранение выбранных сложностей в localStorage
  useEffect(() => {
    localStorage.setItem('dailyTask_selectedDifficulties', JSON.stringify(selectedDifficulties));
  }, [selectedDifficulties]);

  // Генерация новой задачи
  const generateNewTask = () => {
    if (allTasks.length === 0) {
      setCurrentTask({
        question: 'Задач пока нет в базе данных',
        answer: '',
        solution: '',
        isEmpty: true
      });
      return;
    }

    // Фильтруем задачи по выбранным категориям и сложности
    const filteredTasks = allTasks.filter(task => {
      const categoryMatch = selectedTopics.length === 0 || selectedTopics.includes(task.category_id.toString());
      const difficultyMatch = selectedDifficulties.includes(task.difficulty);
      return categoryMatch && difficultyMatch;
    });

    if (filteredTasks.length === 0) {
      setCurrentTask({
        question: 'Нет доступных задач для выбранных настроек',
        answer: '',
        solution: '',
        isEmpty: true
      });
      return;
    }

    // Исключаем текущую задачу, если она есть
    let availableTasks = filteredTasks;
    if (currentTask && !currentTask.isEmpty) {
      availableTasks = filteredTasks.filter(task => task.id !== currentTask.id);
    }

    // Если после исключения не осталось задач, используем все отфильтрованные
    if (availableTasks.length === 0) {
      availableTasks = filteredTasks;
    }

    const randomTask = availableTasks[Math.floor(Math.random() * availableTasks.length)];
    
    // Находим название категории
    const category = categories.find(cat => cat.id === randomTask.category_id);
    
    setCurrentTask({
      ...randomTask,
      category_name: category?.name || 'Неизвестная категория',
      isEmpty: false
    });
    setShowAnswer(false);
  };

  const toggleTopic = (topicId) => {
    const topicIdStr = topicId.toString();
    if (selectedTopics.includes(topicIdStr)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter(id => id !== topicIdStr));
      }
    } else {
      setSelectedTopics([...selectedTopics, topicIdStr]);
    }
  };

  const toggleDifficulty = (difficultyId) => {
    if (selectedDifficulties.includes(difficultyId)) {
      if (selectedDifficulties.length > 1) {
        setSelectedDifficulties(selectedDifficulties.filter(id => id !== difficultyId));
      }
    } else {
      setSelectedDifficulties([...selectedDifficulties, difficultyId]);
    }
  };

  const blurText = (text) => {
    return showAnswer ? text : text.split('').map((char, i) => 
      char === ' ' ? ' ' : '█'
    ).join('');
  };

  return (
    <>
      <div className="bg-white border rounded-lg shadow-sm border-zinc-200">
        {!showFilters ? (
          <>
            {/* Заголовок с кнопками */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200">
              <h3 className="text-lg font-semibold select-none text-zinc-900">Задачка дня</h3>
              <div className="flex space-x-1">
                <button
                  onClick={generateNewTask}
                  className="p-1 transition-colors rounded cursor-pointer text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
                  title="Обновить задачу"
                  disabled={loading}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowFilters(true)}
                  className="p-1 transition-colors rounded cursor-pointer text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
                  title="Фильтры"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Контент */}
            <div className="p-4">
              {loading ? (
                <div className="text-center text-zinc-500">
                  Загрузка задач...
                </div>
              ) : error ? (
                <div className="text-center text-red-500">
                  {error}
                </div>
              ) : currentTask ? (
                <>
                  {!currentTask.isEmpty && (
                    <div className="flex gap-2 mb-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        currentTask.difficulty === 'легкая' 
                          ? 'bg-green-100 text-green-700'
                          : currentTask.difficulty === 'средняя'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {difficulties.find(d => d.id === currentTask.difficulty)?.name}
                      </span>
                      <span className="inline-block px-2 py-1 text-xs text-indigo-700 bg-indigo-100 rounded-full">
                        {currentTask.category_name}
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-4 text-sm leading-relaxed text-zinc-700">
                    {currentTask.question}
                  </div>

                  {!currentTask.isEmpty && (
                    <>
                      {/* Ответ (заблюрен) */}
                      <div className="p-3 mb-4 border rounded-lg bg-zinc-50 border-zinc-200">
                        <div className="mb-1 text-xs text-zinc-500">Ответ:</div>
                        <div className={`font-mono text-sm text-zinc-800 transition-all duration-300 ${
                          !showAnswer ? 'blur-md select-none' : ''
                        }`}>
                          {currentTask.answer}
                        </div>
                      </div>

                      {/* Кнопки */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowAnswer(!showAnswer)}
                          className="w-20 px-4 py-2 text-sm transition-colors rounded-lg cursor-pointer text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
                        >
                          {showAnswer ? 'Скрыть' : 'Ответ'}
                        </button>
                        <button
                          onClick={() => setShowSolution(true)}
                          className="px-4 py-2 text-sm text-white transition-all bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                        >
                          Решение
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center text-zinc-500">
                  Задач не найдено
                </div>
              )}
            </div>
          </>
        ) : (
          /* Фильтры */
          <>
            <div className="flex items-center justify-between p-4 border-b border-zinc-200">
              <h3 className="text-lg font-semibold select-none text-zinc-900">Настройки задач</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 transition-colors rounded cursor-pointer text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {/* Сложность */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-zinc-700">Сложность</label>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map(diff => (
                    <button
                      key={diff.id}
                      onClick={() => toggleDifficulty(diff.id)}
                      className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-colors ${
                        selectedDifficulties.includes(diff.id)
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {diff.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Темы */}
              <div>
                <label className="block mb-2 text-sm font-medium text-zinc-700">Категории</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => toggleTopic(category.id)}
                      className={`px-3 py-2 text-xs text-left rounded-lg cursor-pointer transition-colors ${
                        selectedTopics.includes(category.id.toString())
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Оверлей с решением */}
      {showSolution && currentTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-[80vh] mx-4 bg-white rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h3 className="text-xl font-semibold text-zinc-900">Полное решение</h3>
              <button
                onClick={() => setShowSolution(false)}
                className="p-2 transition-colors rounded-lg cursor-pointer text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="p-4 mb-4 border border-blue-200 rounded-lg bg-blue-50">
                <h4 className="mb-2 text-sm font-medium text-blue-900">Задача:</h4>
                <p className="text-sm text-blue-800">{currentTask.question}</p>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-line text-zinc-700">
                {currentTask.solution}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DailyTask;