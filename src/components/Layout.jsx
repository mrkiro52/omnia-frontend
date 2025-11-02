import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import PomodoroTimer from './PomodoroTimer'
import TodoList from './TodoList'
import Meditation from './Meditation'

export default function Layout() {
  const [isPomodoroDetached, setIsPomodoroDetached] = useState(() => {
    return JSON.parse(localStorage.getItem('pomodoroDetached') || 'false')
  })

  const [isTodoDetached, setIsTodoDetached] = useState(() => {
    return JSON.parse(localStorage.getItem('todoDetached') || 'false')
  })

  const [isMeditationDetached, setIsMeditationDetached] = useState(() => {
    return JSON.parse(localStorage.getItem('meditationDetached') || 'false')
  })

  const handleTogglePomodoroDetach = () => {
    const newState = !isPomodoroDetached
    setIsPomodoroDetached(newState)
    localStorage.setItem('pomodoroDetached', JSON.stringify(newState))
  }

  const handleToggleTodoDetach = () => {
    const newState = !isTodoDetached
    setIsTodoDetached(newState)
    localStorage.setItem('todoDetached', JSON.stringify(newState))
  }

  const handleToggleMeditationDetach = () => {
    const newState = !isMeditationDetached
    setIsMeditationDetached(newState)
    localStorage.setItem('meditationDetached', JSON.stringify(newState))
  }

  // Передаем функции открепления через контекст окна
  useEffect(() => {
    window.togglePomodoroDetach = handleTogglePomodoroDetach
    window.toggleTodoDetach = handleToggleTodoDetach
    window.toggleMeditationDetach = handleToggleMeditationDetach
    return () => {
      delete window.togglePomodoroDetach
      delete window.toggleTodoDetach
      delete window.toggleMeditationDetach
    }
  }, [handleTogglePomodoroDetach, handleToggleTodoDetach, handleToggleMeditationDetach])

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      
      {/* Глобальные открепленные виджеты */}
      {isPomodoroDetached && (
        <PomodoroTimer 
          isDetached={true} 
          onToggleDetach={handleTogglePomodoroDetach} 
        />
      )}
      
      {isTodoDetached && (
        <TodoList 
          isDetached={true} 
          onToggleDetach={handleToggleTodoDetach} 
        />
      )}
      
      {isMeditationDetached && (
        <Meditation 
          isDetached={true} 
          onToggleDetach={handleToggleMeditationDetach} 
        />
      )}
    </div>
  )
}