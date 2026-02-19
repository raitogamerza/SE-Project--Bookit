const RecentTable = () => {
    const orders = [
        { id: '#ORD-001', customer: 'Alice Wonder', book: 'Sakura Memories', date: '2024-02-10', amount: 259, status: 'Completed' },
        { id: '#ORD-002', customer: 'Bob Builder', book: 'The Anime Artist', date: '2024-02-09', amount: 320, status: 'Processing' },
        { id: '#ORD-003', customer: 'Charlie Chaplin', book: 'Cosmic Dreams', date: '2024-02-08', amount: 380, status: 'Completed' },
        { id: '#ORD-004', customer: 'David Beckham', book: 'Coffee & Cats', date: '2024-02-08', amount: 199, status: 'Cancelled' },
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700'
            case 'Processing': return 'bg-blue-100 text-blue-700'
            case 'Cancelled': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/20 mt-6">
            <h3 className="text-lg font-bold mb-4 text-[var(--color-text-main)]">Recent Orders</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-[var(--color-secondary)]/10 text-[var(--color-text-light)] text-sm">
                            <th className="pb-3 font-medium">Order ID</th>
                            <th className="pb-3 font-medium">Customer</th>
                            <th className="pb-3 font-medium">Book</th>
                            <th className="pb-3 font-medium">Date</th>
                            <th className="pb-3 font-medium">Amount</th>
                            <th className="pb-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {orders.map((order, i) => (
                            <tr key={i} className="border-b border-[var(--color-secondary)]/10 last:border-0 hover:bg-[var(--color-secondary)]/5 transition-colors">
                                <td className="py-4 font-medium text-[var(--color-primary)]">{order.id}</td>
                                <td className="py-4 text-[var(--color-text-main)]">{order.customer}</td>
                                <td className="py-4 text-[var(--color-text-light)]">{order.book}</td>
                                <td className="py-4 text-[var(--color-text-light)]">{order.date}</td>
                                <td className="py-4 font-medium">฿{order.amount}</td>
                                <td className="py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default RecentTable
