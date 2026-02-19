import StatCard from '../../components/dashboard/StatCard'
import SalesChart from '../../components/dashboard/SalesChart'
import RecentTable from '../../components/dashboard/RecentTable'
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const SellerDashboard = () => {
    const { user } = useAuth()

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Dashboard</h1>
                    <p className="text-[var(--color-text-light)]">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
                </div>
                <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-bold shadow-md hover:bg-[var(--color-primary-dark)] transition-colors">
                    + Add New Book
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value="฿45,230" icon={DollarSign} trend="+12.5%" color="bg-green-500" />
                <StatCard title="Total Orders" value="156" icon={ShoppingBag} trend="+8.2%" color="bg-blue-500" />
                <StatCard title="New Customers" value="48" icon={Users} trend="+5.1%" color="bg-purple-500" />
                <StatCard title="Avg. Rating" value="4.8" icon={TrendingUp} trend="+0.2%" color="bg-orange-500" />
            </div>

            {/* Charts & Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SalesChart />
                </div>
                <div className="lg:col-span-1">
                    {/* Can add another chart or small widget here */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/20 h-full flex flex-col justify-center items-center text-center">
                        <div className="p-4 bg-[var(--color-secondary)]/20 rounded-full mb-4">
                            <Users className="w-8 h-8 text-[var(--color-primary)]" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Top Fan</h3>
                        <p className="text-[var(--color-text-light)] mb-4">Alice Wonder has bought 5 of your books!</p>
                        <button className="text-[var(--color-primary)] font-medium hover:underline">View Profile</button>
                    </div>
                </div>
            </div>

            <RecentTable />
        </div>
    )
}
export default SellerDashboard
