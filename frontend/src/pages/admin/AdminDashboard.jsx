import { Link } from 'react-router-dom'

const AdminDashboard = () => {
    // In a real app we would check auth here

    return (
        <div>
            <header className="bg-[var(--color-surface)] px-8 py-4 border-b border-[var(--color-secondary)]/20 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Dashboard Overview</h1>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <span className="block text-sm font-bold text-[var(--color-text-main)]">Admin User</span>
                        <span className="block text-xs text-[var(--color-text-light)]">Super Admin</span>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
                            alt="Admin Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </header>

            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Users', value: '1,234', color: 'blue' },
                        { label: 'Total Revenue', value: '$45,678', color: 'green' },
                        { label: 'Active Sellers', value: '89', color: 'orange' },
                        { label: 'Pending Approvals', value: '12', color: 'red' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/10">
                            <p className="text-[var(--color-text-light)] text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 p-8 flex items-center justify-center min-h-[400px]">
                    <p className="text-[var(--color-text-light)]">Chart components and Data Tables will go here.</p>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
