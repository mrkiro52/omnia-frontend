import React, { useState } from 'react';
import { LOGO_MAIN } from '../assets/images';

const Landing = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Пока что ничего не делаем
    console.log('Form submitted:', formData);
  };

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "База знаний",
      description: "Полноценные курсы, уроки и статьи по IT, математике, менеджменту и саморазвитию"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Комьюнити единомышленников",
      description: "Общение, обмен опытом и поиск команды среди мотивированных специалистов"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Инструменты продуктивности",
      description: "Todo-листы, таймеры, медитации и системы тайм-менеджмента в одном месте"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      ),
      title: "Поиск работы",
      description: "Быстрый поиск проектов и специалистов в команду среди участников сообщества"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Эксклюзивные мероприятия",
      description: "Конференции, хакатоны и интенсивы только для участников сообщества"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Система рангов",
      description: "Больше возможностей и влияния для опытных участников сообщества"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={LOGO_MAIN} 
                alt="Omnia Logo" 
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-xl font-bold text-zinc-900">Omnia</h1>
                <p className="text-xs text-zinc-600">Всё для избранных</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl text-zinc-900">
              Замени все соцсети
              <span className="block text-indigo-600">одной платформой</span>
            </h1>
            <p className="max-w-3xl mx-auto mb-8 text-xl text-zinc-600">
              Omnia — закрытая социальная сеть для специалистов, где ты не тупеешь, а растёшь. 
              Здесь комьюнити единомышленников, которые хотят развиваться, а не поддаваться влиянию развлекательного контента.
            </p>
            <div className="inline-flex items-center px-6 py-3 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
              🔒 Закрытое сообщество для избранных
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-zinc-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl text-zinc-900">
              Устал от бесполезного контента?
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-zinc-600">
              В обычных соцсетях ты тратишь время на развлечения, а здесь — инвестируешь в своё будущее. 
              Omnia объединяет всё необходимое для учёбы, работы и профессионального роста.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl text-zinc-900">
              Всё в одном месте
            </h2>
            <p className="text-xl text-zinc-600">
              Полноценная экосистема для профессионального развития
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="p-8 transition-colors bg-zinc-50 rounded-2xl hover:bg-zinc-100">
                <div className="mb-4 text-indigo-600">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="text-zinc-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Categories */}
      <section className="py-20 bg-zinc-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl text-zinc-900">
              Материалы по всем направлениям
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 text-center bg-white rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-blue-600 bg-blue-100 rounded-lg">
                💻
              </div>
              <h3 className="mb-2 font-semibold text-zinc-900">IT науки</h3>
              <p className="text-sm text-zinc-600">Программирование, алгоритмы, системы</p>
            </div>

            <div className="p-6 text-center bg-white rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-green-600 bg-green-100 rounded-lg">
                📊
              </div>
              <h3 className="mb-2 font-semibold text-zinc-900">Менеджмент</h3>
              <p className="text-sm text-zinc-600">Тайм и таск менеджмент, лидерство</p>
            </div>

            <div className="p-6 text-center bg-white rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-purple-600 bg-purple-100 rounded-lg">
                📐
              </div>
              <h3 className="mb-2 font-semibold text-zinc-900">Математика</h3>
              <p className="text-sm text-zinc-600">ОГЭ, ЕГЭ, высшая математика</p>
            </div>

            <div className="p-6 text-center bg-white rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-yellow-600 bg-yellow-100 rounded-lg">
                🚀
              </div>
              <h3 className="mb-2 font-semibold text-zinc-900">Саморазвитие</h3>
              <p className="text-sm text-zinc-600">Личная эффективность, навыки</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl text-zinc-900">
                Встроенные инструменты продуктивности
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">Todo-листы и планировщики</h3>
                    <p className="text-zinc-600">Организуй свои задачи и цели эффективно</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">Таймеры и фокус-сессии</h3>
                    <p className="text-zinc-600">Техника Pomodoro и контроль времени</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">Медитации и практики</h3>
                    <p className="text-zinc-600">Ежедневные практики для ясности ума</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">Образовательные игры</h3>
                    <p className="text-zinc-600">Развлечения, которые делают тебя умнее</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 text-center bg-white rounded-xl">
                  <div className="mb-2 text-2xl">⏰</div>
                  <p className="text-sm font-medium text-zinc-900">Pomodoro</p>
                </div>
                <div className="p-4 text-center bg-white rounded-xl">
                  <div className="mb-2 text-2xl">✅</div>
                  <p className="text-sm font-medium text-zinc-900">Tasks</p>
                </div>
                <div className="p-4 text-center bg-white rounded-xl">
                  <div className="mb-2 text-2xl">🧘</div>
                  <p className="text-sm font-medium text-zinc-900">Meditation</p>
                </div>
                <div className="p-4 text-center bg-white rounded-xl">
                  <div className="mb-2 text-2xl">🎯</div>
                  <p className="text-sm font-medium text-zinc-900">Focus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Search Section */}
      <section className="py-20 bg-indigo-600">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Найди работу или команду за один день
          </h2>
          <p className="max-w-3xl mx-auto mb-8 text-xl text-indigo-100">
            Специальная вкладка для поиска проектов и сотрудников среди участников сообщества. 
            Решай вопросы трудоустройства в разы быстрее благодаря качественной аудитории.
          </p>
          <div className="grid max-w-4xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
            <div className="p-6 bg-indigo-500 rounded-xl">
              <h3 className="mb-3 text-xl font-semibold text-white">Ищешь работу?</h3>
              <p className="text-indigo-100">Найди проекты и стартапы среди участников сообщества</p>
            </div>
            <div className="p-6 bg-indigo-500 rounded-xl">
              <h3 className="mb-3 text-xl font-semibold text-white">Нужна команда?</h3>
              <p className="text-indigo-100">Найди мотивированных специалистов для своего проекта</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Стань частью сообщества
            </h2>
            <p className="mb-8 text-xl text-zinc-300">
              Присоединяйся к закрытому сообществу профессионалов, которые инвестируют в своё развитие каждый день
            </p>
          </div>

          <div className="max-w-md p-8 mx-auto bg-white rounded-2xl">
            <h3 className="mb-6 text-2xl font-bold text-center text-zinc-900">
              Заявка на участие
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-zinc-700">
                  Имя
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 transition-colors border rounded-lg border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Введите ваше имя"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-zinc-700">
                  Номер для связи
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 transition-colors border rounded-lg border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+7 (000) 000-00-00"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Номер должен быть привязан к Telegram или WhatsApp
                </p>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Присоединиться
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-zinc-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3">
            <img 
              src={LOGO_MAIN} 
              alt="Omnia Logo" 
              className="w-6 h-6"
            />
            <div className="text-center">
              <p className="font-semibold text-white">Omnia</p>
              <p className="text-sm text-zinc-400">Всё для избранных</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;