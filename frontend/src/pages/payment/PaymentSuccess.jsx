import { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
    const { clearCart } = useCart();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            clearCart();
        }
    }, [sessionId, clearCart]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 px-4">
            <CheckCircle className="w-24 h-24 text-green-500" />
            <h1 className="text-4xl font-bold text-[var(--color-text-main)] text-center">Payment Successful!</h1>
            <p className="text-lg text-[var(--color-text-light)] text-center max-w-md">
                Thank you for your purchase. Your new books have been added to your library.
            </p>
            <div className="flex gap-4 pt-4">
                <Link to="/explore" className="px-6 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-full font-bold hover:bg-[var(--color-primary)]/10 transition-colors">
                    Continue Exploring
                </Link>
                <Link to="/my-library" className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-full font-bold hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg">
                    Go to My Library
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
