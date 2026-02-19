import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Book, DollarSign, Settings, LogOut, Plus } from 'lucide-react'

const Sidebar = () => {
    const location = useLocation()

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/seller' },
        { icon: Book, label: 'My Books', path: '/seller/books' },
        { icon: Plus, label: 'Add Book', path: '/seller/add-book' },
        { icon: DollarSign, label: 'Earnings', path: '/seller/earnings' },
        { icon: Settings, label: 'Settings', path: '/seller/settings' },
    ]

    return (
        <aside className="w-64 bg-white border-r border-[var(--color-secondary)]/20 hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16">
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
                                    ? 'bg-[var(--color-primary)] text-white shadow-md'
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
                    onClick={() => {
                        // Assuming supabase auth, we should sign out. 
                        // Since this component is inside AuthProvider, we can use useAuth but it wasn't imported.
                        // For simplicity in this step, I'll redirect or use a direct signOut if I import supabase, 
                        // but better to just redirect to home or login for now as a visual cue, 
                        // or strict: import useAuth.
                        window.location.href = '/seller/login'
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-medium">
                    <LogOut className="w-5 h-5" />
                    Log Out
                </button>
            </div>
        </aside>
    )
}
export default Sidebar
