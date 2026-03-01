import { useState, useEffect } from 'react'
import { Wallet, ArrowUpRight, History, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

const Withdrawals = () => {
    const { user } = useAuth()
    const [balance, setBalance] = useState(0)
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [requesting, setRequesting] = useState(false)
    const [amount, setAmount] = useState('')

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    const fetchData = async () => {
        setLoading(true)
        try {
            // 1. Calculate Available Balance
            // We sum up all 'completed' orders where the seller is the owner of the book,
            // minus any 'approved' or 'pending' withdrawals. For simplicity in this demo,
            // we will calculate total earnings (70% cut) and subtract total requested withdrawals.

            // Get all completed orders for this seller's books
            const { data: books } = await supabase.from('books').select('id, price').eq('seller_id', user.id)
            const bookIds = books?.map(b => b.id) || []

            let totalEarnings = 0;
            if (bookIds.length > 0) {
                const { data: orders } = await supabase
                    .from('orders')
                    .select('amount')
                    .in('book_id', bookIds)
                    .eq('status', 'completed')

                const totalSales = orders?.reduce((sum, order) => sum + (Number(order.amount) || 0), 0) || 0;
                totalEarnings = totalSales * 0.70; // 70% cut for sellers
            }

            // Get all withdrawals (pending or approved)
            const { data: withdrawalsList } = await supabase
                .from('withdrawals')
                .select('*')
                .eq('seller_id', user.id)
                .neq('status', 'rejected')
                .order('created_at', { ascending: false })

            const totalWithdrawn = withdrawalsList?.reduce((sum, w) => sum + Number(w.amount), 0) || 0;

            setBalance(Math.max(0, totalEarnings - totalWithdrawn))

            // Fetch visual history including rejected ones
            const { data: fullHistory } = await supabase
                .from('withdrawals')
                .select('*')
                .eq('seller_id', user.id)
                .order('created_at', { ascending: false })

            setHistory(fullHistory || [])

        } catch (err) {
            console.error("Error fetching withdrawal data:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleWithdraw = async (e) => {
        e.preventDefault()
        const withdrawAmount = Number(amount)

        if (withdrawAmount < 100) {
            alert("Minimum withdrawal amount is ฿100")
            return
        }
        if (withdrawAmount > balance) {
            alert("Insufficient balance")
            return
        }

        setRequesting(true)
        try {
            // Note: RLS policy ensures users can only insert for themselves
            const { error } = await supabase.from('withdrawals').insert([{
                seller_id: user.id,
                amount: withdrawAmount,
                status: 'pending'
            }])

            if (error) throw error

            alert("Withdrawal request submitted successfully!")
            setAmount('')
            fetchData() // Refresh data
        } catch (err) {
            console.error("Withdrawal error:", err)
            alert("Failed to request withdrawal.")
        } finally {
            setRequesting(false)
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="w-5 h-5 text-green-500" />
            case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />
            default: return <Clock className="w-5 h-5 text-orange-500" />
        }
    }

    if (loading) return <div className="p-8"><div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-20 bg-gray-200 rounded col-span-2"></div></div></div></div></div></div>

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Withdrawals</h1>
                <p className="text-[var(--color-text-light)]">Manage your earnings and payout requests</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Available Balance Card */}
                <div className="md:col-span-1">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <Wallet className="absolute right-[-20%] top-[-20%] w-48 h-48 opacity-10" />

                        <h2 className="text-orange-100 mb-2 font-medium">Available Balance</h2>
                        <div className="text-4xl font-bold mb-6">฿{balance.toFixed(2)}</div>

                        <form onSubmit={handleWithdraw} className="space-y-4 relative z-10 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <div>
                                <label className="block text-xs text-orange-100 mb-1">Amount to withdraw</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 font-bold">฿</span>
                                    <input
                                        type="number"
                                        min="100"
                                        max={balance}
                                        step="0.01"
                                        required
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-white/20 border border-white/30 text-white rounded-lg pl-8 pr-4 py-2 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        placeholder="Min. 100"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={requesting || balance < 100 || !amount}
                                className="w-full bg-white text-orange-600 font-bold py-2 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {requesting ? 'Processing...' : (
                                    <>Request Payout <ArrowUpRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* History Section */}
                <div className="md:col-span-2">
                    <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 p-6 h-full">
                        <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
                            <History className="w-5 h-5 text-[var(--color-primary)]" />
                            Withdrawal History
                        </h2>

                        {history.length === 0 ? (
                            <div className="text-center text-[var(--color-text-light)] py-8">
                                <p>No withdrawal history found.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--color-secondary)]/10">
                                {history.map((item) => (
                                    <div key={item.id} className="py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-[var(--color-background)] p-3 rounded-xl border border-[var(--color-secondary)]/10">
                                                {getStatusIcon(item.status)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[var(--color-text-main)]">Withdrawal Request</p>
                                                <p className="text-sm text-[var(--color-text-light)]">
                                                    {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-lg text-[var(--color-primary-dark)]">฿{Number(item.amount).toFixed(2)}</p>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-orange-100 text-orange-700'
                                                }`}>
                                                {item.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Withdrawals
