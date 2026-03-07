import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Search, Book, Edit } from 'lucide-react'

const ManageBooks = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchBooks()
    }, [])

    const fetchBooks = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/books`)
            if (!response.ok) throw new Error('Failed to fetch books')
            const data = await response.json()
            setBooks(data)
        } catch (error) {
            console.error("Error fetching books:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteBook = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book? This will also delete all associated files.')) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/books/${id}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete book')

            alert('Book deleted successfully')
            fetchBooks()
        } catch (error) {
            console.error("Delete error:", error)
            alert("Failed to delete book.")
        }
    }

    const filteredBooks = books.filter(b =>
        (b.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (b.author?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (b.users?.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-primary)] flex items-center gap-2">
                        <Book className="w-6 h-6" /> Manage Books
                    </h1>
                    <p className="text-[var(--color-text-light)] text-sm mt-1">View and manage all books published on the platform.</p>
                </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-secondary)]/20 overflow-hidden">
                <div className="p-6 border-b border-[var(--color-secondary)]/20 flex justify-between items-center bg-[var(--color-surface)]">
                    <div className="relative w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]" />
                        <input
                            type="text"
                            placeholder="Search by title, author, or seller..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-[var(--color-secondary)]/20 rounded-lg text-sm bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto bg-[var(--color-surface)]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-background)] py-4 text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider">
                                <th className="p-4 border-b border-[var(--color-secondary)]/10">Book Title & Author</th>
                                <th className="p-4 border-b border-[var(--color-secondary)]/10">Seller</th>
                                <th className="p-4 border-b border-[var(--color-secondary)]/10 text-center">Price</th>
                                <th className="p-4 border-b border-[var(--color-secondary)]/10">Date Added</th>
                                <th className="p-4 border-b border-[var(--color-secondary)]/10 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-secondary)]/5">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading books...</td></tr>
                            ) : filteredBooks.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No books found.</td></tr>
                            ) : filteredBooks.map((b) => (
                                <tr key={b.id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {b.cover_url ? (
                                                <img src={b.cover_url} alt={b.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                                            ) : (
                                                <div className="w-10 h-14 bg-gray-200 rounded shadow-sm flex items-center justify-center">
                                                    <Book className="w-4 h-4 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-[var(--color-text-main)] text-sm">{b.title}</p>
                                                <p className="text-xs text-[var(--color-text-light)]">By {b.author}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-[var(--color-text-main)] text-sm">{b.users?.full_name || 'Unknown'}</p>
                                        <p className="text-xs text-[var(--color-text-light)]">{b.users?.email}</p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="font-bold text-[var(--color-primary-dark)]">฿{b.price}</span>
                                    </td>
                                    <td className="p-4 text-sm text-[var(--color-text-light)]">
                                        {new Date(b.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <Link
                                            to={`/admin/edit-book/${b.id}`}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Book"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteBook(b.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Book"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ManageBooks
