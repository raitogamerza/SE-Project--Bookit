import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-[var(--color-surface)] border-t border-[var(--color-secondary)]/30 pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-[var(--color-primary-dark)]">
                            <span className="text-2xl">📖</span>
                            <span className="text-xl font-bold">Bookit</span>
                        </div>
                        <p className="text-[var(--color-text-light)] text-sm leading-relaxed">
                            Your favorite anime-style eBook marketplace. Discover stories that resonate with your soul.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-[var(--color-text-main)]">Discover</h3>
                        <ul className="space-y-2 text-sm text-[var(--color-text-light)]">
                            <li><a href="#" className="hover:text-[var(--color-primary)]">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-[var(--color-primary)]">Best Sellers</a></li>
                            <li><a href="#" className="hover:text-[var(--color-primary)]">Featured Authors</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-[var(--color-text-main)]">Community</h3>
                        <ul className="space-y-2 text-sm text-[var(--color-text-light)]">
                            <li><Link to="/seller/guide" className="hover:text-[var(--color-primary)]">Become a Seller</Link></li>
                            <li><a href="#" className="hover:text-[var(--color-primary)]">Reader Forum</a></li>
                            <li><a href="#" className="hover:text-[var(--color-primary)]">Blog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-[var(--color-text-main)]">Newsletter</h3>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-secondary)] bg-[var(--color-surface)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                            />
                            <button className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[var(--color-secondary)]/20 pt-8 text-center text-sm text-[var(--color-text-light)]">
                    &copy; {new Date().getFullYear()} Bookit. All rights reserved. Made with ❤️ for readers.
                </div>
            </div>
        </footer>
    )
}

export default Footer
