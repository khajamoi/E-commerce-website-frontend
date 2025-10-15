import React, { createContext, useContext, useState, useEffect } from 'react'


const CartContext = createContext()


export function CartProvider({ children }){
const [items, setItems] = useState([])


useEffect(() => {
const raw = localStorage.getItem('fe_cart')
if(raw) setItems(JSON.parse(raw))
}, [])


useEffect(() => {
localStorage.setItem('fe_cart', JSON.stringify(items))
}, [items])


function addToCart(product, qty = 1){
setItems(prev => {
const found = prev.find(i => i.product.id === product.id)
if(found) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i)
return [...prev, { product, qty }]
})
}


function updateQty(productId, qty){
setItems(prev => prev.map(i => i.product.id === productId ? { ...i, qty } : i))
}


function removeItem(productId){
setItems(prev => prev.filter(i => i.product.id !== productId))
}


function clearCart(){
setItems([])
}


const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)


return (
<CartContext.Provider value={{ items, addToCart, updateQty, removeItem, clearCart, total }}>
{children}
</CartContext.Provider>
)
}


export function useCart(){
return useContext(CartContext)
}


