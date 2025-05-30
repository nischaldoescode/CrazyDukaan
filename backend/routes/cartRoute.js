import express from 'express'
import { addToCart, getUserCart, updateCart, clearDeletedCartItems, updateCartItemColor, removeCartItem } from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'

const cartRouter = express.Router()

cartRouter.post('/get',authUser, getUserCart)
cartRouter.post('/add',authUser, addToCart)
cartRouter.post('/update',authUser, updateCart)
cartRouter.post("/clear-deleted", authUser, clearDeletedCartItems);
cartRouter.post("/update-color", authUser, updateCartItemColor);
cartRouter.post("/remove-item", authUser, removeCartItem);

export default cartRouter
