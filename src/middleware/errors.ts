import { HttpException } from '../exceptions/root';
import type {Request, Response, NextFunction} from 'express';

export const errorMiddleware = (err: HttpException, req: Request,
	res: Response, next: NextFunction) => {

 	console.error(err);
	res.status(err.statusCode).json({
		message: err.message,
		errorCode: err.errorCode,
		errors: err.errors,
	});
};