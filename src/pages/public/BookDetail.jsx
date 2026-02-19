import { useParams } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Share2, BookOpen } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const BookDetail = () => {
    const { id } = useParams()
    const { addToCart } = useCart()

    // Mock data
    const book = {
        id: parseInt(id) || 1, // Ensure ID is consistent
        title: 'Sakura Memories',
        author: 'Sayuri Tanaka',
        price: 259,
        rating: 4.8,
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
        description: 'In a world where memories can be extracted and sold, a young girl discovers a hidden shop that sells forgotten moments. When she stumbles upon a vial labeled "Sakura," she uncovers a past she never knew she had. A heartwarming and mysterious tale about love, loss, and the beauty of remembering.',
        genres: ['Romance', 'Mystery', 'Slice of Life'],
        pages: 320,
        language: 'Thai',
        publisher: 'Bookit Original'
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-secondary)]/20">
                {/* Cover Image */}
                <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl relative group">
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                        <Heart className="text-[var(--color-primary)] fill-transparent hover:fill-[var(--color-primary)] transition-colors cursor-pointer" />
                    </div>
                </div>

                {/* Info */}
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider">Best Seller</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[var(--color-text-main)] font-serif">{book.title}</h1>
                        <p className="text-xl text-[var(--color-text-light)] font-medium">by <span className="text-[var(--color-primary)] underline decoration-dotted">{book.author}</span></p>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-3 py-1 rounded-lg">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="font-bold text-lg">{book.rating}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--color-text-light)]">
                            <BookOpen className="w-5 h-5" />
                            <span>{book.pages} Pages</span>
                        </div>
                        <div className="text-[var(--color-text-light)] px-3 py-1 bg-gray-100 rounded-lg">
                            {book.language}
                        </div>
                    </div>

                    <div className="prose prose-lg text-[var(--color-text-main)]/80 leading-relaxed">
                        <p>{book.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {book.genres.map(g => (
                            <span key={g} className="px-4 py-2 bg-[var(--color-secondary)]/20 text-[var(--color-primary-dark)] rounded-xl text-sm font-medium hover:bg-[var(--color-secondary)]/30 transition-colors cursor-pointer">
                                #{g}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pt-8 border-t border-[var(--color-secondary)]/20">
                        <div className="flex flex-col">
                            <span className="text-sm text-[var(--color-text-light)] line-through">฿{book.price + 50}</span>
                            <span className="text-5xl font-bold text-[var(--color-primary)]">฿{book.price}</span>
                        </div>
                        <div className="flex-1"></div>
                        <button className="p-4 border-2 border-[var(--color-secondary)] rounded-2xl hover:bg-[var(--color-secondary)]/10 transition-colors">
                            <Share2 className="text-[var(--color-text-light)]" />
                        </button>
                        <button
                            onClick={() => addToCart(book)}
                            className="px-10 py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold hover:bg-[var(--color-primary-dark)] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 text-lg"
                        >
                            <ShoppingCart className="w-6 h-6" /> Add to Cart
                        </button>
                        <button className="px-10 py-4 bg-[var(--color-secondary)] text-[var(--color-primary-dark)] rounded-2xl font-bold hover:bg-[#cbb08d] transition-colors">
                            Sample
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default BookDetail
