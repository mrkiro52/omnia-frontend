import { useState, useEffect } from 'react'

export default function KnowledgeBase() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [articles, setArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // Загружаем категории при инициализации
  useEffect(() => {
    loadCategories()
  }, [])


  useEffect(() => {
    if (selectedCategory) {
      loadArticles(selectedCategory.id)
    }
  }, [selectedCategory])

  const loadCategories = async () => {
    setCategoriesLoading(true)
    try {
      const response = await fetch('https://omnia-backend-fyuo.onrender.com/api/knowledge/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.data)
      } else {
        console.error('Failed to load categories')
        setCategories([])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      setCategories([])
    } finally {
      setCategoriesLoading(false)
    }
  }

  const loadArticles = async (categoryId) => {
    setLoading(true)
    try {
      const response = await fetch('https://omnia-backend-fyuo.onrender.com/api/knowledge/articles')
      if (response.ok) {
        const data = await response.json()
        // Приводим ID к строке для корректного сравнения
        const filteredArticles = data.data.filter(article => String(article.category) === String(categoryId))
        console.log('Filtering articles for category:', categoryId, 'Found:', filteredArticles.length)
        setArticles(filteredArticles)
      } else {
        console.error('Failed to load articles')
        setArticles([])
      }
    } catch (error) {
      console.error('Error loading articles:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const renderMarkdown = (content) => {
    if (!content) return ''
    
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 text-zinc-900">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 text-zinc-800">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2 text-zinc-800">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-zinc-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-zinc-100 p-4 rounded-lg mb-4 overflow-x-auto"><code class="text-sm">$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-zinc-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/^- (.*$)/gim, '<li class="mb-1">$1</li>')
      .replace(/(<li class="mb-1">.*<\/li>)/s, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>')
      .replace(/^\d+\. (.*$)/gim, '<li class="mb-1">$1</li>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 mb-4 italic text-zinc-700">$1</blockquote>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|p|u|b|c])(.+)/gm, '<p class="mb-4">$1</p>')
  }

  return (
    <div className="pb-20 space-y-8 lg:pb-0">
      {!selectedCategory && !selectedArticle && (
        <div className="relative p-12 overflow-hidden border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 rounded-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-sky-400/20 to-blue-400/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 -translate-x-12 translate-y-12 rounded-full bg-gradient-to-br from-blue-400/20 to-sky-400/20"></div>
          <div className="relative">
            <h1 className="mb-1 text-4xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text">База знаний</h1>
            <p className="text-lg text-zinc-600">Изучайте материалы по различным направлениям разработки и расширяйте свои навыки</p>
          </div>
        </div>
      )}

      {selectedArticle ? (
        // Просмотр статьи
        <div>
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center px-4 py-2 mb-8 font-medium transition-all duration-200 rounded-full cursor-pointer text-sky-600 group bg-sky-50 hover:bg-sky-100 hover:text-sky-700"
          >
            <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к списку
          </button>

          <div className="relative p-10 overflow-hidden bg-white border shadow-xl rounded-3xl border-zinc-200">
            <div className="absolute top-0 right-0 w-40 h-40 translate-x-20 -translate-y-20 rounded-full bg-gradient-to-br from-sky-400/5 to-blue-400/5"></div>
            <div className="relative mb-8">
              <h1 className="mb-4 text-4xl font-bold leading-tight text-transparent bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text">{selectedArticle.title}</h1>
              <div className="flex items-center space-x-4">
                <span className="px-4 py-2 font-semibold capitalize border rounded-full text-sky-700 border-sky-200 bg-gradient-to-r from-sky-100 to-blue-100">
                  {selectedArticle.type}
                </span>
                <span className="font-medium text-zinc-600">Категория: <span className="text-sky-600">{categories.find(cat => String(cat.id) === String(selectedArticle.category))?.title}</span></span>
              </div>
            </div>
            
            <div 
              className="prose prose-zinc max-w-none article-content"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
          </div>
        </div>
      ) : !selectedCategory ? (
        // Список категорий
        <div>
          {categoriesLoading ? (
            <div className="py-8 text-center">
              <div className="text-zinc-500">Загрузка категорий...</div>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-8 text-center">
              <div className="text-zinc-500">Категории не найдены</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className="relative p-8 overflow-hidden transition-all duration-300 bg-white border cursor-pointer rounded-3xl border-zinc-200 hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-300 hover:-translate-y-1 group"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 transition-transform duration-500 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-sky-500/10 to-blue-500/10 group-hover:scale-150"></div>
                  <div className="relative">
                    <div className="mb-6 text-5xl filter drop-shadow-sm">{category.icon}</div>
                    <h3 className="mb-3 text-xl font-bold transition-colors text-zinc-900 group-hover:text-sky-600">
                      {category.title}
                    </h3>
                    <p className="mb-6 leading-relaxed text-zinc-600">
                      {category.description}
                    </p>
                    <div className="flex items-center text-sm font-semibold text-sky-600 group-hover:text-sky-700">
                      <span>Изучить</span>
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Список статей в категории
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center px-4 py-2 mb-8 font-medium transition-all duration-200 rounded-full cursor-pointer text-sky-600 group bg-sky-50 hover:bg-sky-100 hover:text-sky-700"
          >
            <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к категориям
          </button>

          <div className="relative p-8 mb-8 overflow-hidden border shadow-lg border-sky-100 bg-gradient-to-r from-white to-sky-50/50 rounded-3xl">
            <div className="absolute top-0 right-0 w-32 h-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-sky-400/10 to-blue-400/10"></div>
            <div className="relative flex items-center">
              <div className="p-3 mr-6 text-4xl bg-white border shadow-sm border-sky-100 rounded-2xl">{selectedCategory.icon}</div>
              <div>
                <h2 className="mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text">{selectedCategory.title}</h2>
                <p className="text-lg text-zinc-600">{selectedCategory.description}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center">
              <div className="text-zinc-500">Загрузка статей...</div>
            </div>
          ) : articles.length === 0 ? (
            <div className="py-8 text-center">
              <div className="text-zinc-500">В этой категории пока нет статей</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="relative p-6 overflow-hidden transition-all duration-300 bg-white border shadow-sm cursor-pointer group rounded-3xl border-zinc-200 hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-300 hover:-translate-y-1"
                >
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-16 h-16 transition-transform duration-500 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-sky-500/10 to-blue-500/10 group-hover:scale-125"></div>
                  
                  <div className="relative flex flex-col h-full space-y-4">
                    {/* Header with type badge */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1.5 text-xs font-semibold tracking-wider text-sky-700 uppercase rounded-full bg-gradient-to-r from-sky-100 to-blue-100 border border-sky-200">
                        {article.type}
                      </span>
                      <div className="w-2 h-2 rounded-full shadow-sm bg-gradient-to-r from-sky-500 to-blue-500"></div>
                    </div>
                    
                    {/* Title section */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold leading-tight transition-colors text-zinc-900 group-hover:text-sky-600 line-clamp-3">{article.title}</h3>
                    </div>
                    
                    {/* Action button */}
                    <div className="pt-2">
                      <div className="flex items-center justify-center w-full px-4 py-3 transition-all duration-200 border border-sky-100 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 group-hover:from-sky-100 group-hover:to-blue-100 group-hover:border-sky-200">
                        <span className="text-sm font-semibold text-sky-600 group-hover:text-sky-700">Читать статью</span>
                        <svg className="w-4 h-4 ml-2 transition-transform text-sky-600 group-hover:text-sky-700 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}