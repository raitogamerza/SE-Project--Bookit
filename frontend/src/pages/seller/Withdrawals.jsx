import { useState, useEffect } from 'react'
import { Wallet, ArrowUpRight, History, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

const Withdrawals = () => {
    const { user } = useAuth()
    const [balanceData, setBalanceData] = useState({
        total_sales: 0,
        total_earnings: 0,
        total_withdrawn: 0,
        available_balance: 0
    });
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [requesting, setRequesting] = useState(false)

    const [amount, setAmount] = useState('')
    const [bankName, setBankName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [accountName, setAccountName] = useState('')

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    const fetchData = async () => {
        setLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error("No access token available");

            // Fetch balance
            const balanceRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/seller/balance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (balanceRes.ok) {
                const bData = await balanceRes.json();
                setBalanceData(bData);
            }

            // Fetch history
            const historyRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/seller/withdrawals`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (historyRes.ok) {
                const hData = await historyRes.json();
                setHistory(hData);
            }
        } catch (err) {
            console.error("Error fetching withdrawal data:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleWithdraw = async (e) => {
        e.preventDefault()
        const withdrawAmount = Number(amount)

        if (withdrawAmount < 1) {
            alert("Minimum withdrawal amount is ฿1")
            return
        }
        if (withdrawAmount > balanceData.available_balance) {
            alert("Insufficient balance")
            return
        }
        if (!bankName || !accountNumber || !accountName) {
            alert("Please fill in all bank details")
            return
        }

        setRequesting(true)
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/seller/withdraw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: withdrawAmount,
                    bank_name: bankName,
                    account_number: accountNumber,
                    account_name: accountName
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to request withdrawal');

            alert("Withdrawal request submitted successfully!")
            setAmount('')
            setBankName('')
            setAccountNumber('')
            setAccountName('')
            fetchData() // Refresh data
        } catch (err) {
            console.error("Withdrawal error:", err)
            alert(err.message)
        } finally {
            setRequesting(false)
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
            case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />
            case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />
            default: return <Clock className="w-5 h-5 text-orange-500" />
        }
    }

    if (loading) return <div className="p-8"><div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-20 bg-gray-200 rounded col-span-2"></div></div></div></div></div></div>

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="mb-8 border-b border-[var(--color-secondary)]/20 pb-4">
                <h1 className="text-3xl font-black text-[var(--color-text-main)] drop-shadow-sm">Wallet & Payouts</h1>
                <p className="text-[var(--color-text-light)] mt-2">Manage your earnings and request bank transfers</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Balance & Request Form */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Available Balance Card */}
                    <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-3xl p-6 text-[var(--color-text-inverse)] shadow-lg relative overflow-hidden">
                        <Wallet className="absolute right-[-10%] top-[-10%] w-48 h-48 opacity-10" />
                        <h2 className="text-[var(--color-text-inverse)]/80 mb-2 font-medium">Available Balance</h2>
                        <div className="text-4xl font-black mb-6 tracking-tight">฿{balanceData.available_balance.toFixed(2)}</div>

                        <div className="grid grid-cols-2 gap-4 text-sm bg-black/10 rounded-xl p-3 backdrop-blur-sm">
                            <div>
                                <p className="text-[var(--color-text-inverse)]/60">Total Sales</p>
                                <p className="font-bold">฿{balanceData.total_sales.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-[var(--color-text-inverse)]/60">Withdrawn</p>
                                <p className="font-bold">฿{balanceData.total_withdrawn.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Withdrawal Form */}
                    <div className="bg-[var(--color-surface)] rounded-3xl p-6 shadow-sm border border-[var(--color-secondary)]/20">
                        <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-4">Request Payout</h3>
                        <form onSubmit={handleWithdraw} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-light)] mb-1">Amount to withdraw (฿)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={balanceData.available_balance}
                                    step="0.01"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-secondary)]/30 text-[var(--color-text-main)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
                                    placeholder={`Max: ฿${balanceData.available_balance.toFixed(2)}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-light)] mb-1">Bank Name</label>
                                <input
                                    type="text"
                                    required
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-secondary)]/30 text-[var(--color-text-main)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
                                    placeholder="e.g. Kasikorn Bank"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-light)] mb-1">Account Number</label>
                                <input
                                    type="text"
                                    required
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-secondary)]/30 text-[var(--color-text-main)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
                                    placeholder="012-3-45678-9"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-light)] mb-1">Account Name</label>
                                <input
                                    type="text"
                                    required
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-secondary)]/30 text-[var(--color-text-main)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={requesting || balanceData.available_balance < 1 || !amount}
                                className="w-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] font-bold py-3 px-4 rounded-xl hover:bg-[var(--color-primary-dark)] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[var(--color-primary)]/20"
                            >
                                {requesting ? 'Processing...' : (
                                    <>Submit Request <ArrowUpRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: History Section */}
                <div className="lg:col-span-2">
                    <div className="bg-[var(--color-surface)] rounded-3xl shadow-sm border border-[var(--color-secondary)]/20 p-6 sm:p-8 h-full">
                        <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2 border-b border-[var(--color-secondary)]/10 pb-4">
                            <History className="w-6 h-6 text-[var(--color-primary)]" />
                            Transaction History
                        </h2>

                        {history.length === 0 ? (
                            <div className="text-center text-[var(--color-text-light)] py-12 bg-[var(--color-background)] rounded-2xl border border-[var(--color-secondary)]/10">
                                <History className="w-12 h-12 mx-auto text-[var(--color-secondary)]/40 mb-3" />
                                <p className="font-medium text-lg">No withdrawal history found</p>
                                <p className="text-sm mt-1">Your payout requests will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {history.map((item) => (
                                    <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[var(--color-background)] rounded-2xl border border-[var(--color-secondary)]/10 hover:border-[var(--color-primary)]/30 transition-colors gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-secondary)]/10 shadow-sm">
                                                {getStatusIcon(item.status)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[var(--color-text-main)] text-lg">Bank Transfer</p>
                                                <p className="text-sm text-[var(--color-text-light)] mt-1">
                                                    {item.bank_name} •••• {item.account_number.slice(-4)}
                                                </p>
                                                <p className="text-xs text-[var(--color-text-light)]/70 mt-1">
                                                    {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                                            <p className="font-black text-xl text-[var(--color-text-main)]">฿{Number(item.amount).toFixed(2)}</p>
                                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full mt-2 inline-block ${item.status === 'approved' || item.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                item.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                    'bg-orange-100 text-orange-700 border border-orange-200'
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
