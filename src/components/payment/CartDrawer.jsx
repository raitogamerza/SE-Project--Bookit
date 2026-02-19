import { X, Trash2, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { Link } from 'react-router-dom'

const CartDrawer = () => {
    const { cart, removeFromCart, isCartOpen, setIsCartOpen } = useCart()

    const total = cart.reduce((sum, item) => sum + item.price, 0)

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        <div className="p-4 border-b border-[var(--color-secondary)]/20 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--color-text-main)]">
                                <ShoppingBag className="w-5 h-5" /> Your Cart
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[var(--color-text-light)]"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-light)] space-y-4">
                                    <ShoppingBag className="w-16 h-16 opacity-20" />
                                    <p>Your cart is empty</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-[var(--color-primary)] font-bold hover:underline"
                                    >
                                        Start Browsing
                                    </button>
                                </div>
                            ) : (
                                cart.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-[var(--color-secondary)]/10">
                                        <img src={item.cover} alt={item.title} className="w-16 h-24 object-cover rounded-md" />
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-[var(--color-text-main)] line-clamp-1">{item.title}</h3>
                                                <p className="text-sm text-[var(--color-text-light)]">{item.author}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="font-bold text-[var(--color-primary)]">฿{item.price}</span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t border-[var(--color-secondary)]/20 bg-[var(--color-background)]">
                                <div className="flex justify-between items-center mb-4 text-lg font-bold text-[var(--color-text-main)]">
                                    <span>Total</span>
                                    <span>฿{total}</span>
                                </div>
                                <Link
                                    to="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="block w-full py-4 bg-[var(--color-primary)] text-white text-center rounded-xl font-bold hover:bg-[var(--color-primary-dark)] transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default CartDrawer
