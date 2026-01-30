import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Plus,
  X,
  BookMarked,
  BookCheck,
  Trash2,
  ChevronDown,
  Search,
  Layers,
  ExternalLink,
} from 'lucide-react'
import { useOperativeStore, type Book } from '../store/useOperativeStore'

const statusConfig = {
  'to-read': {
    label: 'To Read',
    icon: BookOpen,
    color: 'text-slate-400',
    bg: 'bg-slate-800',
    border: 'border-slate-700',
  },
  reading: {
    label: 'Reading',
    icon: BookMarked,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  analysed: {
    label: 'Analysed',
    icon: BookCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
}

// Book categories for organization
const bookCategories: Record<string, { title: string; color: string; books: string[] }> = {
  core: {
    title: 'Core Philosophy',
    color: 'text-emerald-500',
    books: ['1', '2'],
  },
  psychology: {
    title: 'Psychology & Manipulation',
    color: 'text-blue-500',
    books: ['3', '4', '5', '6', '7', '8', '9'],
  },
  tradecraft: {
    title: 'Tradecraft & Tactical Skills',
    color: 'text-red-500',
    books: ['10', '11', '12', '13'],
  },
  strategy: {
    title: 'Strategy & Decision Making',
    color: 'text-purple-500',
    books: ['14', '15', '16', '17'],
  },
  business: {
    title: 'Business & Economics',
    color: 'text-amber-500',
    books: ['18', '19', '20', '21'],
  },
  stoicism: {
    title: 'Stoicism & Philosophy',
    color: 'text-cyan-500',
    books: ['22', '23', '24', '25'],
  },
  combat: {
    title: 'Combat & Physical',
    color: 'text-pink-500',
    books: ['26', '27', '28'],
  },
  intelligence: {
    title: 'Intelligence & Operations',
    color: 'text-indigo-500',
    books: ['29', '30', '31'],
  },
  performance: {
    title: 'Psychology of Performance',
    color: 'text-yellow-500',
    books: ['32', '33', '34'],
  },
  security: {
    title: 'Security & Privacy',
    color: 'text-rose-500',
    books: ['35', '36', '37'],
  },
  practical: {
    title: 'Practical Knowledge',
    color: 'text-teal-500',
    books: ['38', '39', '40'],
  },
}

export function IntelLibrary() {
  const { books, addBook, updateBookStatus, removeBook } = useOperativeStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBook, setNewBook] = useState({ title: '', author: '' })
  const [filter, setFilter] = useState<Book['status'] | 'all'>('all')
  const [viewMode, setViewMode] = useState<'categories' | 'list'>('categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.keys(bookCategories).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  )

  const handleAddBook = () => {
    if (newBook.title.trim() && newBook.author.trim()) {
      addBook({ ...newBook, status: 'to-read' })
      setNewBook({ title: '', author: '' })
      setShowAddForm(false)
    }
  }

  const filteredBooks = filter === 'all' 
    ? books 
    : books.filter((book) => book.status === filter)

  const searchedBooks = filteredBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: books.length,
    toRead: books.filter((b) => b.status === 'to-read').length,
    reading: books.filter((b) => b.status === 'reading').length,
    analysed: books.filter((b) => b.status === 'analysed').length,
  }

  const toggleCategory = (catKey: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
    }))
  }

  return (
    <div className="w-full space-y-4 pb-4">
      {/* Stats - Horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2" role="group" aria-label="Book statistics">
        {[
          { label: 'Total', value: stats.total, color: 'text-white', bg: 'bg-slate-700' },
          { label: 'To Read', value: stats.toRead, color: 'text-slate-400', bg: 'bg-slate-700' },
          { label: 'Reading', value: stats.reading, color: 'text-amber-400', bg: 'bg-amber-500/20' },
          { label: 'Done', value: stats.analysed, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
        ].map((stat) => (
          <div key={stat.label} className="card-elevated min-w-[80px] p-3 text-center">
            <div className={`text-lg font-display ${stat.color} tabular-nums`}>{stat.value}</div>
            <div className="text-[10px] text-slate-500 font-sans">{stat.label}</div>
          </div>
        ))}
        <button
          onClick={() => setShowAddForm(true)}
          className="tap-highlight card-elevated min-w-[80px] p-3 flex flex-col items-center justify-center"
          aria-label="Add new book"
        >
          <Plus className="w-5 h-5 text-emerald-500 mb-1" aria-hidden="true" />
          <span className="text-[10px] text-slate-400 font-sans">Add</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
        <label className="sr-only" htmlFor="book-search">Search books</label>
        <input
          id="book-search"
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 text-sm font-sans"
        />
      </div>

      {/* View Mode & Filters - Combined row */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1" role="group" aria-label="View and filter options">
        <button
          onClick={() => setViewMode('categories')}
          aria-pressed={viewMode === 'categories'}
          className={`tap-highlight flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium font-sans whitespace-nowrap transition-all ${
            viewMode === 'categories' ? 'bg-slate-700 text-white' : 'bg-slate-800/60 text-slate-500'
          }`}
        >
          <Layers className="w-3 h-3" aria-hidden="true" />
          Categories
        </button>
        <button
          onClick={() => setViewMode('list')}
          aria-pressed={viewMode === 'list'}
          className={`tap-highlight flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium font-sans whitespace-nowrap transition-all ${
            viewMode === 'list' ? 'bg-slate-700 text-white' : 'bg-slate-800/60 text-slate-500'
          }`}
        >
          <BookOpen className="w-3 h-3" aria-hidden="true" />
          List
        </button>
        <div className="w-px bg-slate-700 mx-1" aria-hidden="true" />
        {(['all', 'to-read', 'reading', 'analysed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            aria-pressed={filter === status}
            className={`tap-highlight px-3 py-1.5 rounded-full text-[11px] font-medium font-sans whitespace-nowrap transition-all ${
              filter === status ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/60 text-slate-500'
            }`}
          >
            {status === 'all' ? 'All' : statusConfig[status].label}
          </button>
        ))}
      </div>

      {/* Books View */}
      <div className="space-y-3" role="region" aria-label="Book collection">
        {viewMode === 'categories' ? (
          // Category View
          <div className="space-y-2.5">
            {Object.entries(bookCategories).map(([key, category]) => {
              const categoryBooks = searchedBooks.filter((book) =>
                category.books.includes(book.id)
              )
              const isExpanded = expandedCategories[key]

              if (categoryBooks.length === 0) return null

              return (
                <motion.section
                  key={key}
                  className="card-elevated overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  aria-labelledby={`category-${key}`}
                >
                  <button
                    onClick={() => toggleCategory(key)}
                    className="w-full tap-highlight px-4 py-3 flex items-center justify-between"
                    aria-expanded={isExpanded}
                    aria-controls={`books-${key}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform flex-shrink-0 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                      <h3 id={`category-${key}`} className={`text-sm font-display tracking-wide ${category.color} truncate`}>
                        {category.title}
                      </h3>
                      <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-full flex-shrink-0 font-mono tabular-nums">
                        {categoryBooks.length}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        id={`books-${key}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-700/50"
                      >
                        <div className="px-3 py-2 space-y-1.5" role="list">
                          {categoryBooks.map((book) => {
                            const config = statusConfig[book.status]
                            const Icon = config.icon

                            return (
                              <div
                                key={book.id}
                                className={`flex items-center gap-2 p-2.5 rounded-lg border ${config.border} ${config.bg}`}
                                role="listitem"
                              >
                                <Icon className={`w-4 h-4 flex-shrink-0 ${config.color}`} aria-hidden="true" />
                                <div className="flex-1 min-w-0">
                                  {book.url ? (
                                    <a
                                      href={book.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                                    >
                                      <p className="font-display tracking-wide text-white text-xs truncate group-hover:text-emerald-400">{book.title}</p>
                                      <ExternalLink className="w-3 h-3 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                                    </a>
                                  ) : (
                                    <p className="font-display tracking-wide text-white text-xs truncate">{book.title}</p>
                                  )}
                                  <p className="text-[10px] text-slate-500 truncate font-sans">{book.author}</p>
                                </div>
                                <label className="sr-only" htmlFor={`status-${book.id}`}>Status for {book.title}</label>
                                <select
                                  id={`status-${book.id}`}
                                  value={book.status}
                                  onChange={(e) => updateBookStatus(book.id, e.target.value as Book['status'])}
                                  className="tap-highlight text-[10px] px-1.5 py-1 bg-slate-700 border border-slate-600 rounded text-slate-300"
                                >
                                  <option value="to-read">To Read</option>
                                  <option value="reading">Reading</option>
                                  <option value="analysed">Done</option>
                                </select>
                                <button
                                  onClick={() => removeBook(book.id)}
                                  className="tap-highlight p-1 text-slate-500"
                                  aria-label={`Remove ${book.title}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>
              )
            })}
          </div>
        ) : (
          // List View
          <div className="card-elevated p-3">
            <AnimatePresence>
              <div className="space-y-1.5">
                {searchedBooks.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No books found</p>
                  </div>
                ) : (
                  searchedBooks.map((book) => {
                    const config = statusConfig[book.status]
                    const Icon = config.icon

                    return (
                      <motion.div
                        key={book.id}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border ${config.border} ${config.bg}`}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${config.color}`} />
                        <div className="flex-1 min-w-0">
                          {book.url ? (
                            <a
                              href={book.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                            >
                              <p className="font-medium text-white text-xs truncate group-hover:text-emerald-400">{book.title}</p>
                              <ExternalLink className="w-3 h-3 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                            </a>
                          ) : (
                            <p className="font-medium text-white text-xs truncate">{book.title}</p>
                          )}
                          <p className="text-[10px] text-slate-500 truncate">{book.author}</p>
                        </div>
                        <select
                          value={book.status}
                          onChange={(e) => updateBookStatus(book.id, e.target.value as Book['status'])}
                          className="tap-highlight text-[10px] px-1.5 py-1 bg-slate-700 border border-slate-600 rounded text-slate-300"
                        >
                          <option value="to-read">To Read</option>
                          <option value="reading">Reading</option>
                          <option value="analysed">Done</option>
                        </select>
                        <button
                          onClick={() => removeBook(book.id)}
                          className="tap-highlight p-1 text-slate-500"
                          aria-label={`Remove ${book.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Form Modal - Bottom sheet style */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 right-0 bottom-0 bg-slate-900 rounded-t-3xl border-t border-slate-700 p-4 pb-8 z-50 safe-area-bottom"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-4" />
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Add New Intel</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="tap-highlight p-2 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-500 uppercase mb-1.5">Title</label>
                  <input
                    type="text"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    placeholder="Enter book title"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 text-sm"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 uppercase mb-1.5">Author</label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    placeholder="Enter author name"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="tap-highlight flex-1 px-4 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBook}
                    disabled={!newBook.title.trim() || !newBook.author.trim()}
                    className="tap-highlight flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl font-medium text-sm disabled:opacity-50"
                  >
                    Add to Library
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
