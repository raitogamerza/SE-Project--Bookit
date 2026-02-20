import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('bookit-cart')
        return savedCart ? JSON.parse(savedCart) : []
    })
    const [isCartOpen, setIsCartOpen] = useState(false)

    useEffect(() => {
        localStorage.setItem('bookit-cart', JSON.stringify(cart))
    }, [cart])

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
