import React, { useState, useEffect } from 'react';

const Desktop = () => {
  const [background, setBackground] = useState(() => {
    return localStorage.getItem('desktop_background') || 'gradient-blue';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showBackgroundOptions, setShowBackgroundOptions] = useState(false);
  const [showTasks, setShowTasks] = useState(() => {
    return JSON.parse(localStorage.getItem('desktop_showTasks') || 'true');
  });
  const [showCalculator, setShowCalculator] = useState(() => {
    return JSON.parse(localStorage.getItem('desktop_showCalculator') || 'true');
  });
  const [showNotes, setShowNotes] = useState(() => {
    return JSON.parse(localStorage.getItem('desktop_showNotes') || 'true');
  });
  const [showTimer, setShowTimer] = useState(() => {
    return JSON.parse(localStorage.getItem('desktop_showTimer') || 'true');
  });
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem('desktop_tasks') || '[]');
  });
  const [newTask, setNewTask] = useState('');
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('desktop_notes') || '';
  });
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [initialTimerMinutes, setInitialTimerMinutes] = useState(5);
  const [initialTimerSeconds, setInitialTimerSeconds] = useState(0);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [startTime] = useState(() => {
    const saved = localStorage.getItem('desktop_startTime');
    return saved ? new Date(saved) : new Date();
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workTime, setWorkTime] = useState('00:00:00');

  const backgrounds = [
    {
      id: 'gradient-blue',
      name: 'Синий градиент',
      class: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'
    },
    {
      id: 'gradient-purple',
      name: 'Фиолетовый градиент',
      class: 'bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600'
    },
    {
      id: 'gradient-green',
      name: 'Зеленый градиент',
      class: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600'
    },
    {
      id: 'gradient-warm',
      name: 'Теплый градиент',
      class: 'bg-gradient-to-br from-orange-400 via-pink-500 to-red-500'
    },
    {
      id: 'gradient-dark',
      name: 'Темный градиент',
      class: 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
    },
    {
      id: 'gradient-light',
      name: 'Светлый градиент',
      class: 'bg-gradient-to-br from-gray-100 via-gray-100 to-gray-200'
    }
  ];

  // Обновление времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Вычисляем время работы
      const diff = now - startTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setWorkTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Логика таймера
  useEffect(() => {
    let interval = null;
    if (timerActive && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          setTimerActive(false);
        }
      }, 1000);
    } else if (!timerActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerMinutes, timerSeconds]);

  // Закрытие выпадающих меню при клике вне области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.settings-panel') && !event.target.closest('.settings-button')) {
        setShowBackgroundOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Функции для управления задачами
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Функции калькулятора
  const handleCalc = (value) => {
    if (value === 'AC') {
      setCalcDisplay('0');
    } else if (value === 'C') {
      setCalcDisplay(calcDisplay.length > 1 ? calcDisplay.slice(0, -1) : '0');
    } else if (value === '%') {
      try {
        const result = parseFloat(calcDisplay) / 100;
        setCalcDisplay(result.toString());
      } catch {
        setCalcDisplay('Error');
      }
    } else if (value === '±') {
      try {
        const result = parseFloat(calcDisplay) * -1;
        setCalcDisplay(result.toString());
      } catch {
        setCalcDisplay('Error');
      }
    } else if (value === '=') {
      try {
        // Заменяем символы для eval
        const expression = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/');
        setCalcDisplay(eval(expression).toString());
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      setCalcDisplay(calcDisplay === '0' ? value : calcDisplay + value);
    }
  };

  // Сохранение настроек в localStorage
  useEffect(() => {
    localStorage.setItem('desktop_background', background);
  }, [background]);

  useEffect(() => {
    localStorage.setItem('desktop_showTasks', JSON.stringify(showTasks));
  }, [showTasks]);

  useEffect(() => {
    localStorage.setItem('desktop_showCalculator', JSON.stringify(showCalculator));
  }, [showCalculator]);

  useEffect(() => {
    localStorage.setItem('desktop_showNotes', JSON.stringify(showNotes));
  }, [showNotes]);

  useEffect(() => {
    localStorage.setItem('desktop_showTimer', JSON.stringify(showTimer));
  }, [showTimer]);

  useEffect(() => {
    localStorage.setItem('desktop_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('desktop_notes', notes);
  }, [notes]);

  useEffect(() => {
    if (!localStorage.getItem('desktop_startTime')) {
      localStorage.setItem('desktop_startTime', startTime.toISOString());
    }
  }, [startTime]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`fixed inset-0 z-50 ${backgrounds.find(bg => bg.id === background)?.class} overflow-hidden`}>
      {/* Первый ряд - Время, дата и время работы */}
      <div className={`absolute top-8 left-8 ${background === 'gradient-light' ? 'text-gray-800' : 'text-white'}`}>
        <div className="mb-2 text-4xl font-bold md:text-6xl drop-shadow-lg">
          {formatTime(currentTime)}
        </div>
        <div className="text-lg md:text-xl opacity-90 drop-shadow-md">
          {formatDate(currentTime)}
        </div>
        <div className="mt-2 text-sm opacity-75 md:text-base drop-shadow-md">
          Время работы: {workTime}
        </div>
      </div>

      {/* Кнопка выхода */}
      <button
        onClick={() => window.history.back()}
        className={`fixed z-50 p-3 transition-all rounded-full top-8 right-8 backdrop-blur-sm cursor-pointer ${
          background === 'gradient-light' 
            ? 'text-gray-800 bg-black/20 hover:bg-black/30' 
            : 'text-white bg-white/20 hover:bg-white/30'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Панель настроек - горизонтально снизу по центру */}
      <div className={`fixed z-40 px-6 py-4 bottom-6 left-1/2 transform -translate-x-1/2 rounded-3xl backdrop-blur-sm ${
        background === 'gradient-light' 
          ? 'bg-black/20' 
          : 'bg-white/20'
      }`}>
        <div className="flex items-center space-x-4">
          {/* Варианты фона */}
          {backgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => {
                setBackground(bg.id);
              }}
              className={`w-10 h-10 rounded-full transition-all cursor-pointer ${
                background === bg.id
                  ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent scale-110'
                  : 'hover:scale-105'
              } ${bg.class}`}
              title={bg.name}
            >
            </button>
          ))}

          {/* Разделитель */}
          <div className={`w-px h-8 rounded-full ${
            background === 'gradient-light' ? 'bg-gray-800/30' : 'bg-white/30'
          }`}></div>

          {/* Панель задач */}
          <button
            onClick={() => setShowTasks(!showTasks)}
            className={`w-12 h-12 rounded-full transition-all cursor-pointer backdrop-blur-sm ${
              showTasks
                ? 'bg-blue-500 text-white scale-110'
                : (
                  background === 'gradient-light' 
                    ? 'bg-black/20 hover:bg-black/30 text-gray-800 hover:scale-105' 
                    : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105'
                )
            } flex items-center justify-center`}
            title="Панель задач"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </button>

          {/* Калькулятор */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className={`w-12 h-12 rounded-full transition-all cursor-pointer backdrop-blur-sm ${
              showCalculator
                ? 'bg-green-500 text-white scale-110'
                : (
                  background === 'gradient-light' 
                    ? 'bg-black/20 hover:bg-black/30 text-gray-800 hover:scale-105' 
                    : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105'
                )
            } flex items-center justify-center`}
            title="Калькулятор"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M9 10h.01M12 10h.01M15 10h.01M12 14h.01M15 14h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Заметки */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`w-12 h-12 rounded-full transition-all cursor-pointer backdrop-blur-sm ${
              showNotes
                ? 'bg-yellow-500 text-white scale-110'
                : (
                  background === 'gradient-light' 
                    ? 'bg-black/20 hover:bg-black/30 text-gray-800 hover:scale-105' 
                    : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105'
                )
            } flex items-center justify-center`}
            title="Заметки"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Таймер */}
          <button
            onClick={() => setShowTimer(!showTimer)}
            className={`w-12 h-12 rounded-full transition-all cursor-pointer backdrop-blur-sm ${
              showTimer
                ? 'bg-red-500 text-white scale-110'
                : (
                  background === 'gradient-light' 
                    ? 'bg-black/20 hover:bg-black/30 text-gray-800 hover:scale-105' 
                    : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105'
                )
            } flex items-center justify-center`}
            title="Таймер"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Логотип в правом нижнем углу */}
      <div className={`fixed bottom-6 right-6 z-40 w-12 h-12 p-2 rounded-full backdrop-blur-sm ${
        background === 'gradient-light' 
          ? 'bg-gray-800/20 border border-gray-800/30' 
          : 'bg-white/20 border border-white/30'
      }`}>
        <img 
          src="/logosm.svg" 
          alt="Logo" 
          className="object-contain w-full h-full"
        />
      </div>

      {/* Второй ряд - Контейнер виджетов */}
      <div className="fixed z-40 top-48 left-8">
        <div className="flex max-w-screen-xl space-x-4 overflow-x-auto">
          {/* Панель задач */}
          {showTasks && (
            <div className="flex flex-col flex-shrink-0 p-4 w-80 h-96 bg-white/90 backdrop-blur-sm rounded-2xl">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">Задачи на сегодня</h3>
              <div className="flex mb-3">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Добавить задачу..."
                  className="flex-1 px-3 py-1.5 text-sm border-0 rounded-xl bg-gray-100/50 backdrop-blur-sm focus:outline-none focus:bg-gray-100/70"
                />
                <button
                  onClick={addTask}
                  className="flex items-center justify-center w-8 h-8 ml-2 text-white bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700"
                >
                  +
                </button>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto">
                {tasks.map(task => (
                  <div key={task.id} className={`flex items-center justify-between p-1.5 rounded-2xl transition-all cursor-pointer ${
                    task.completed 
                      ? 'bg-gray-200' 
                      : 'bg-white'
                  }`}>
                    <div 
                      className={`flex-1 transition-all p-1 ${
                        task.completed 
                          ? 'text-gray-500 line-through' 
                          : 'text-gray-800'
                      }`}
                      onClick={() => toggleTask(task.id)}
                    >
                      <span className="text-sm">
                        {task.text}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex items-center justify-center w-6 h-6 ml-2 transition-all rounded-full cursor-pointer bg-white/50 backdrop-blur-sm hover:bg-white/70"
                    >
                      <svg className="w-3 h-3 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Калькулятор */}
          {showCalculator && (
            <div className="flex flex-col flex-shrink-0 w-64 p-4 h-96 bg-white/90 backdrop-blur-sm rounded-2xl">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">Калькулятор</h3>
              <div className="p-3 mb-3 bg-gray-100 rounded-lg">
                <div className="font-mono text-xl text-right">{calcDisplay}</div>
              </div>
              <div className="grid flex-1 grid-cols-4 gap-2">
                {[
                  ['C', 'AC', '%', '÷'],
                  ['7', '8', '9', '×'],
                  ['4', '5', '6', '-'],
                  ['1', '2', '3', '+'],
                  ['±', '0', '.', '=']
                ].flat().map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => handleCalc(btn)}
                    className={`p-2 rounded-lg font-semibold cursor-pointer text-sm transition-all ${
                      btn === '=' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                      'bg-white/50 backdrop-blur-sm text-gray-800 hover:bg-white/70'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Заметки */}
          {showNotes && (
            <div className="flex flex-col flex-shrink-0 p-4 w-80 h-96 bg-white/90 backdrop-blur-sm rounded-2xl">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">Заметки</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ваши заметки..."
                className="flex-1 w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none"
              />
            </div>
          )}

          {/* Настраиваемый таймер */}
          {showTimer && (
            <div className="flex flex-col flex-shrink-0 w-64 p-4 h-96 bg-white/90 backdrop-blur-sm rounded-2xl">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">Таймер</h3>
              <div className="flex flex-col justify-center flex-1">
                <div className="flex justify-center mb-6">
                  {/* Круговой прогресс-бар */}
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Фоновый круг */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                      />
                      {/* Прогресс круг */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={timerActive ? `${2 * Math.PI * 45 * (1 - (timerMinutes * 60 + timerSeconds) / (initialTimerMinutes * 60 + initialTimerSeconds))}` : '0'}
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    {/* Цифры в центре */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="font-mono text-2xl font-bold text-center text-gray-800">
                        {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center mb-6 space-x-2">
                  <input
                    type="text"
                    value={timerMinutes}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setTimerMinutes(Math.max(0, parseInt(value) || 0));
                    }}
                    className="w-16 px-2 py-1 text-center transition-all border-0 rounded-lg bg-gray-100/50 backdrop-blur-sm focus:bg-gray-100/70 focus:outline-none"
                    disabled={timerActive}
                  />
                  <span className="text-gray-600">мин</span>
                  <input
                    type="text"
                    value={timerSeconds}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setTimerSeconds(Math.max(0, Math.min(59, parseInt(value) || 0)));
                    }}
                    className="w-16 px-2 py-1 text-center transition-all border-0 rounded-lg bg-gray-100/50 backdrop-blur-sm focus:bg-gray-100/70 focus:outline-none"
                    disabled={timerActive}
                  />
                  <span className="text-gray-600">сек</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      if (!timerActive) {
                        // Сохраняем изначальные значения при старте
                        setInitialTimerMinutes(timerMinutes);
                        setInitialTimerSeconds(timerSeconds);
                      }
                      setTimerActive(!timerActive);
                    }}
                    className="flex-1 py-2 text-white transition-all bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                  >
                    {timerActive ? 'Пауза' : 'Старт'}
                  </button>
                  <button
                    onClick={() => {
                      setTimerActive(false);
                      setTimerMinutes(5);
                      setTimerSeconds(0);
                      setInitialTimerMinutes(5);
                      setInitialTimerSeconds(0);
                    }}
                    className="flex-1 py-2 text-gray-700 transition-all bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-400"
                  >
                    Сброс
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default Desktop;