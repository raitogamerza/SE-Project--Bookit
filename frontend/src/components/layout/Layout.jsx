import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text-main)] font-[var(--font-sans)]">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout
