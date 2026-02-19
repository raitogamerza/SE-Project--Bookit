import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-9xl font-bold text-[var(--color-secondary)]">404</h1>
            <h2 className="text-3xl font-bold mb-4 text-[var(--color-text-main)]">Page Not Found</h2>
            <p className="mb-8 text-[var(--color-text-light)]">The story you are looking for does not exist.</p>
            <Link to="/" className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)] transition-colors">
                Go Back Home
            </Link>
        </div>
    )
}
export default NotFound
