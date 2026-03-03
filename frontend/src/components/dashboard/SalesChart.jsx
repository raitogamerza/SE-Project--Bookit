import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const SalesChart = ({ data }) => {
    const defaultData = [
        { name: 'Mon', sales: 0 },
        { name: 'Tue', sales: 0 },
        { name: 'Wed', sales: 0 },
        { name: 'Thu', sales: 0 },
        { name: 'Fri', sales: 0 },
        { name: 'Sat', sales: 0 },
        { name: 'Sun', sales: 0 },
    ]

    const chartData = data && data.length > 0 ? data : defaultData;

    return (
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/20 h-[400px]">
            <h3 className="text-lg font-bold mb-6 text-[var(--color-text-main)]">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8C7B70' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8C7B70' }} />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        cursor={{ stroke: '#8B5E3C', strokeWidth: 1, strokeDasharray: '5 5' }}
                        formatter={(value) => [`฿${value}`, 'Sales']}
                    />
                    <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#8B5E3C"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#8B5E3C', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
export default SalesChart
