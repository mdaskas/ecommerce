import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../exceptions/unauthorized-exception';
import { ErrorCode } from '../exceptions/root';


const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	// @ts-ignore
	const user = req.user;
	if (user.role == 'ADMIN') {
		next();
	} else {
		next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
	}
};

export default adminMiddleware;