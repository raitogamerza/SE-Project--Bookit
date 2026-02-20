import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, BookOpen, Edit, Trash2, ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

const MyBooks = () => {
    const { user } = useAuth()
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBooks = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('books')
                    .select('*')
                    .eq('seller_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setBooks(data);
            } catch (error) {
                console.error("Error fetching books:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [user]);

    // Simple delete placeholder
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                const { error } = await supabase.from('books').delete().eq('id', id);
                if (error) throw error;
                setBooks(books.filter(b => b.id !== id));
            } catch (error) {
                console.error("Error deleting book:", error.message);
                alert("Failed to delete the book.");
            }
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-main)]">My Books</h1>
                    <p className="text-[var(--color-text-light)] mt-1">Manage your published library</p>
                </div>
                <Link
                    to="/seller/add-book"
                    className="flex items-center gap-2 bg-orange-600 text-[var(--color-text-inverse)] px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors shadow-md font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add New Book
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            ) : books.length === 0 ? (
                <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 p-12 text-center">
                    <BookOpen className="w-16 h-16 text-orange-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">No Books Published Yet</h3>
                    <p className="text-[var(--color-text-light)] mb-6">Start your journey by adding your first masterpiece to the marketplace.</p>
                    <Link
                        to="/seller/add-book"
                        className="inline-flex items-center gap-2 bg-orange-600 text-[var(--color-text-inverse)] px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors shadow-md font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Publish a Book
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {books.map(book => (
                        <div key={book.id} className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border border-[var(--color-secondary)]/10 flex gap-4 hover:shadow-md transition-shadow">
                            <div className="w-24 h-36 flex-shrink-0 bg-[var(--color-secondary)]/10 rounded-lg overflow-hidden border border-[var(--color-secondary)]/20">
                                {book.cover_url ? (
                                    <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--color-text-light)]">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col pt-1">
                                <h3 className="font-bold text-[var(--color-text-main)] line-clamp-2" title={book.title}>{book.title}</h3>
                                <p className="text-sm text-[var(--color-text-light)] mb-2">{book.author}</p>
                                <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium mb-auto self-start">
                                    {book.genre}
                                </span>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className="font-bold text-[var(--color-text-main)]">${parseFloat(book.price).toFixed(2)}</span>

                                    <div className="flex gap-2">
                                        {book.demo_file_url && (
                                            <a
                                                href={book.demo_file_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View PDF"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        <button className="p-2 text-[var(--color-text-light)] hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-not-allowed opacity-50" title="Edit (Coming soon)">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            className="p-2 text-[var(--color-text-light)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyBooks
