import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, ShoppingBag, Settings, LogOut } from 'lucide-react'

const AdminLayout = () => {
    const location = useLocation()

    const handleLogout = () => {
        localStorage.removeItem('admin_token')
        window.location.href = '/login' // Redirect to main login
    }

    const isActive = (path) => location.pathname === path

    const navLinkClass = (path) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive(path)
        ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-md'
        : 'text-[var(--color-text-light)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-main)]'
        }`

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--color-surface)] border-r border-[var(--color-secondary)]/20 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-[var(--color-secondary)]/20 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-lg flex items-center justify-center font-bold">A</div>
                    <span className="text-xl font-bold text-[var(--color-text-main)]">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link to="/admin/users" className={navLinkClass('/admin/users')}>
                        <Users className="w-5 h-5" /> Users
                    </Link>
                    <Link to="/admin/books" className={navLinkClass('/admin/books')}>
                        <BookOpen className="w-5 h-5" /> Books
                    </Link>
                    <Link to="/admin/withdrawals" className={navLinkClass('/admin/withdrawals')}>
                        <ShoppingBag className="w-5 h-5" /> Withdrawals
                    </Link>
                    <Link to="#" className={navLinkClass('/admin/orders')}>
                        <ShoppingBag className="w-5 h-5" /> Orders
                    </Link>
                    <Link to="#" className={navLinkClass('/admin/settings')}>
                        <Settings className="w-5 h-5" /> Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-[var(--color-secondary)]/20">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors w-full font-medium">
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 overflow-auto bg-[var(--color-background)]">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
