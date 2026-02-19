import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const SalesChart = () => {
    const data = [
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 5000 },
        { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 1890 },
        { name: 'Sat', sales: 2390 },
        { name: 'Sun', sales: 3490 },
    ]

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/20 h-[400px]">
            <h3 className="text-lg font-bold mb-6 text-[var(--color-text-main)]">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8C7B70' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8C7B70' }} />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        cursor={{ stroke: '#8B5E3C', strokeWidth: 1, strokeDasharray: '5 5' }}
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
