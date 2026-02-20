import { BookOpen, Clock, MoreVertical } from 'lucide-react'
import { Link } from 'react-router-dom'

const MyLibrary = () => {
    // Mock Purchased Books
    const myBooks = [
        { id: 1, title: 'Sakura Memories', author: 'Sayuri Tanaka', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800', progress: 0.6, lastRead: '2 hours ago' },
        { id: 3, title: 'Coffee & Cats', author: 'Yuki Amano', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800', progress: 0.1, lastRead: 'Yesterday' },
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-main)]">My Library</h1>
                    <p className="text-[var(--color-text-light)]">Continue your reading journey</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-lg font-medium">Currently Reading</button>
                    <button className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-secondary)]/30 rounded-lg font-medium hover:bg-[var(--color-secondary)]/10">Finished</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBooks.map(book => (
                    <div key={book.id} className="bg-[var(--color-surface)] p-4 rounded-2xl shadow-sm border border-[var(--color-secondary)]/20 flex gap-4 hover:shadow-md transition-shadow">
                        <div className="w-24 aspect-[2/3] flex-shrink-0 rounded-lg overflow-hidden relative">
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-[var(--color-text-main)] line-clamp-1">{book.title}</h3>
                                <button className="text-[var(--color-text-light)] hover:text-[var(--color-primary)]">
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

            {myBooks.length === 0 && (
                <div className="text-center py-20 bg-[var(--color-secondary)]/5 rounded-3xl">
                    <BookOpen className="w-16 h-16 text-[var(--color-secondary)] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Your library is empty</h3>
                    <p className="text-[var(--color-text-light)] mb-6">Looks like you haven't bought any books yet.</p>
                    <Link to="/explore" className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-full font-bold hover:bg-[var(--color-primary-dark)] transition-colors">
                        Explore Books
                    </Link>
                </div>
            )}
        </div>
    )
}

export default MyLibrary
