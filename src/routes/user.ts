import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middleware/auth';
import { addAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateUser } from '../controllers/users';

const userRoutes = Router();

userRoutes.post('/address', [authMiddleware], errorHandler(addAddress));
userRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
userRoutes.get('/address/:id', [authMiddleware], errorHandler(listAddress));
userRoutes.put('/', [authMiddleware], errorHandler(updateUser));

userRoutes.put('/role/:id', [authMiddleware], errorHandler(changeUserRole));
userRoutes.get('/', [authMiddleware], errorHandler(listUsers));
userRoutes.get('/:id', [authMiddleware], errorHandler(getUserById));



export default userRoutes;