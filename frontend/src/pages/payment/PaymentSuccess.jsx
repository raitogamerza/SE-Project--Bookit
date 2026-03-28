import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { CheckCircle2, BookOpen, AlertCircle, Loader2 } from 'lucide-react'

const PaymentSuccess = () => {
    const { clearCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // Stripe parameters
    const paymentIntent = searchParams.get('payment_intent')
    const redirectStatus = searchParams.get('redirect_status')

    // Local state
    const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'failed'
    const [errorMessage, setErrorMessage] = useState('')
    const hasFulfilled = useRef(false)

    useEffect(() => {
        const verifyPayment = async () => {
            if (hasFulfilled.current) return;
            hasFulfilled.current = true;

            try {
                // If Stripe explicitly says it failed
                if (redirectStatus && redirectStatus !== 'succeeded') {
                    setStatus('failed');
                    setErrorMessage(
                        redirectStatus === 'processing'
                            ? "Your payment is currently processing. We will update you when it completes."
                            : "Payment failed or requires a different payment method. Please try again."
                    );
                    return;
                }

                if (!paymentIntent || !user) {
                    setStatus('failed');
                    setErrorMessage("Missing payment or user information. If you've already paid, please contact support.");
                    return;
                }

                // Secure verification via backend calling Stripe API
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/verify-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentIntentId: paymentIntent })
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Payment verification failed.");
                }

                // Success!
                setStatus('success');
                clearCart();
                localStorage.removeItem('bookit-pending-order');

            } catch (error) {
                console.error("Failed to verify and fulfill order", error);
                setStatus('failed');
                setErrorMessage(error.message || "An unexpected error occurred while verifying your payment.");
            }
        };

        // We trigger this when the component mounts and the user is defined
        if (user && status === 'verifying') {
            verifyPayment();
        }
    }, [user, paymentIntent, redirectStatus, status, clearCart])

    return (
        <div className="min-h-screen bg-[var(--color-background)] py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-[var(--color-surface)] rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--color-secondary)]/20 text-center relative overflow-hidden">

                {status === 'verifying' && (
                    <div className="relative z-10 flex flex-col items-center py-8">
                        <Loader2 className="w-16 h-16 text-[var(--color-primary)] animate-spin mb-6" />
                        <h1 className="text-2xl font-black text-[var(--color-text-main)] mb-2">Verifying Payment...</h1>
                        <p className="text-[var(--color-text-light)]">Please wait while we confirm your transaction securely with Stripe.</p>
                    </div>
                )}

                {status === 'success' && (
                    <>
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
                                    className="w-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg shadow-[var(--color-primary)]/20"
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
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <AlertCircle className="w-12 h-12" />
                            </div>

                            <h1 className="text-3xl font-black text-[var(--color-text-main)] mb-4">Payment Failed</h1>

                            <p className="text-[var(--color-text-light)] mb-8">
                                {errorMessage}
                            </p>

                            <div className="space-y-4 w-full">
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg shadow-[var(--color-primary)]/20"
                                >
                                    Return to Checkout
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default PaymentSuccess
