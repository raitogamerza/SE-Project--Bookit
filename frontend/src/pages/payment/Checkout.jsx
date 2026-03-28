import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, ShieldCheck, AlertCircle } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

// Initialize Stripe with the publishable key (Test Mode)
// ⚠️ WARNING: Never expose the secret key on the frontend!
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SxRCmIEEB60k7bce5oxRNCIxaLhbuI81Cwy1zsrq4ED9WsiQedKMzwGMJeTsjzMH75aUxHGbrS8hnLmmH5n283S007RBzS2ld')

const CheckoutForm = ({ totalAmount, cart }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true)

        // Save cart to localStorage so the success page has it after the Stripe redirect
        localStorage.setItem('bookit-pending-order', JSON.stringify(cart));

        // Confirm the payment
        const { error: submitError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Determine where to redirect after payment success
                return_url: `${window.location.origin}/payment/success`,
            },
        })

        if (submitError) {
            setError(submitError.message)
            setIsProcessing(false)
        } else {
            // The customer is redirected to the `return_url`.
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg shadow-[var(--color-primary)]/20 disabled:opacity-70"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <ShieldCheck className="w-5 h-5" />
                        Pay ฿{totalAmount.toFixed(2)} Securely
                    </>
                )}
            </button>
        </form>
    )
}

const Checkout = () => {
    const { cart, setIsCartOpen } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [clientSecret, setClientSecret] = useState("")
    const [initError, setInitError] = useState(null)

    const total = cart.reduce((sum, item) => sum + item.price, 0)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        if (cart.length === 0) {
            navigate('/explore')
            return
        }

        if (total < 10) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setInitError("Stripe requires a minimum total of ฿10.00 THB to process the payment. Please add more items to your cart.");
            return;
        }

        // Fetch the PaymentIntent client secret from the backend
        const fetchClientSecret = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/create-payment-intent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: cart, userId: user.id })
                });

                const data = await response.json();
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    console.error("Failed to fetch client secret:", data.error);
                    setInitError(data.error || "Failed to initialize secure checkout.");
                }
            } catch (error) {
                console.error("Error creating payment intent:", error);
                setInitError("Network error: Could not connect to payment server.");
            }
        };

        fetchClientSecret();
    }, [cart, user, navigate, total]);

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#8B5A2B', // Matching our brown theme
            colorBackground: '#ffffff',
            colorText: '#4A3728',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '12px',
        },
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => { navigate(-1); setIsCartOpen(true); }}
                    className="inline-flex items-center text-[var(--color-text-light)] hover:text-[var(--color-primary)] mb-8 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to cart
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Side: Order Summary */}
                    <div>
                        <h1 className="text-3xl font-black text-[var(--color-text-main)] mb-8">Order Summary</h1>
                        <div className="bg-[var(--color-surface)] rounded-3xl p-6 md:p-8 shadow-sm border border-[var(--color-secondary)]/20 shadow-[var(--color-secondary)]/10">

                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-secondary)]/10">
                                        <div className="w-16 h-24 bg-[var(--color-secondary)]/20 rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
                                            {item.cover ? (
                                                <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex justify-center items-center text-[var(--color-text-light)] text-xs">No Cover</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-[var(--color-text-main)] text-sm line-clamp-2">{item.title}</h3>
                                            <p className="text-xs text-[var(--color-text-light)] mt-1">{item.author}</p>
                                            <div className="mt-2 text-sm font-bold text-[var(--color-primary-dark)]">฿{item.price.toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t-2 border-[var(--color-secondary)]/20 border-dashed">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[var(--color-text-light)]">Subtotal</span>
                                    <span className="font-semibold text-[var(--color-text-main)]">฿{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-black mt-4 text-[var(--color-primary-dark)]">
                                    <span>Total Amount</span>
                                    <span>฿{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Stripe Payment Details */}
                    <div>
                        <h2 className="text-2xl font-black text-[var(--color-text-main)] mb-8">Payment Details</h2>
                        <div className="bg-[var(--color-surface)] rounded-3xl p-6 md:p-8 shadow-md border border-[var(--color-secondary)]/30 border-t-4 border-t-[var(--color-primary)]">
                            <div className="mb-6 flex items-center gap-2 text-sm text-[var(--color-text-light)] bg-green-50 p-4 rounded-xl border border-green-100">
                                <ShieldCheck className="w-6 h-6 text-green-600" />
                                <span className="font-medium text-green-800">Your payment is securely processed by Stripe. We do not store your card details.</span>
                            </div>

                            {initError ? (
                                <div className="flex flex-col items-center justify-center p-8 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
                                    <AlertCircle className="w-10 h-10 mb-4 text-red-500" />
                                    <h3 className="font-bold mb-2">Checkout Error</h3>
                                    <p className="text-sm">{initError}</p>
                                    <button 
                                        onClick={() => { navigate('/explore'); setIsCartOpen(true); }} 
                                        className="mt-6 px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                                    >
                                        Return to Cart
                                    </button>
                                </div>
                            ) : clientSecret ? (
                                <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                                    <CheckoutForm clientSecret={clientSecret} totalAmount={total} cart={cart} />
                                </Elements>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 text-[var(--color-text-light)]">
                                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-[var(--color-primary)]" />
                                    <p className="font-medium">Initializing secure checkout...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
