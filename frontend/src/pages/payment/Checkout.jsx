import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { ArrowLeft, CreditCard, Wallet, QrCode } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const Checkout = () => {
    const { cart, clearCart } = useCart()
    const navigate = useNavigate()
    const [isProcessing, setIsProcessing] = useState(false)
    const total = cart.reduce((sum, item) => sum + item.price, 0)

    const handlePayment = (e) => {
        e.preventDefault()
        setIsProcessing(true)
        // Mock payment processing
        setTimeout(() => {
            setIsProcessing(false)
            clearCart()
            navigate('/my-library')
            // In a real app, go to success page
        }, 2000)
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Your cart is empty</h2>
                <Link to="/explore" className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-full font-bold hover:bg-[var(--color-primary-dark)]">
                    Explore Books
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Link to="/explore" className="inline-flex items-center text-[var(--color-text-light)] hover:text-[var(--color-primary)] mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-1" /> Back to Explore
            </Link>

            <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-8">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Payment Form */}
                <div className="flex-1 space-y-6">
                    {/* Payment Method Selection */}
                    <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/20">
                        <h2 className="text-xl font-bold mb-4 text-[var(--color-text-main)]">Payment Method</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="border border-[var(--color-primary)] bg-[var(--color-primary)]/5 p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all ring-2 ring-[var(--color-primary)]">
                                <CreditCard className="w-8 h-8 text-[var(--color-primary)]" />
                                <span className="font-bold text-[var(--color-primary-dark)]">Credit Card</span>
                                <input type="radio" name="payment" className="hidden" defaultChecked />
                            </label>
                            <label className="border border-[var(--color-secondary)] p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer hover:bg-[var(--color-background)] transition-all opacity-60">
                                <QrCode className="w-8 h-8 text-[var(--color-text-light)]" />
                                <span className="font-medium">QR PromptPay</span>
                                <input type="radio" name="payment" className="hidden" />
                            </label>
                            <label className="border border-[var(--color-secondary)] p-4 rounded-xl flex flex-col items-center gap-2 cursor-pointer hover:bg-[var(--color-background)] transition-all opacity-60">
                                <Wallet className="w-8 h-8 text-[var(--color-text-light)]" />
                                <span className="font-medium">TrueMoney</span>
                                <input type="radio" name="payment" className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Card Details */}
                    <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/20">
                        <h2 className="text-xl font-bold mb-4 text-[var(--color-text-main)]">Card Details</h2>
                        <form id="payment-form" onSubmit={handlePayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Card Number</label>
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 rounded-xl border border-[var(--color-secondary)]/30 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Expiry Date</label>
                                    <input type="text" placeholder="MM/YY" className="w-full p-3 rounded-xl border border-[var(--color-secondary)]/30 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">CVC</label>
                                    <input type="text" placeholder="123" className="w-full p-3 rounded-xl border border-[var(--color-secondary)]/30 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[var(--color-text-main)]">Cardholder Name</label>
                                <input type="text" placeholder="John Doe" className="w-full p-3 rounded-xl border border-[var(--color-secondary)]/30 focus:ring-2 focus:ring-[var(--color-primary)] outline-none" required />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:w-96 space-y-6">
                    <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/20 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 text-[var(--color-text-main)]">Order Summary</h2>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                            {cart.map((item, i) => (
                                <div key={`${item.id}-${i}`} className="flex gap-3">
                                    <img src={item.cover} className="w-12 h-16 object-cover rounded" alt={item.title} />
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-[var(--color-text-main)] line-clamp-1">{item.title}</div>
                                        <div className="text-xs text-[var(--color-text-light)]">{item.author}</div>
                                        <div className="text-sm font-bold text-[var(--color-primary)]">฿{item.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-[var(--color-secondary)]/10 my-4 pt-4 space-y-2">
                            <div className="flex justify-between text-[var(--color-text-light)]">
                                <span>Subtotal</span>
                                <span>฿{total}</span>
                            </div>
                            <div className="flex justify-between text-[var(--color-text-light)]">
                                <span>Tax</span>
                                <span>฿0</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-[var(--color-text-main)] pt-2">
                                <span>Total</span>
                                <span>฿{total}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="payment-form"
                            disabled={isProcessing}
                            className="w-full py-4 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-xl font-bold hover:bg-[var(--color-primary-dark)] transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? 'Processing...' : `Pay ฿${total}`}
                        </button>
                        <p className="text-xs text-center text-[var(--color-text-light)] mt-4">
                            Secure encrypted payment. No card information is stored on our servers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
