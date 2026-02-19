import { Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, ShoppingBag, Settings, LogOut } from 'lucide-react'

const AdminLayout = () => {
    const handleLogout = () => {
        localStorage.removeItem('admin_token')
        window.location.href = '/login' // Redirect to main login, not admin/login which is deprecated
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
                <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">A</div>
                    <span className="text-xl font-bold">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-xl text-blue-400 font-medium">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link to="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-colors">
                        <Users className="w-5 h-5" /> Users
                    </Link>
                    <Link to="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-colors">
                        <BookOpen className="w-5 h-5" /> Books
                    </Link>
                    <Link to="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-colors">
                        <ShoppingBag className="w-5 h-5" /> Orders
                    </Link>
                    <Link to="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-colors">
                        <Settings className="w-5 h-5" /> Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-xl transition-colors w-full">
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
