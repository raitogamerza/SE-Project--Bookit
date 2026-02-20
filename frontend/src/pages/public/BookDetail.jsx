import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Share2, BookOpen, AlertCircle } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { supabase } from '../../services/supabase'

const BookDetail = () => {
    const { id } = useParams()
    const { addToCart } = useCart()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchBookDetail = async () => {
            try {
                const { data, error } = await supabase
                    .from('books')
                    .select('*')
                    .eq('id', id)
                    .single(); // Get a single object instead of an array

                if (error) throw error;

                // Map DB schema to component state structure
                setBook({
                    id: data.id,
                    title: data.title,
                    author: data.author,
                    price: data.price,
                    rating: (Math.random() * (5 - 4) + 4).toFixed(1), // Mock rating
                    cover: data.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
                    description: data.description || 'No description provided.',
                    genres: [data.genre], // Wrapping single genre in array for map
                    pages: Math.floor(Math.random() * (500 - 150) + 150), // Mock pages
                    language: 'English', // Mock 
                    publisher: 'Independent', // Mock
                    demoFileUrl: data.demo_file_url
                });

            } catch (err) {
                console.error("Error fetching book details:", err);
                setError("Could not load book details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBookDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        )
    }

    if (error || !book) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-center p-8">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Oops! Book Not Found</h2>
                <p className="text-[var(--color-text-light)] mb-6">{error || "The book you are looking for doesn't exist or has been removed."}</p>
                <Link to="/explore" className="bg-[var(--color-primary)] text-[var(--color-text-inverse)] px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-dark)] transition-colors">
                    Back to Explore
                </Link>
            </div>
        )
    }

    // Book data is now fetched from Supabase!

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 bg-[var(--color-surface)] p-8 rounded-3xl shadow-sm border border-[var(--color-secondary)]/20">
                {/* Cover Image */}
                <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl relative group">
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 right-4 bg-[var(--color-surface)]/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
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
                        <div className="text-[var(--color-text-light)] px-3 py-1 bg-[var(--color-secondary)]/10 rounded-lg">
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
                            className="px-10 py-4 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-2xl font-bold hover:bg-[var(--color-primary-dark)] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 text-lg"
                        >
                            <ShoppingCart className="w-6 h-6" /> Add to Cart
                        </button>
                        {book.demoFileUrl && (
                            <a
                                href={book.demoFileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-10 py-4 bg-[var(--color-secondary)] text-[var(--color-primary-dark)] rounded-2xl font-bold hover:bg-[#cbb08d] transition-colors inline-block text-center"
                            >
                                Sample
                            </a>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}
export default BookDetail
