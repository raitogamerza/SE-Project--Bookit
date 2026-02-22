import { useState, useEffect } from 'react'
import { BookOpen, Clock, MoreVertical, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'

const MyLibrary = () => {
    const { user } = useAuth()
    const [myBooks, setMyBooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPurchasedBooks = async () => {
            if (!user) {
                setLoading(false)
                return
            }

            try {
                // Fetch completed orders for this user
                // We join the books table to get the book details
                const { data: ordersData, error: ordersError } = await supabase
                    .from('orders')
                    .select(`
                        id,
                        created_at,
                        status,
                        books:book_id (
                            id,
                            title,
                            author,
                            cover_url
                        )
                    `)
                    .eq('user_id', user.id)
                    .eq('status', 'completed')
                    .order('created_at', { ascending: false })

                if (ordersError) throw ordersError

                // Format the data to match the UI expectations
                const formattedBooks = ordersData
                    .filter(order => order.books) // Ensure the book exists
                    .map(order => {
                        const book = Array.isArray(order.books) ? order.books[0] : order.books

                        // Calculate a mock "last read" based on order date for now
                        const orderDate = new Date(order.created_at)
                        const now = new Date()
                        const diffTime = Math.abs(now - orderDate)
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                        let lastReadStr = 'Recently'
                        if (diffDays === 1) lastReadStr = 'Yesterday'
                        else if (diffDays > 1) lastReadStr = `${diffDays} days ago`

                        return {
                            id: book.id,
                            title: book.title,
                            author: book.author,
                            cover: book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
                            progress: 0, // Mock progress, could be added to DB later
                            lastRead: lastReadStr
                        }
                    })

                // Deduplicate books in case of multiple orders for the same book
                const uniqueBooksObj = {}
                formattedBooks.forEach(book => {
                    if (!uniqueBooksObj[book.id]) {
                        uniqueBooksObj[book.id] = book
                    }
                })

                setMyBooks(Object.values(uniqueBooksObj))
            } catch (error) {
                console.error("Error fetching library:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPurchasedBooks()
    }, [user])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="text-center py-20 bg-[var(--color-secondary)]/5 rounded-3xl">
                <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Please login to view your library</h3>
                <Link to="/login" className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-full font-bold hover:bg-[var(--color-primary-dark)] transition-colors inline-block mt-4">
                    Login
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-main)]">My Library</h1>
                    <p className="text-[var(--color-text-light)]">Continue your reading journey</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-lg font-medium">All Books</button>
                </div>
            </div>

            {myBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myBooks.map(book => (
                        <div key={book.id} className="bg-[var(--color-surface)] p-4 rounded-2xl shadow-sm border border-[var(--color-secondary)]/20 flex gap-4 hover:shadow-md transition-shadow">
                            <div className="w-24 aspect-[2/3] flex-shrink-0 rounded-lg overflow-hidden relative">
                                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-[var(--color-text-main)] line-clamp-1" title={book.title}>{book.title}</h3>
                                    <button className="text-[var(--color-text-light)] hover:text-[var(--color-primary)] shrink-0 pl-2">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-sm text-[var(--color-text-light)] mb-4">{book.author}</p>

                                <div className="mt-auto space-y-3">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-[var(--color-text-light)]">
                                            <span>Progress</span>
                                            <span>{Math.round(book.progress * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-[var(--color-secondary)]/10 rounded-full h-2 overflow-hidden">
                                            <div className="bg-[var(--color-primary)] h-full rounded-full" style={{ width: `${book.progress * 100}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-xs text-[var(--color-text-light)]">
                                            <Clock className="w-3 h-3" />
                                            <span>{book.lastRead}</span>
                                        </div>
                                        <Link to={`/read/${book.id}`} className="px-4 py-2 bg-[var(--color-secondary)]/20 text-[var(--color-primary-dark)] text-sm font-bold rounded-lg hover:bg-[var(--color-secondary)]/30 transition-colors flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" /> Read
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[var(--color-secondary)]/5 rounded-3xl border border-[var(--color-secondary)]/10">
                    <BookOpen className="w-16 h-16 text-[var(--color-secondary)] mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Your library is empty</h3>
                    <p className="text-[var(--color-text-light)] mb-8">Looks like you haven't bought any books yet.</p>
                    <Link to="/explore" className="px-8 py-3 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-full font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg hover:shadow-xl">
                        Explore Books
                    </Link>
                </div>
            )}
        </div>
    )
}

export default MyLibrary
