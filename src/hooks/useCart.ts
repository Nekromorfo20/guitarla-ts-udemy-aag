import { useEffect, useState, useMemo } from "react"
import type { TGuitar, TCartItem } from "../types"
import { db } from "../data/db"

const useCart = () => {

    const initialCart  = () : TCartItem[] => {
        const localStorageCart = localStorage.getItem("cart")
        return localStorageCart ? JSON.parse(localStorageCart) : []
      }
    
      const [data] = useState(db)
      const [cart, setCart] = useState(initialCart)
      const MAX_ITEMS = 5
      const MIN_ITEMS = 1
    
      useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
      }, [cart])
    
      const addToCart = (item : TGuitar) => {
        const itemExist = cart.findIndex(guitar => guitar.id === item.id)
        if (itemExist >= 0) { // Existe el item en el carrito
          if (cart[itemExist].quantity >= MAX_ITEMS) return
          const updatedCart = [...cart]
          updatedCart[itemExist].quantity++
          setCart(updatedCart)
    
        } else {
          const newItem : TCartItem = { ...item, quantity: 1 }
          setCart([...cart, newItem])
        }
      }

      const removeFromCart = (id : TGuitar['id']) => {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
      }

      const increaseQuantity = (id : TGuitar['id']) => {
        const updatedCart = cart.map(item => {
          if (item.id === id && item.quantity < MAX_ITEMS) {
            return {
              ...item,
              quantity: item.quantity + 1
            }
          }
          return item
        })

        setCart(updatedCart)
      }

      const decreaseQuantity = (id : TGuitar['id']) => {
        const updatedCart = cart.map(item => {
          if (item.id === id && item.quantity > MIN_ITEMS) {
            return {
              ...item,
              quantity: item.quantity - 1
            }
          }
          return item
        })
    
        setCart(updatedCart)
      }

      const clearCart = () => {
        setCart([])
      }

      // State derivado, se utiliza en Header.jsx
      const isEmpty = useMemo(() => (cart.length === 0), [cart])
      const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}

export default useCart