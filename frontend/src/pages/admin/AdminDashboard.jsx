import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, DollarSign, Store, Clock, CheckCircle2, XCircle, Search } from 'lucide-react'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'

const AdminDashboard = () => {
    const { user } = useAuth()
    const [stats, setStats] = useState({ users: 0, revenue: 0, sellers: 0, pending: 0 })
    const [withdrawals, setWithdrawals] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token
            const headers = { 'Authorization': `Bearer ${token}` }

            // 1. Fetch Stats
            const statsRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/dashboard`, { headers });
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            // 2. Fetch all withdrawals with seller info
            const withRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/withdrawals`, { headers });
            if (withRes.ok) {
                const withdrawalList = await withRes.json();
                setWithdrawals(withdrawalList);
            }
        } catch (error) {
            console.error("Error fetching admin data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleWithdrawalStatus = async (id, newStatus) => {
        if (!confirm(`Are you sure you want to mark this request as ${newStatus.toUpperCase()}?`)) return;

        try {
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/withdrawals/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error("Failed to update status");

            alert(`Withdrawal marked as ${newStatus}`);
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update status.");
        }
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            <header className="bg-[var(--color-surface)] px-8 py-4 border-b border-[var(--color-secondary)]/20 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                    <Store className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Admin Console</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <span className="block text-sm font-bold text-[var(--color-text-main)]">System Admin</span>
                        <span className="block text-xs text-[var(--color-text-light)]">Bookit Platform</span>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full border-2 border-[var(--color-primary)] shadow-sm overflow-hidden flex items-center justify-center text-[var(--color-primary)] font-bold">
                        A
                    </div>
                </div>
            </header>

            <div className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard label="Total Users" value={stats.users} icon={<Users />} color="blue" />
                    <StatCard label="Platform Sales" value={`฿${stats.revenue.toFixed(2)}`} icon={<DollarSign />} color="green" />
                    <StatCard label="Active Sellers" value={stats.sellers} icon={<Store />} color="orange" />
                    <StatCard label="Pending Payouts" value={stats.pending} icon={<Clock />} color="red" />
                </div>

                <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 overflow-hidden">
                    <div className="p-6 border-b border-[var(--color-secondary)]/10 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-[var(--color-text-main)]">Seller Withdrawal Requests</h2>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]" />
                            <input type="text" placeholder="Search sellers..." className="pl-9 pr-4 py-2 border border-[var(--color-secondary)]/20 rounded-lg text-sm bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--color-background)] py-4 text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider">
                                    <th className="p-4 border-b border-[var(--color-secondary)]/10">Date</th>
                                    <th className="p-4 border-b border-[var(--color-secondary)]/10">Seller</th>
                                    <th className="p-4 border-b border-[var(--color-secondary)]/10">Amount</th>
                                    <th className="p-4 border-b border-[var(--color-secondary)]/10">Status</th>
                                    <th className="p-4 border-b border-[var(--color-secondary)]/10 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-secondary)]/5">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading requests...</td></tr>
                                ) : withdrawals.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">No withdrawal requests found.</td></tr>
                                ) : withdrawals.map((w) => (
                                    <tr key={w.id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                                        <td className="p-4 text-sm text-[var(--color-text-light)]">
                                            {new Date(w.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-[var(--color-text-main)] text-sm">{w.seller?.full_name || 'Unknown Seller'}</p>
                                            <p className="text-xs text-[var(--color-text-light)]">{w.seller?.email}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-bold text-[var(--color-primary-dark)]">฿{w.amount.toFixed(2)}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase
                                                ${w.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                    w.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'}`}>
                                                {w.status === 'pending' && <Clock className="w-3 h-3" />}
                                                {w.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                                                {w.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                {w.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {w.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleWithdrawalStatus(w.id, 'approved')} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-bold transition-colors">
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleWithdrawalStatus(w.id, 'rejected')} className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-bold transition-colors">
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 flex items-center gap-4">
        <div className={`p-4 rounded-xl text-white bg-${color}-500 shadow-md`}>
            <div className="w-6 h-6 *:w-full *:h-full">{icon}</div>
        </div>
        <div>
            <p className="text-[var(--color-text-light)] text-sm font-medium mb-0.5">{label}</p>
            <h3 className="text-2xl font-bold text-[var(--color-text-main)]">{value}</h3>
        </div>
    </div>
)

export default AdminDashboard
