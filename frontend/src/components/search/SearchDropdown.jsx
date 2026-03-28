import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, BookOpen, Loader2 } from 'lucide-react'
import { supabase } from '../../services/supabase'

const SearchDropdown = ({ variant = 'navbar', placeholder = 'Search books, authors...', onResultClick }) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const wrapperRef = useRef(null)
    const inputRef = useRef(null)
    const debounceRef = useRef(null)
    const navigate = useNavigate()

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (query.trim().length < 2) {
            setResults([])
            setIsOpen(false)
            return
        }

        setLoading(true)
        debounceRef.current = setTimeout(async () => {
            try {
                const { data, error } = await supabase
                    .from('books')
                    .select('id, title, author, genre, cover_url, price')
                    .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
                    .order('created_at', { ascending: false })
                    .limit(6)

                if (error) throw error
                setResults(data || [])
                setIsOpen(true)
            } catch (err) {
                console.error('Search error:', err)
                setResults([])
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [query])

    const handleSelect = (book) => {
        setQuery('')
        setResults([])
        setIsOpen(false)
        if (onResultClick) onResultClick()
        navigate(`/book/${book.id}`)
    }

    const clearSearch = () => {
        setQuery('')
        setResults([])
        setIsOpen(false)
        inputRef.current?.focus()
    }

    const isHero = variant === 'hero'

    return (
        <div ref={wrapperRef} className="relative w-full">
            {/* Input */}
            <div className="relative">
                <Search className={`absolute ${isHero ? 'left-6 top-4' : 'left-3 top-2.5'} h-5 w-5 text-[var(--color-text-light)] pointer-events-none`} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (results.length > 0) setIsOpen(true) }}
                    placeholder={placeholder}
                    className={
                        isHero
                            ? 'w-full pl-14 pr-12 py-4 rounded-full text-[var(--color-text-main)] bg-[var(--color-background)] shadow-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/50 transition-all font-medium'
                            : 'w-full pl-10 pr-10 py-2 rounded-full border border-[var(--color-secondary)] bg-[var(--color-surface)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all'
                    }
                />
                {/* Clear / Loading indicator */}
                {loading ? (
                    <Loader2 className={`absolute ${isHero ? 'right-6 top-4' : 'right-3 top-2.5'} h-5 w-5 text-[var(--color-text-light)] animate-spin`} />
                ) : query.length > 0 && (
                    <button onClick={clearSearch} className={`absolute ${isHero ? 'right-6 top-4' : 'right-3 top-2.5'} h-5 w-5 text-[var(--color-text-light)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer`}>
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className={`absolute z-50 mt-2 w-full bg-[var(--color-surface)] border border-[var(--color-secondary)]/30 rounded-2xl shadow-2xl overflow-hidden ${isHero ? 'max-w-xl left-1/2 -translate-x-1/2' : ''}`}
                    style={{ maxHeight: '400px', overflowY: 'auto' }}
                >
                    {results.length > 0 ? (
                        <ul className="py-2">
                            {results.map((book) => (
                                <li key={book.id}>
                                    <button
                                        onClick={() => handleSelect(book)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer text-left"
                                    >
                                        {/* Book Cover */}
                                        <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-secondary)]/20">
                                            {book.cover_url ? (
                                                <img
                                                    src={book.cover_url}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen className="w-5 h-5 text-[var(--color-text-light)]" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Book Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-[var(--color-text-main)] truncate text-sm">
                                                {book.title}
                                            </p>
                                            <p className="text-xs text-[var(--color-text-light)] truncate">
                                                {book.author}
                                            </p>
                                            {book.genre && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {book.genre.split(',').slice(0, 2).map((g, i) => (
                                                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium">
                                                            {g.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <span className="text-sm font-bold text-[var(--color-primary)] flex-shrink-0">
                                            ฿{book.price}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-8 text-center text-[var(--color-text-light)]">
                            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No books found for "{query}"</p>
                        </div>
                    )}

                    {/* View All Results Footer */}
                    {results.length > 0 && (
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                setQuery('')
                                navigate('/explore')
                            }}
                            className="w-full py-3 text-center text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-colors border-t border-[var(--color-secondary)]/20 cursor-pointer"
                        >
                            View all results →
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchDropdown
