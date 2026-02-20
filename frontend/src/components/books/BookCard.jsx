import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const BookCard = ({ id, title, author, price, cover, rating, isNew }) => (
    <Link to={`/book/${id}`} className="group relative bg-[var(--color-surface)] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-[var(--color-secondary)]/20 block">
        <div className="aspect-[2/3] overflow-hidden bg-[var(--color-secondary)]/10 relative">
            <img src={cover} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            {isNew && (
                <span className="absolute top-2 left-2 bg-orange-500 text-[var(--color-text-inverse)] text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    New
                </span>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-[var(--color-surface)] text-[var(--color-text-main)] px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                    View Details
                </span>
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-lg text-[var(--color-text-main)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">{title}</h3>
            <p className="text-sm text-[var(--color-text-light)] mb-2">{author}</p>
            <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-primary)]">฿{price}</span>
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{rating}</span>
                </div>
            </div>
        </div>
    </Link>
)

export default BookCard
