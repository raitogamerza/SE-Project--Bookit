import { ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import BookCard from '../../components/books/BookCard'

const Home = () => {
    const featuredBooks = [
        { id: 1, title: 'Sakura Memories', author: 'Sayuri Tanaka', price: 259, rating: 4.8, isNew: true, cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800' },
        { id: 2, title: 'The Anime Artist', author: 'Kenji Sato', price: 320, rating: 4.6, isNew: true, cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800' },
        { id: 3, title: 'Coffee & Cats', author: 'Yuki Amano', price: 199, rating: 4.9, isNew: false, cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800' },
        { id: 4, title: 'Cosmic Dreams', author: 'Dr. H. Star', price: 380, rating: 4.5, isNew: false, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800' },
    ]

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
                    <div className="relative max-w-xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search books, authors..."
                            className="w-full px-8 py-4 rounded-full text-[var(--color-text-main)] bg-[var(--color-background)] shadow-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/50 transition-all font-medium"
                        />
                        <button className="absolute right-2 top-2 bg-[var(--color-primary)] text-[var(--color-text-inverse)] px-6 py-2 rounded-full font-bold hover:bg-[var(--color-primary-dark)] transition-colors">
                            Search
                        </button>
                    </div>
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {featuredBooks.map(book => (
                        <BookCard key={book.id} {...book} />
                    ))}
                </div>
            </section>

            {/* Staff Picks / Recommended */}
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {featuredBooks.reverse().map(book => (
                        <BookCard key={`pop-${book.id}`} {...book} />
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Home
