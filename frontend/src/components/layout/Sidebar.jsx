import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Book, DollarSign, Settings, LogOut, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/seller/login')
        } catch (error) {
            console.error("Logout failed", error)
        }
    }

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/seller' },
        { icon: Book, label: 'My Books', path: '/seller/books' },
        { icon: Plus, label: 'Add Book', path: '/seller/add-book' },
        { icon: DollarSign, label: 'Earnings', path: '/seller/earnings' },
        { icon: Settings, label: 'Settings', path: '/seller/settings' },
    ]

    return (
        <aside className="w-64 bg-[var(--color-surface)] border-r border-[var(--color-secondary)]/20 hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16">
            <div className="p-6">
                <h2 className="text-xs font-bold text-[var(--color-text-light)] uppercase tracking-wider mb-4">Seller Menu</h2>
                <nav className="space-y-2">
                    {menuItems.map(item => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                    ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-md'
                                    : 'text-[var(--color-text-light)] hover:bg-[var(--color-secondary)]/10 hover:text-[var(--color-primary)]'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-[var(--color-secondary)]/20">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-medium">
                    <LogOut className="w-5 h-5" />
                    Log Out
                </button>
            </div>
        </aside>
    )
}
export default Sidebar
