import { Router } from 'express';
import { createProduct, deleteProduct, getProductById, listProducts, searchProducts, updateProduct } from '../controllers/products';
import { errorHandler } from '../error-handler';
import adminMiddleware from '../middleware/admin';
import authMiddleware from '../middleware/auth';

const productsRoutes = Router();

productsRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createProduct));
productsRoutes.get('/search', [authMiddleware, adminMiddleware], errorHandler(searchProducts));

productsRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct));
productsRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));
productsRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listProducts));
productsRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getProductById));


export default productsRoutes;