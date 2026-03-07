import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const PaymentProcessing = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const exactAmount = searchParams.get('amount');

    const [status, setStatus] = useState('processing'); // processing, success, failed
    const [message, setMessage] = useState('Scanning bank notifications. This may take up to 60 seconds...');

    const navigate = useNavigate();
    const { user } = useAuth();
    const { clearCart } = useCart();

    useEffect(() => {
        if (!sessionId || !exactAmount || !user) {
            navigate('/cart');
            return;
        }

        let isPolling = true;

        const checkPaymentStatus = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/verify-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ exactAmount, userId: user.id })
                });

                const data = await response.json();

                if (data.success) {
                    setStatus('success');
                    setMessage('Payment verified successfully! Your books are ready.');
                    clearCart();
                    setTimeout(() => {
                        navigate('/library');
                    }, 3000);
                } else {
                    // Try again after 5 seconds
                    if (isPolling) {
                        setTimeout(checkPaymentStatus, 5000);
                    }
                }
            } catch (err) {
                console.error("Verification error:", err);
                setStatus('failed');
                setMessage('Error connecting to verification server.');
            }
        };

        // Start polling immediately
        checkPaymentStatus();

        // Stop polling after 2 minutes (timeout)
        const timeoutId = setTimeout(() => {
            isPolling = false;
            if (status === 'processing') {
                setStatus('failed');
                setMessage('Could not find a matching payment in time. If you have paid, please contact support.');
            }
        }, 120000);

        return () => {
            isPolling = false;
            clearTimeout(timeoutId);
        };
    }, [sessionId, exactAmount, user, navigate, clearCart, status]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="bg-[var(--color-surface)] p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-[var(--color-secondary)]/10">
                <div className="flex justify-center mb-6">
                    {status === 'processing' && (
                        <div className="relative relative w-24 h-24 flex items-center justify-center">
                            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                        </div>
                    )}
                    {status === 'failed' && (
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-16 h-16 text-red-500" />
                        </div>
                    )}
                </div>

                <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-4">
                    {status === 'processing' ? 'Verifying Payment' : status === 'success' ? 'Payment Confirmed!' : 'Verification Timeout'}
                </h1>

                <p className={`text-lg mb-8 ${status === 'failed' ? 'text-red-600' : 'text-[var(--color-text-light)]'}`}>
                    {message}
                </p>

                {status === 'processing' && (
                    <div className="bg-orange-50 p-4 rounded-xl text-sm text-orange-800 text-left">
                        <p><strong>Note:</strong> We are looking for an exact transfer of <strong>฿{exactAmount}</strong>. Please do not close this page.</p>
                    </div>
                )}

                {status === 'failed' && (
                    <button
                        onClick={() => navigate('/support')}
                        className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-full font-bold hover:bg-[var(--color-primary-dark)]"
                    >
                        Contact Support
                    </button>
                )}
            </div>
        </div>
    )
}

export default PaymentProcessing
