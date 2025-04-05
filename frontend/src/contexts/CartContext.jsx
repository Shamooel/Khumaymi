"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useAuth } from "./AuthContext"
import {
  fetchCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  updateCartItemQuantity as apiUpdateCartItemQuantity,
  clearCart as apiClearCart,
} from "../services/api"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      loadCart()
    } else {
      // Load cart from localStorage when not authenticated
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error)
          setCartItems([])
        }
      }
    }
  }, [isAuthenticated])

  // Save cart to localStorage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isAuthenticated])

  const loadCart = async () => {
    if (!isAuthenticated) return

    setLoading(true)
    setError(null)
    try {
      const data = await fetchCart()
      setCartItems(data)
    } catch (error) {
      console.error("Error loading cart:", error)
      setError("Failed to load cart")
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product, quantity = 1) => {
    setError(null)

    try {
      if (isAuthenticated) {
        // Add to cart on the server
        await apiAddToCart(product.id, quantity)
        await loadCart() // Reload cart from server
      } else {
        // Add to local cart
        setCartItems((prevItems) => {
          const existingItem = prevItems.find((item) => item.product.id === product.id)

          if (existingItem) {
            // Update quantity if item already exists
            return prevItems.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
            )
          } else {
            // Add new item
            return [...prevItems, { product, quantity }]
          }
        })
      }
      return { success: true }
    } catch (error) {
      console.error("Error adding to cart:", error)
      setError(error.message || "Failed to add item to cart")
      return { success: false, error: error.message }
    }
  }

  const removeFromCart = async (productId) => {
    setError(null)

    try {
      if (isAuthenticated) {
        // Remove from cart on the server
        await apiRemoveFromCart(productId)
        await loadCart() // Reload cart from server
      } else {
        // Remove from local cart
        setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
      }
      return { success: true }
    } catch (error) {
      console.error("Error removing from cart:", error)
      setError(error.message || "Failed to remove item from cart")
      return { success: false, error: error.message }
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId)

    setError(null)

    try {
      if (isAuthenticated) {
        // Update quantity on the server
        await apiUpdateCartItemQuantity(productId, quantity)
        await loadCart() // Reload cart from server
      } else {
        // Update quantity in local cart
        setCartItems((prevItems) =>
          prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
        )
      }
      return { success: true }
    } catch (error) {
      console.error("Error updating cart quantity:", error)
      setError(error.message || "Failed to update quantity")
      return { success: false, error: error.message }
    }
  }

  const clearCart = async () => {
    setError(null)

    try {
      if (isAuthenticated) {
        // Clear cart on the server
        await apiClearCart()
        await loadCart() // Reload cart from server
      } else {
        // Clear local cart
        setCartItems([])
        localStorage.removeItem("cart")
      }
      return { success: true }
    } catch (error) {
      console.error("Error clearing cart:", error)
      setError(error.message || "Failed to clear cart")
      return { success: false, error: error.message }
    }
  }

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    totalItems: cartItems.reduce((total, item) => total + item.quantity, 0),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

