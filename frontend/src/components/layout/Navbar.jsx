import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, LogOut, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import CartDrawer from '../payment/CartDrawer'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { cart, setIsCartOpen } = useCart()
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Check system preference on load
    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true)
            document.documentElement.classList.add('dark')
        } else {
            setIsDarkMode(false)
            document.documentElement.classList.remove('dark')
        }
    }, [])

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark')
            localStorage.theme = 'light'
            setIsDarkMode(false)
        } else {
            document.documentElement.classList.add('dark')
            localStorage.theme = 'dark'
            setIsDarkMode(true)
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/')
        } catch (error) {
            console.error("Failed to log out", error)
        }
    }

    return (
        <>
            <nav className="sticky top-0 z-40 bg-[var(--color-background)]/90 backdrop-blur-md border-b border-[var(--color-secondary)]/30 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-[var(--color-primary-dark)]">
                        <span className="text-3xl">📖</span>
                        <span>Bookit</span>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
                        <input
                            type="text"
                            placeholder="Search books, authors..."
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-[var(--color-secondary)] bg-[var(--color-surface)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-[var(--color-text-light)]" />
                    </div>

                    {/* Desktop Menu Icons */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="hover:text-[var(--color-primary)] transition-colors font-medium">Home</Link>
                        <Link to="/explore" className="hover:text-[var(--color-primary)] transition-colors font-medium">Explore</Link>
                        <Link to="/my-library" className="hover:text-[var(--color-primary)] transition-colors font-medium">My Library</Link>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative ml-2 p-2 hover:bg-[var(--color-secondary)]/20 rounded-full transition-colors cursor-pointer"
                        >
                            <ShoppingCart className="h-6 w-6 text-[var(--color-text-main)]" />
                            {cart.length > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-[var(--color-text-inverse)] text-xs rounded-full flex items-center justify-center font-bold">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2 text-[var(--color-text-main)] hover:text-[var(--color-primary)] hover:bg-[var(--color-secondary)]/10 rounded-full transition-colors hidden md:block"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center overflow-hidden border border-[var(--color-primary)]/20">
                                        {user.user_metadata?.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sm font-bold text-[var(--color-primary)]">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-[var(--color-primary)] hidden sm:block">
                                        {user.user_metadata?.full_name || user.email.split('@')[0]}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    title="Logout"
                                    className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-full hover:bg-[var(--color-primary-dark)] transition-colors shadow-md hover:shadow-lg font-bold">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button  */}
                    <button className="md:hidden p-2 ml-4 flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-secondary)]/10 rounded-full transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-[var(--color-background)] border-[var(--color-secondary)]/30 border-t border-b overflow-hidden shadow-xl">
                        <div className="flex flex-col p-4 space-y-2">
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)] bg-[var(--color-surface)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                                <Search className="absolute left-3 top-3.5 h-5 w-5 text-[var(--color-text-light)]" />
                            </div>

                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 rounded-xl font-medium text-[var(--color-text-main)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-colors">Home</Link>
                            <Link to="/explore" onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 rounded-xl font-medium text-[var(--color-text-main)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-colors">Explore</Link>
                            <Link to="/my-library" onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 rounded-xl font-medium text-[var(--color-text-main)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-colors">My Library</Link>

                            {/* Mobile only elements inside dropdown */}
                            <div className="border-t border-[var(--color-secondary)]/20 pt-2 mt-2">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false)
                                        setIsCartOpen(true)
                                    }}
                                    className="flex items-center gap-3 py-3 px-4 w-full text-left rounded-xl font-medium text-[var(--color-text-main)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-colors"
                                >
                                    <ShoppingCart className="h-5 w-5" /> Cart ({cart.length})
                                </button>
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-3 py-3 px-4 w-full text-left rounded-xl font-medium text-[var(--color-text-main)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-colors"
                                >
                                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                </button>
                            </div>

                            {user ? (
                                <div className="border-t border-[var(--color-secondary)]/20 pt-2 mt-2">
                                    <div className="py-3 px-4 text-[var(--color-primary)] font-bold">
                                        Hi, {user.email.split('@')[0]}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-center py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t border-[var(--color-secondary)]/20 pt-4 mt-2">
                                    <Link onClick={() => setIsMenuOpen(false)} to="/login" className="block w-full text-center py-3 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-xl font-bold shadow-md">Login</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            <CartDrawer />
        </>
    )
}
export default Navbar
