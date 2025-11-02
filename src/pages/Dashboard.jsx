import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PomodoroTimer from '../components/PomodoroTimer';
import TodoList from '../components/TodoList';
import Meditation from '../components/Meditation';
import DailyTask from '../components/DailyTask';

function Dashboard() {
  const navigate = useNavigate();
  const [isPomodoroDetached, setIsPomodoroDetached] = useState(() => {
    return JSON.parse(localStorage.getItem('pomodoroDetached') || 'false')
  });

  const [isTodoDetached, setIsTodoDetached] = useState(() => {
    return JSON.parse(localStorage.getItem('todoDetached') || 'false')
  });

  const [isMeditationDetached, setIsMeditationDetached] = useState(() => {
    return JSON.parse(localStorage.getItem('meditationDetached') || 'false')
  });

  const handleTogglePomodoroDetach = () => {
    if (window.togglePomodoroDetach) {
      window.togglePomodoroDetach();
      setIsPomodoroDetached(!isPomodoroDetached);
    }
  };

  const handleToggleTodoDetach = () => {
    if (window.toggleTodoDetach) {
      window.toggleTodoDetach();
      setIsTodoDetached(!isTodoDetached);
    }
  };

  const handleToggleMeditationDetach = () => {
    if (window.toggleMeditationDetach) {
      window.toggleMeditationDetach();
      setIsMeditationDetached(!isMeditationDetached);
    }
  };

  // Синхронизируем состояние с localStorage
  useEffect(() => {
    const checkDetachedState = () => {
      const pomodoroDetached = JSON.parse(localStorage.getItem('pomodoroDetached') || 'false');
      const todoDetached = JSON.parse(localStorage.getItem('todoDetached') || 'false');
      const meditationDetached = JSON.parse(localStorage.getItem('meditationDetached') || 'false');
      setIsPomodoroDetached(pomodoroDetached);
      setIsTodoDetached(todoDetached);
      setIsMeditationDetached(meditationDetached);
    };
    
    // Проверяем каждые 100мс для синхронизации
    const interval = setInterval(checkDetachedState, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pb-20 space-y-6 lg:pb-0">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">Панель управления</h1>
        <p className="text-zinc-600">Добро пожаловать на панель управления.</p>
      </div>
    
      {/* Сетка виджетов */}
      <div className="grid gap-6 auto-rows-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {/* Таймер Помодоро */}
        {!isPomodoroDetached && ( 
          <PomodoroTimer 
            isDetached={false} 
            onToggleDetach={handleTogglePomodoroDetach} 
          />
        )}
        
        {/* Todo лист */}
        {!isTodoDetached && (
          <TodoList 
            isDetached={false} 
            onToggleDetach={handleToggleTodoDetach} 
          />
        )}

        {/* Медитации */}
        {!isMeditationDetached && (
          <Meditation 
            isDetached={false} 
            onToggleDetach={handleToggleMeditationDetach} 
          />
        )}

        <DailyTask />

        {/* Виртуальное рабочее место */}
        <div className="transition-shadow bg-white border rounded-lg shadow-sm border-zinc-200 hover:shadow-md">
          <div className="flex items-center justify-between p-6 border-b border-zinc-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900" style={{ lineHeight: '105%' }}>Виртуальное рабочее место</h3>
            </div>
          </div>
          
          <div className="p-6">
            <button
              onClick={() => navigate('desktop')}
              className="flex items-center justify-center w-full px-6 py-3 space-x-2 font-medium text-white transition-all duration-200 rounded-lg cursor-pointer bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Открыть рабочее место</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;