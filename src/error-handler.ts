import type { Request, Response, NextFunction } from 'express';
import { ErrorCode, HttpException } from './exceptions/root';
import { InternalException } from './exceptions/internal-exception';
import { error } from 'console';
import { ZodError } from 'zod';
import { BadRequestException } from './exceptions/bad-request';

export const errorHandler = (method: Function) => {

	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await method(req, res, next);
		} catch (err) {
			let exception: HttpException;

			if (err instanceof HttpException) {
				exception = err;
			} else if (error instanceof ZodError) {
					exception = new BadRequestException('Invalid request data', ErrorCode.UNPROCESSABLE_ENTITY);
			} else {
				exception = new InternalException('Internal server error', err, ErrorCode.INTERNAL_ERROR);
			}
			next(exception);
		}
	};
}