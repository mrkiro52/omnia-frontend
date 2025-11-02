import React, { useState, useEffect, useRef } from 'react';

const PomodoroTimer = ({ isDetached, onToggleDetach }) => {
  // Загружаем состояние из localStorage
  const loadFromStorage = () => {
    const saved = localStorage.getItem('pomodoroState')
    if (saved) {
      return JSON.parse(saved)
    }
    return {
      workTime: 25,
      restTime: 5,
      rounds: 4,
      currentRound: 1,
      timeLeft: 25 * 60,
      isRunning: false,
      isWorkTime: true,
      position: { x: 20, y: 20 }
    }
  }

  const initialState = loadFromStorage()
  
  const [workTime, setWorkTime] = useState(initialState.workTime);
  const [restTime, setRestTime] = useState(initialState.restTime);
  const [rounds, setRounds] = useState(initialState.rounds);
  const [currentRound, setCurrentRound] = useState(initialState.currentRound);
  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft);
  const [isRunning, setIsRunning] = useState(initialState.isRunning);
  const [isWorkTime, setIsWorkTime] = useState(initialState.isWorkTime);
  const [position, setPosition] = useState(initialState.position);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  
  const timerRef = useRef();
  const dragRef = useRef();

  // Сохраняем состояние в localStorage
  const saveToStorage = () => {
    const state = {
      workTime,
      restTime,
      rounds,
      currentRound,
      timeLeft,
      isRunning,
      isWorkTime,
      position
    }
    localStorage.setItem('pomodoroState', JSON.stringify(state))
  }

  // Отслеживаем размер экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Сохраняем состояние при изменениях
  useEffect(() => {
    saveToStorage()
  }, [workTime, restTime, rounds, currentRound, timeLeft, isRunning, isWorkTime, position])

  // Обновляем время при изменении настроек
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(isWorkTime ? workTime * 60 : Math.round(restTime * 60));
    }
  }, [workTime, restTime, isWorkTime, isRunning]);

  // Таймер
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Переключение между работой и отдыхом
      if (isWorkTime) {
        setIsWorkTime(false);
        setTimeLeft(Math.round(restTime * 60));
      } else {
        setIsWorkTime(true);
        if (currentRound < rounds) {
          setCurrentRound(currentRound + 1);
          setTimeLeft(workTime * 60);
        } else {
          // Сессия завершена
          setIsRunning(false);
          setCurrentRound(1);
          setTimeLeft(workTime * 60);
          alert('Pomodoro сессия завершена!');
        }
      }
    }

    return () => clearTimeout(timerRef.current);
  }, [isRunning, timeLeft, isWorkTime, workTime, restTime, currentRound, rounds]);

  // Обработка перетаскивания
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && isDetached) {
        const newPosition = {
          x: Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y))
        }
        setPosition(newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isDetached]);

  const handleMouseDown = (e) => {
    if (isDetached) {
      setIsDragging(true);
      const rect = dragRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsWorkTime(true);
    setCurrentRound(1);
    setTimeLeft(workTime * 60);
  };

  const adjustWorkTime = (delta) => {
    let newTime;
    if (delta > 0) {
      // Увеличение: 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
      if (workTime < 5) {
        newTime = 5;
      } else {
        newTime = Math.min(60, workTime + 5);
      }
    } else {
      // Уменьшение: от 5 минут можем дойти до 1 минуты
      if (workTime <= 5) {
        newTime = 1;
      } else {
        newTime = Math.max(5, workTime - 5);
      }
    }
    setWorkTime(newTime);
  };

  const adjustRestTime = (delta) => {
    let newTime;
    if (delta > 0) {
      // Увеличение: 10сек -> 1мин -> 2мин -> 3мин -> и так далее
      if (restTime < 1) {
        newTime = 1;
      } else {
        newTime = Math.min(30, restTime + 1);
      }
    } else {
      // Уменьшение: от 1 минуты можем дойти до 10 секунд (0.17 минуты)
      if (restTime <= 1) {
        newTime = 0.17; // 10 секунд
      } else {
        newTime = Math.max(1, restTime - 1);
      }
    }
    setRestTime(newTime);
  };

  const adjustRounds = (delta) => {
    const newRounds = Math.max(1, Math.min(10, rounds + delta));
    setRounds(newRounds);
  };

  const containerClasses = isDetached
    ? "fixed z-50 bg-white border border-zinc-200 rounded-lg shadow-lg"
    : "bg-white border border-zinc-200 rounded-lg shadow-sm";

  const containerStyle = isDetached
    ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '300px'
      }
    : {};

  // Определяем нужно ли мигание
  const shouldBlink = () => {
    if (!isRunning) return false;
    
    // Мигание желтым на последних 3 секундах рабочего времени
    if (isWorkTime && timeLeft <= 3 && timeLeft > 0) return 'yellow';
    
    // Мигание красным по окончанию последнего раунда
    if (!isWorkTime && currentRound === rounds && timeLeft <= 3 && timeLeft > 0) return 'red';
    
    return false;
  };

  const blinkType = shouldBlink();
  const blinkClass = blinkType === 'yellow' 
    ? 'animate-pulse bg-yellow-50 border-yellow-200' 
    : blinkType === 'red' 
    ? 'animate-pulse bg-red-50 border-red-200' 
    : '';

  const finalContainerClasses = `${containerClasses} ${blinkClass}`;

  return (
    <div 
      ref={dragRef}
      className={finalContainerClasses}
      style={containerStyle}
    >
      {/* Заголовок с возможностью перетаскивания */}
      <div 
        className={`flex items-center justify-between p-4 border-b border-zinc-200 ${
          isDetached ? 'cursor-move' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-lg font-semibold select-none text-zinc-900">Таймер Помодоро</h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 rounded cursor-pointer text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {!isMobile && (
            <button
              onClick={onToggleDetach}
              className="p-1 rounded cursor-pointer text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
            >
            {isDetached ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-5 5m0 0l-5-5m5 5V9" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            )}
            </button>
          )}
        </div>
      </div>

      {/* Информационная плашка о методе Помодоро */}
      {showInfo && (
        <div className="p-3 mx-4 mt-4 border border-indigo-200 rounded-lg bg-indigo-50">
          <h4 className="mb-2 text-sm font-semibold text-indigo-900">Метод Помодоро</h4>
          <p className="mb-2 text-xs text-indigo-700">
            Техника управления временем для повышения концентрации и предотвращения выгорания.
          </p>
          <div className="space-y-1 text-xs text-indigo-600">
            <div>• Работаешь 25 минут, потом перерыв 5 минут</div>
            <div>• После 4 циклов — длинный перерыв 15–30 минут</div>
            <div>• Цель: повысить концентрацию и избежать выгорания</div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Текущий статус */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${isWorkTime ? 'text-red-600' : 'text-green-600'}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-zinc-600">
            {isWorkTime ? 'Работа' : 'Отдых'} • Раунд {currentRound}/{rounds}
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="flex justify-center space-x-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-4 py-2 text-white bg-green-600 rounded-lg cursor-pointer hover:bg-green-700"
            >
              Старт
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-4 py-2 text-white bg-yellow-600 rounded-lg cursor-pointer hover:bg-yellow-700"
            >
              Пауза
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg cursor-pointer text-zinc-700 bg-zinc-200 hover:bg-zinc-300"
          >
            Сброс
          </button>
        </div>

        {/* Настройки */}
        {!isRunning && (
          <div className="pt-4 space-y-3 border-t border-zinc-200">
            {/* Время работы */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-700">Работа:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => adjustWorkTime(-5)}
                  className="w-6 h-6 rounded cursor-pointer text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
                >
                  −
                </button>
                <span className="w-8 text-sm font-medium text-center">{workTime}м</span>
                <button
                  onClick={() => adjustWorkTime(5)}
                  className="w-6 h-6 rounded cursor-pointer text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Время отдыха */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-700">Отдых:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => adjustRestTime(-1)}
                  className="w-6 h-6 rounded cursor-pointer text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
                >
                  −
                </button>
                <span className="w-8 text-sm font-medium text-center">
                  {restTime < 1 ? '10с' : `${restTime}м`}
                </span>
                <button
                  onClick={() => adjustRestTime(1)}
                  className="w-6 h-6 rounded cursor-pointer text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Количество раундов */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-700">Раунды:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => adjustRounds(-1)}
                  className="w-6 h-6 rounded cursor-pointer text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
                >
                  −
                </button>
                <span className="w-8 text-sm font-medium text-center">{rounds}</span>
                <button
                  onClick={() => adjustRounds(1)}
                  className="w-6 h-6 rounded cursor-pointer text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;