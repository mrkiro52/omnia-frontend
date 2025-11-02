import React, { useState, useEffect, useRef } from 'react';

const Meditation = ({ isDetached, onToggleDetach }) => {
  // Загружаем позицию из localStorage
  const loadPosition = () => {
    const saved = localStorage.getItem('meditationPosition');
    return saved ? JSON.parse(saved) : { x: 20, y: 140 };
  };

  const [position, setPosition] = useState(loadPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [meditationActive, setMeditationActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepTimeLeft, setStepTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);

  const dragRef = useRef();
  const timerRef = useRef();

  // Популярные короткие медитации для работы
  const meditations = [
    {
      id: 1,
      title: 'Дыхание 4-7-8',
      duration: 3, // минуты
      description: 'Техника релаксации через дыхание',
      icon: '🌬️',
      color: 'from-blue-400 to-blue-600',
      steps: [
        { text: 'Сядьте удобно, закройте глаза', duration: 30 },
        { text: 'Вдох через нос на 4 счета', duration: 30 },
        { text: 'Задержите дыхание на 7 счетов', duration: 30 },
        { text: 'Выдох через рот на 8 счетов', duration: 90 },
        { text: 'Повторяем цикл', duration: 30 }
      ]
    },
    {
      id: 2,
      title: 'Осознанность',
      duration: 5,
      description: 'Быстрая практика осознанности',
      icon: '🧘',
      color: 'from-green-400 to-green-600',
      steps: [
        { text: 'Закройте глаза и расслабьтесь', duration: 60 },
        { text: 'Обратите внимание на свое дыхание', duration: 120 },
        { text: 'Почувствуйте точки соприкосновения с креслом', duration: 60 },
        { text: 'Осознайте звуки вокруг вас', duration: 60 },
        { text: 'Медленно откройте глаза', duration: 60 }
      ]
    },
    {
      id: 3,
      title: 'Снятие стресса',
      duration: 4,
      description: 'Быстрое снятие напряжения',
      icon: '🌊',
      color: 'from-purple-400 to-purple-600',
      steps: [
        { text: 'Глубоко вдохните и выдохните', duration: 30 },
        { text: 'Напрягите мышцы лица на 5 секунд', duration: 30 },
        { text: 'Резко расслабьте и почувствуйте облегчение', duration: 30 },
        { text: 'Проделайте то же с плечами', duration: 30 },
        { text: 'Расслабьте все тело полностью', duration: 180 }
      ]
    },
    {
      id: 4,
      title: 'Концентрация',
      duration: 3,
      description: 'Повышение фокуса и внимания',
      icon: '🎯',
      color: 'from-orange-400 to-orange-600',
      steps: [
        { text: 'Сосредоточьтесь на одной точке перед собой', duration: 60 },
        { text: 'Считайте свои вдохи от 1 до 10', duration: 60 },
        { text: 'Если сбились - начните с 1', duration: 30 },
        { text: 'Продолжайте концентрироваться', duration: 30 }
      ]
    }
  ];

  // Отслеживаем размер экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Автоматически перемещаем влево при открепления
  useEffect(() => {
    if (isDetached && position.x > window.innerWidth / 2) {
      setPosition({ x: 20, y: position.y });
    }
  }, [isDetached]);

  // Сохраняем позицию
  useEffect(() => {
    if (isDetached) {
      localStorage.setItem('meditationPosition', JSON.stringify(position));
    }
  }, [position, isDetached]);

  // Обработка перетаскивания
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && isDetached) {
        const newPosition = {
          x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y))
        };
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

  // Таймер медитации
  useEffect(() => {
    if (meditationActive && stepTimeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setStepTimeLeft(stepTimeLeft - 1);
        setTotalTimeLeft(totalTimeLeft - 1);
      }, 1000);
    } else if (meditationActive && stepTimeLeft === 0) {
      // Переход к следующему шагу
      if (currentStep < selectedMeditation.steps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setStepTimeLeft(selectedMeditation.steps[nextStep].duration);
      } else {
        // Медитация завершена
        completeMeditation();
      }
    }

    return () => clearTimeout(timerRef.current);
  }, [meditationActive, stepTimeLeft, totalTimeLeft, currentStep, selectedMeditation]);

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

  const handleMeditationSelect = (meditation) => {
    setSelectedMeditation(meditation);
    setShowConfirmation(true);
  };

  const startMeditation = () => {
    setShowConfirmation(false);
    setMeditationActive(true);
    setCurrentStep(0);
    setStepTimeLeft(selectedMeditation.steps[0].duration);
    setTotalTimeLeft(selectedMeditation.duration * 60);
  };

  const completeMeditation = () => {
    setMeditationActive(false);
    setSelectedMeditation(null);
    setCurrentStep(0);
    setStepTimeLeft(0);
    setTotalTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const containerClasses = isDetached
    ? "fixed z-50 bg-white border border-zinc-200 rounded-lg shadow-lg"
    : "bg-white border border-zinc-200 rounded-lg shadow-sm";

  const containerStyle = isDetached
    ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '320px'
      }
    : {};

  return (
    <>
      {/* Основной компонент */}
      <div 
        ref={dragRef}
        className={containerClasses}
        style={containerStyle}
      >
        {/* Заголовок */}
        <div 
          className={`flex items-center justify-between p-4 border-b border-zinc-200 ${
            isDetached ? 'cursor-move' : ''
          }`}
          onMouseDown={handleMouseDown}
        >
          <h3 className="text-lg font-semibold select-none text-zinc-900">Медитации</h3>
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

        {/* Сетка медитаций */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {meditations.map((meditation) => (
              <button
                key={meditation.id}
                onClick={() => handleMeditationSelect(meditation)}
                className={`cursor-pointer relative p-4 rounded-xl bg-gradient-to-br ${meditation.color} text-white hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95`}
              >
                <div className="mb-2 text-2xl">{meditation.icon}</div>
                <div className="mb-1 text-sm font-medium">{meditation.title}</div>
                <div className="text-xs opacity-90">{meditation.duration} мин</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения */}
      {showConfirmation && selectedMeditation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 mx-4 bg-white rounded-2xl">
            <div className="text-center">
              <div className="mb-4 text-4xl">{selectedMeditation.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{selectedMeditation.title}</h3>
              <p className="mb-4 text-zinc-600">{selectedMeditation.description}</p>
              <p className="mb-6 text-sm text-zinc-500">
                Продолжительность: {selectedMeditation.duration} минут
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-3 transition-colors cursor-pointer text-zinc-600 bg-zinc-100 rounded-xl hover:bg-zinc-200"
                >
                  Отмена
                </button>
                <button
                  onClick={startMeditation}
                  className={`flex-1 py-3 text-white cursor-pointer bg-gradient-to-r ${selectedMeditation.color} rounded-xl hover:shadow-lg transition-all`}
                >
                  Начать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Оверлей медитации */}
      {meditationActive && selectedMeditation && (
        <div className={`fixed inset-0 z-50 bg-gradient-to-br ${selectedMeditation.color} flex items-center justify-center`}>
          <div className="px-6 text-center text-white">
            {/* Прогресс */}
            <div className="mb-8">
              <div className="mb-2 text-sm opacity-80">
                Шаг {currentStep + 1} из {selectedMeditation.steps.length}
              </div>
              <div className="w-64 h-2 mx-auto bg-white rounded-full bg-opacity-20">
                <div 
                  className="h-full transition-all duration-1000 bg-white rounded-full"
                  style={{ 
                    width: `${((currentStep + 1) / selectedMeditation.steps.length) * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Текущий шаг */}
            <div className="mb-8">
              <h2 className="mb-4 text-3xl font-light">
                {selectedMeditation.steps[currentStep]?.text}
              </h2>
              
              {/* Таймер шага */}
              <div className="mb-2 text-6xl font-thin">
                {formatTime(stepTimeLeft)}
              </div>
              
              {/* Общее время */}
              <div className="text-sm opacity-80">
                Осталось: {formatTime(totalTimeLeft)}
              </div>
            </div>

            {/* Анимация дыхания (для дыхательных практик) */}
            {selectedMeditation.id === 1 && (
              <div className="mb-8">
                <div className="w-8 h-8 mx-auto bg-white rounded-full bg-opacity-20 animate-ping" />
              </div>
            )}

            {/* Кнопка завершения */}
            <button
              onClick={completeMeditation}
              className="px-8 py-3 text-black transition-all bg-white cursor-pointer bg-opacity-20 hover:bg-opacity-30 rounded-xl backdrop-blur-sm"
            >
              Завершить медитацию
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Meditation;
