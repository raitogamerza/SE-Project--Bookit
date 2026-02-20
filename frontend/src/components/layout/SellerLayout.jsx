import { Outlet } from 'react-router-dom'
import Sidebar from '../layout/Sidebar'

const SellerLayout = () => {
    return (
        <div className="flex min-h-screen bg-[var(--color-background)]">
            <Sidebar />
            <div className="flex-1 overflow-hidden flex flex-col h-screen">
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default SellerLayout
