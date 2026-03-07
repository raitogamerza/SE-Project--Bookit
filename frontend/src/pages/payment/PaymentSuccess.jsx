import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { CheckCircle2, BookOpen } from 'lucide-react'

const PaymentSuccess = () => {
    const { cart, clearCart } = useCart()
    const { user } = useAuth()
    const [searchParams] = useSearchParams()
    const paymentIntent = searchParams.get('payment_intent')

    const hasFulfilled = useRef(false)

    useEffect(() => {
        const fulfillOrder = async () => {
            if (paymentIntent && user && !hasFulfilled.current) {
                hasFulfilled.current = true; // Set flag immediately to prevent double calls
                try {
                    // Secure verification via backend calling Stripe API
                    await fetch('http://localhost:5000/api/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ paymentIntentId: paymentIntent })
                    });

                    // Clear the cart regardless
                    clearCart();
                    localStorage.removeItem('bookit-pending-order');
                } catch (error) {
                    console.error("Failed to verify and fulfill order", error);
                    hasFulfilled.current = false; // Reset if it failed
                }
            }
        };

        // We trigger this when the component mounts and the user is defined
        if (user && !hasFulfilled.current) {
            fulfillOrder();
        }
    }, [user, cart, clearCart])

    return (
        <div className="min-h-screen bg-[var(--color-background)] py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-[var(--color-surface)] rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--color-secondary)]/20 text-center relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>

                    <h1 className="text-3xl font-black text-[var(--color-text-main)] mb-4">Payment Successful!</h1>

                    <p className="text-[var(--color-text-light)] mb-8 text-lg">
                        Thank you for your purchase. Your payment has been confirmed and the books have been added to your library.
                    </p>

                    {paymentIntent && (
                        <div className="text-xs text-[var(--color-text-lighter)] mb-8 bg-[var(--color-background)] p-3 rounded-xl border border-[var(--color-secondary)]/10 font-mono">
                            Ref: {paymentIntent.slice(-10)}
                        </div>
                    )}

                    <div className="space-y-4 w-full">
                        <Link
                            to="/my-library"
                            className="w-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg shadow-[var(--color-primary)]/20 pointer-events-auto"
                        >
                            <BookOpen className="w-5 h-5" />
                            Go to My Library
                        </Link>

                        <Link
                            to="/explore"
                            className="w-full bg-transparent text-[var(--color-text-main)] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-secondary)]/10 transition-colors border-2 border-transparent hover:border-[var(--color-secondary)]/20"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess
