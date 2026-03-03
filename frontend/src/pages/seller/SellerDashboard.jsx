import { useState, useEffect } from 'react'
import StatCard from '../../components/dashboard/StatCard'
import SalesChart from '../../components/dashboard/SalesChart'
import RecentTable from '../../components/dashboard/RecentTable'
import { DollarSign, ShoppingBag, Users, TrendingUp, Link as LinkIcon, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const SellerDashboard = () => {
    const { user } = useAuth()
    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                setLoading(true)
                const res = await fetch(`http://localhost:5000/api/seller/dashboard/${user.id}`)
                if (!res.ok) throw new Error('Failed to fetch dashboard data')
                const data = await res.json()
                setAnalytics(data)
            } catch (err) {
                console.error('Error fetching analytics:', err)
                setError('Could not load dashboard data.')
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [user])

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary)] border-t-transparent"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto block max-h-screen overflow-y-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Dashboard</h1>
                    <p className="text-[var(--color-text-light)]">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
                </div>
                <button className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-lg font-bold shadow-md hover:bg-[var(--color-primary-dark)] transition-colors">
                    + Add New Book
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`฿${analytics?.totalRevenue?.toLocaleString() || 0}`}
                    icon={DollarSign}
                    trend="All Time"
                    trendUp={true}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Orders"
                    value={analytics?.totalOrders || 0}
                    icon={ShoppingBag}
                    trend="Completed"
                    trendUp={true}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Unique Buyers"
                    value={analytics?.newCustomers || 0}
                    icon={Users}
                    trend="Total Readers"
                    trendUp={true}
                    color="bg-purple-500"
                />
                <StatCard
                    title="System Status"
                    value="Active"
                    icon={TrendingUp}
                    trend="Stripe Live"
                    trendUp={true}
                    color="bg-orange-500"
                />
            </div>

            {/* Charts & Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                    <SalesChart data={analytics?.chartData || []} />
                </div>
                <div className="lg:col-span-1">
                    {analytics?.topFan ? (
                        <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 h-full flex flex-col justify-center items-center text-center">
                            <div className="p-4 bg-[var(--color-secondary)]/10 rounded-full mb-4">
                                <Users className="w-10 h-10 text-[var(--color-primary)]" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-[var(--color-text-main)]">Top Fan 🏆</h3>
                            <p className="text-[var(--color-text-main)] font-semibold text-lg">{analytics.topFan.name}</p>
                            <p className="text-[var(--color-text-light)] mb-6 mt-1">Has purchased {analytics.topFan.count} of your books!</p>
                            <div className="inline-block px-4 py-2 bg-[var(--color-secondary)]/10 text-[var(--color-text-light)] rounded-lg text-sm font-medium">
                                Keep it up!
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 h-full flex flex-col justify-center items-center text-center">
                            <div className="p-4 bg-[var(--color-secondary)]/10 rounded-full mb-4 opacity-50">
                                <Users className="w-10 h-10 text-[var(--color-text-light)]" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-[var(--color-text-main)]">No Fans Yet</h3>
                            <p className="text-[var(--color-text-light)] mb-4">You have not completed any sales yet. Promote your books to get your first fan!</p>
                        </div>
                    )}
                </div>
            </div>

            <RecentTable orders={analytics?.recentOrders || []} />
        </div>
    )
}
export default SellerDashboard
