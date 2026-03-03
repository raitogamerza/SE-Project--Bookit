const RecentTable = ({ orders = [] }) => {

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700'
            case 'Processing': return 'bg-blue-100 text-blue-700'
            case 'Cancelled': return 'bg-red-100 text-red-700'
            default: return 'bg-[var(--color-secondary)]/10 text-[var(--color-text-main)]'
        }
    }

    return (
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/20 mt-6">
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
                        {orders && orders.length > 0 ? (
                            orders.map((order, i) => (
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-[var(--color-text-light)]">
                                    No recent orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default RecentTable
