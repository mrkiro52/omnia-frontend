import React, { useState, useEffect, useRef } from 'react';

const TodoList = ({ isDetached = false, onToggleDetach = () => {} }) => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todoList');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('todoPosition');
    // Всегда начинаем слева для новых сессий
    return saved ? JSON.parse(saved) : { x: 20, y: 80 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  
  const dragRef = useRef();

  // Отслеживаем размер экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todos));
  }, [todos]);

  // Сохраняем позицию
  useEffect(() => {
    if (isDetached) {
      localStorage.setItem('todoPosition', JSON.stringify(position));
    }
  }, [position, isDetached]);

  // Автоматически перемещаем влево при открепления, если виджет справа
  useEffect(() => {
    if (isDetached && position.x > window.innerWidth / 2) {
      setPosition({ x: 20, y: position.y });
    }
  }, [isDetached]);

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

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id, e) => {
    e.stopPropagation(); // Предотвращаем переключение статуса при удалении
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

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

  const containerClasses = isDetached
    ? "fixed z-50 bg-white border border-zinc-200 rounded-lg shadow-lg"
    : "bg-white border border-zinc-200 rounded-lg shadow-sm";

  const containerStyle = isDetached
    ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '320px',
        height: '400px',
        display: 'flex',
        flexDirection: 'column'
      }
    : {
        height: '400px',
        display: 'flex',
        flexDirection: 'column'
      };

  // Вычисляем прогресс выполнения
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <div 
      ref={dragRef}
      className={`${containerClasses} ${isCompleted ? 'shadow-lg shadow-yellow-200/50' : ''}`}
      style={containerStyle}
    >
      {/* Заголовок с возможностью перетаскивания */}
      <div 
        className={`flex items-center justify-between p-4 border-b border-zinc-200 ${
          isDetached ? 'cursor-move' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center flex-1 gap-3">
          <h3 className="text-lg font-semibold select-none text-zinc-900">Todo лист</h3>
          
          {/* Полоса прогресса */}
          <div className="flex-1">
            <div className="w-full h-2 overflow-hidden rounded-full bg-zinc-200">
              <div 
                className={`h-full transition-all duration-300 ease-out rounded-full ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-sm shadow-yellow-300/50' 
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        {!isMobile && (
          <button
            onClick={onToggleDetach}
            className="p-1 ml-2 rounded cursor-pointer text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
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

      {/* Контент блок */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Форма добавления - фиксированная */}
        <div className="flex-shrink-0 p-4 border-b border-zinc-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Добавить задачу..."
              className="flex-1 px-4 py-2 text-sm border rounded-full border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={addTodo}
              className="flex items-center justify-center w-10 h-10 text-lg font-medium text-white bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700"
            >
              +
            </button>
          </div>
        </div>

        {/* Область скролла для задач */}
        <div className="flex-1 min-h-0 p-4 overflow-y-auto custom-scrollbar">
            {todos.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <svg className="w-12 h-12 mb-3 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-sm text-zinc-500">Пока нет задач</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                      todo.completed 
                        ? 'bg-zinc-50 opacity-60' 
                        : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                        todo.completed
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'border-zinc-300 hover:border-indigo-400'
                      }`}
                    >
                      {todo.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`flex-1 text-sm transition-all duration-200 min-w-0 ${
                        todo.completed
                          ? 'text-zinc-500 line-through'
                          : 'text-zinc-900'
                      }`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={(e) => deleteTodo(todo.id, e)}
                      className="flex items-center justify-center flex-shrink-0 w-6 h-6 transition-all duration-200 rounded-full opacity-0 cursor-pointer text-zinc-400 hover:text-red-500 hover:bg-red-50 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;