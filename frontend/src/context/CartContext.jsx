import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const { user } = useAuth()
    const [cart, setCart] = useState([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isCartLoaded, setIsCartLoaded] = useState(false)

    // Load cart specific to the user
    useEffect(() => {
        const cartKey = user?.id ? `bookit-cart-${user.id}` : 'bookit-cart-guest'
        const savedCart = localStorage.getItem(cartKey)
        if (savedCart) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCart(JSON.parse(savedCart))
        } else {
             
            setCart([])
        }
         
        setIsCartLoaded(true)
    }, [user?.id])

    // Save cart whenever it changes (only after initial load)
    useEffect(() => {
        if (!isCartLoaded) return;
        const cartKey = user?.id ? `bookit-cart-${user.id}` : 'bookit-cart-guest'
        localStorage.setItem(cartKey, JSON.stringify(cart))
    }, [cart, user?.id, isCartLoaded])

    const addToCart = (book) => {
        setCart(prev => {
            if (prev.find(item => item.id === book.id)) {
                return prev
            }
            return [...prev, book]
        })
        setIsCartOpen(true)
    }

    const removeFromCart = (bookId) => {
        setCart(prev => prev.filter(item => item.id !== bookId))
    }

    const clearCart = () => {
        setCart([])
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen }}>
            {children}
        </CartContext.Provider>
    )
}
