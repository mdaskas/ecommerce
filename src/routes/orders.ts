import { Router } from 'express';
import { errorHandler } from '../error-handler';
import adminMiddleware from '../middleware/admin';
import authMiddleware from '../middleware/auth';
import {
	createOrder,
	listOrders,
	cancelOrder,
	getOrderById,
	changeStatus,
	listAllOrders,
	listUserOrders
} from '../controllers/orders';

const orderRoutes = Router();

orderRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createOrder));

orderRoutes.get('/index', [authMiddleware, adminMiddleware], errorHandler(listAllOrders));
orderRoutes.get('/users/:id', [authMiddleware, adminMiddleware], errorHandler(listUserOrders));
orderRoutes.get('/status', [authMiddleware, adminMiddleware], errorHandler(changeStatus));

orderRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(listOrders));
orderRoutes.put('/:id/cancel', [authMiddleware, adminMiddleware], errorHandler(cancelOrder));


orderRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getOrderById));


export default orderRoutes;