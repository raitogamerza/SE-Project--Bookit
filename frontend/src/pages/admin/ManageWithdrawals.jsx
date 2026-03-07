import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, CheckCircle2 } from 'lucide-react'

const ManageWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchWithdrawals()
    }, [])

    const fetchWithdrawals = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/withdrawals`)
            if (res.ok) {
                const data = await res.json()
                setWithdrawals(data)
            }
        } catch (err) {
            console.error('Fetch withdrawals error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id, status) => {
        if (!window.confirm(`Are you sure you want to mark this request as ${status}?`)) return
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/withdrawals/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                alert(`Withdrawal marked as ${status}`)
                fetchWithdrawals()
            } else {
                alert('Failed to update status')
            }
        } catch (err) {
            console.error('Update status error:', err)
            alert('Error updating status')
        }
    }

    if (loading) return <div className="p-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/4"></div><div className="h-64 bg-gray-200 rounded w-full"></div></div></div>

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-[var(--color-text-main)]">Manage Withdrawals</h1>
                <p className="text-[var(--color-text-light)]">Review and process seller payout requests.</p>
            </header>

            <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--color-background)] border-b border-[var(--color-secondary)]/20 text-[var(--color-text-light)]">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-sm">Date</th>
                                <th className="px-6 py-4 font-semibold text-sm">Seller</th>
                                <th className="px-6 py-4 font-semibold text-sm">Bank Details</th>
                                <th className="px-6 py-4 font-semibold text-sm">Amount</th>
                                <th className="px-6 py-4 font-semibold text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-secondary)]/10">
                            {withdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-[var(--color-text-light)]">
                                        No withdrawal requests found.
                                    </td>
                                </tr>
                            ) : (
                                withdrawals.map(w => (
                                    <tr key={w.id} className="hover:bg-[var(--color-background)] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-main)]">
                                            {new Date(w.created_at).toLocaleDateString()}<br />
                                            <span className="text-xs text-[var(--color-text-light)]">{new Date(w.created_at).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-[var(--color-text-main)]">{w.seller?.full_name || 'Unknown'}</div>
                                            <div className="text-xs text-[var(--color-text-light)]">{w.seller?.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-[var(--color-text-main)]">{w.bank_name}</div>
                                            <div className="text-xs text-[var(--color-text-light)] font-mono">{w.account_number}</div>
                                            <div className="text-xs text-[var(--color-text-light)]">{w.account_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-[var(--color-primary-dark)]">
                                            ฿{Number(w.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${w.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                    w.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                                        'bg-green-100 text-green-700 border-green-200'
                                                }`}>
                                                {w.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                                                {w.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                                                {(w.status === 'completed' || w.status === 'approved') && <CheckCircle className="w-3.5 h-3.5" />}
                                                {w.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {w.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(w.id, 'completed')}
                                                        className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                                                        title="Mark as Completed"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(w.id, 'rejected')}
                                                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                                                        title="Reject Request"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ManageWithdrawals
