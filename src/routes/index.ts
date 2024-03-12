import { Router } from 'express';
import authRoutes from './auth';
import productsRouter from './products';

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRouter);

export default rootRouter;