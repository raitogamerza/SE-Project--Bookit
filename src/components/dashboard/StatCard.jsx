const StatCard = ({ title, value, icon: Icon, trend, color, trendUp = true }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/20 flex items-center justify-between">
            <div>
                <h3 className="text-sm font-medium text-[var(--color-text-light)] mb-1">{title}</h3>
                <p className="text-2xl font-bold text-[var(--color-text-main)]">{value}</p>
                <div className={`text-xs font-bold mt-2 flex items-center gap-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    <span>{trend}</span>
                    <span>from last month</span>
                </div>
            </div>
            <div className={`p-4 rounded-xl ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    )
}
export default StatCard
