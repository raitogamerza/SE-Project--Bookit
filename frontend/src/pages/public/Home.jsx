import { useState, useEffect } from 'react'
import { ArrowRight, Star } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import BookCard from '../../components/books/BookCard'
import { supabase } from '../../services/supabase'

const Home = () => {
    const [newArrivals, setNewArrivals] = useState([])
    const [popularBooks, setPopularBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchHomeBooks = async () => {
            try {
                // Fetch top 8 newest books
                const { data, error } = await supabase
                    .from('books')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(8)

                if (error) throw error

                // Process books
                const processedBooks = data.map((book, index) => {
                    const createdAt = new Date(book.created_at)
                    const now = new Date()
                    const diffTime = Math.abs(now - createdAt)
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    const isNew = diffDays <= 1

                    return {
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        price: book.price,
                        rating: (Math.random() * (5 - 4) + 4).toFixed(1), // Mock rating
                        isNew: isNew,
                        category: book.genre,
                        cover: book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'
                    }
                })

                // Split into New Arrivals (first 4) and Popular (next 4)
                setNewArrivals(processedBooks.slice(0, 4))
                setPopularBooks(processedBooks.slice(4, 8))
            } catch (error) {
                console.error('Error fetching home books:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchHomeBooks()
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            // Can pass search term via state or query params if needed
            // For now, just navigate to explore
            navigate('/explore')
        }
    }

    return (
        <div className="space-y-16 pb-12">
            {/* Hero Section */}
            <section className="relative rounded-3xl overflow-hidden min-h-[500px] flex items-center justify-center text-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop"
                        alt="Library Background"
                        className="w-full h-full object-cover brightness-[0.6]"
                    />
                </div>
                <div className="relative z-10 p-8 max-w-3xl mx-auto text-[var(--color-text-inverse)]">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
                        Welcome to <span className="text-[var(--color-secondary)]">Bookit</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 font-light text-gray-200">
                        An online bookstore with an anime style. Discover stories that are right for you.
                    </p>
                    <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search books, authors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-8 py-4 rounded-full text-[var(--color-text-main)] bg-[var(--color-background)] shadow-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/50 transition-all font-medium"
                        />
                        <button type="submit" className="absolute right-2 top-2 bg-[var(--color-primary)] text-[var(--color-text-inverse)] px-6 py-2 rounded-full font-bold hover:bg-[var(--color-primary-dark)] transition-colors">
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* New Arrivals */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                            <span className="text-[var(--color-primary)]">📚</span> New Arrivals
                        </h2>
                        <p className="text-[var(--color-text-light)] mt-1">Fresh stories you shouldn't miss</p>
                    </div>
                    <Link to="/explore" className="flex items-center gap-1 text-[var(--color-primary)] hover:underline font-medium">
                        View All <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : newArrivals.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {newArrivals.map(book => (
                            <BookCard key={book.id} {...book} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-[var(--color-text-light)] py-8">No new arrivals available right now.</p>
                )}
            </section>

            {/* Staff Picks / Popular */}
            <section className="bg-[var(--color-secondary)]/10 -mx-4 px-4 py-16 md:rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                            <span className="text-yellow-500">🔥</span> Popular
                        </h2>
                        <p className="text-[var(--color-text-light)] mt-1">Books that everyone loves</p>
                    </div>
                    <Link to="/explore" className="flex items-center gap-1 text-[var(--color-primary)] hover:underline font-medium">
                        View All <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : popularBooks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {popularBooks.map(book => (
                            <BookCard key={`pop-${book.id}`} {...book} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-[var(--color-text-light)] py-8">No popular books available right now.</p>
                )}
            </section>
        </div>
    )
}

export default Home
