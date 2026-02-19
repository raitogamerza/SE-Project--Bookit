import { useState } from 'react'
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BookCard from '../../components/books/BookCard'

const Explore = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    const [showFilters, setShowFilters] = useState(true)

    // Mock Data (Expanded)
    const allBooks = [
        { id: 1, title: 'Sakura Memories', author: 'Sayuri Tanaka', price: 259, rating: 4.8, isNew: true, category: 'Romance', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800' },
        { id: 2, title: 'The Anime Artist', author: 'Kenji Sato', price: 320, rating: 4.6, isNew: true, category: 'Art', cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800' },
        { id: 3, title: 'Coffee & Cats', author: 'Yuki Amano', price: 199, rating: 4.9, isNew: false, category: 'Slice of Life', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800' },
        { id: 4, title: 'Cosmic Dreams', author: 'Dr. H. Star', price: 380, rating: 4.5, isNew: false, category: 'Sci-Fi', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800' },
        { id: 5, title: 'Love at Sunset', author: 'Haruto Ito', price: 229, rating: 4.7, isNew: true, category: 'Romance', cover: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=2000&auto=format&fit=crop' },
        { id: 6, title: 'Mystery of Kyoto', author: 'Renji K.', price: 290, rating: 4.4, isNew: false, category: 'Mystery', cover: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=2000&auto=format&fit=crop' },
    ]

    const categories = ['All', 'Romance', 'Fantasy', 'Sci-Fi', 'Slice of Life', 'Mystery', 'Art']

    const filteredBooks = allBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = activeCategory === 'All' || book.category === activeCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-8">
            {/* Header & Search */}
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-[var(--color-text-main)]">Explore Books</h1>
                <p className="text-[var(--color-text-light)]">Find stories that resonate with you.</p>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-[var(--color-text-light)]" />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-6 py-3 border rounded-xl font-medium transition-colors ${showFilters
                                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                                : 'bg-[var(--color-background)] border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10'
                            }`}
                    >
                        {showFilters ? <X className="h-5 w-5" /> : <SlidersHorizontal className="h-5 w-5" />}
                        {showFilters ? 'Close' : 'Filters'}
                    </button>
                </div>
            </div>

            {/* Categories */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="flex overflow-x-auto gap-2 py-2 no-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${activeCategory === cat
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--color-secondary)]/10 text-[var(--color-text-main)] hover:bg-[var(--color-secondary)]/20'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Info */}
            <div className="text-sm text-[var(--color-text-light)]">
                Found {filteredBooks.length} books
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map(book => (
                        <BookCard key={book.id} {...book} />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-[var(--color-text-light)]">
                        <p className="text-lg">No books found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Explore
