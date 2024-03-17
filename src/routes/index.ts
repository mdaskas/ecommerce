import { Router } from 'express';
import authRoutes from './auth';
import productsRouter from './products';
import userRoutes from './user';
import cartRoutes from './cart';
import orderRoutes from './orders';

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRouter);
rootRouter.use('/users', userRoutes);
rootRouter.use('/carts', cartRoutes);
rootRouter.use('/orders', orderRoutes);

export default rootRouter;