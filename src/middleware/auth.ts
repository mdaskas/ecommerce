import type { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../secrets';
import { UnauthorizedException } from '../exceptions/unauthorized-exception';
import { ErrorCode } from '../exceptions/root';
import { prismaClient } from '..';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

	const token: string = req?.headers?.authorization?.split(' ')[1] ?? '';

	if (!token) {
		next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
	}

	try {
		const payload = jwt.verify(token, JWT_SECRET) as any;
		const user = await prismaClient.user.findFirst({ where: { id: payload.userId } });
		if (!user) {
			next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
		} else {
			// @ts-ignore
			req.user = user;
			next();
		}

	} catch (err) {
		next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
	}
};

export default authMiddleware;