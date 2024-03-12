import type { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../secrets';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { SignupSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
	SignupSchema.parse(req.body);

	const { email, password, name } = req.body;

	let user = await prismaClient.user.findFirst({ where: { email } });
	if (user) {
		throw new BadRequestException('User already exists', ErrorCode.USER_ALREADY_EXISTS);
	}
	user = await prismaClient.user.create({
		data: {
			name,
			email,
			password: hashSync(password, 10),
		}
	});
	res.json(user);
}


export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	let user = await prismaClient.user.findFirst({ where: { email } });
	if (!user) {
		throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
	}

	if (!compareSync(password, user.password)) {
		throw new BadRequestException('Invalid password', ErrorCode.INVALID_PASSWORD);
	}

	const token = jwt.sign({ userId: user.id }, JWT_SECRET);

	res.json({ user, token });
}

export const me = async (req: Request, res: Response) => {
	// @ts-ignore
	res.json(req.user);
}