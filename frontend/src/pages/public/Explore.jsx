import { useState, useEffect } from 'react'
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BookCard from '../../components/books/BookCard'
import { supabase } from '../../services/supabase'

const Explore = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    const [showFilters, setShowFilters] = useState(true)
    const [allBooks, setAllBooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data, error } = await supabase
                    .from('books')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Process books to add isNew flag and map properties for BookCard
                const processedBooks = data.map(book => {
                    // Check if book was created in the last 24 hours
                    const createdAt = new Date(book.created_at);
                    const now = new Date();
                    const diffTime = Math.abs(now - createdAt);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const isNew = diffDays <= 1;

                    return {
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        price: book.price,
                        rating: (Math.random() * (5 - 4) + 4).toFixed(1), // Mock rating for now (4.0 - 5.0)
                        isNew: isNew,
                        category: book.genre,
                        cover: book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800' // Fallback
                    };
                });

                setAllBooks(processedBooks);
            } catch (error) {
                console.error("Error fetching explore books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

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
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-[var(--color-text-light)]" />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-6 py-3 border rounded-xl font-medium transition-colors ${showFilters
                            ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)] border-[var(--color-primary)]'
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
                                        ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)]'
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
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            ) : (
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
            )}
        </div>
    )
}

export default Explore
