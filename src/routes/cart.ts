import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from '../controllers/cart';

const cartRoutes = Router();

cartRoutes.post('/', [authMiddleware], addItemToCart);
cartRoutes.get('/:id', [authMiddleware], getCart);
cartRoutes.delete('/:id', [authMiddleware], deleteItemFromCart);
cartRoutes.put('/:id', [authMiddleware], changeQuantity);

export default cartRoutes;
