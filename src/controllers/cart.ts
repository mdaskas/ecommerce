import type { Request, Response, NextFunction } from 'express';

import { prismaClient } from './../index';
import { ChangeQuantitySchema, CreateCartSchema } from '../schema/cart';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';
import { Product } from '@prisma/client';

export const addItemToCart = async (req: Request, res: Response) => {
	// @ts-ignore
	if (req.user.id !== req.params.id) {
		throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
	}

	const validatedData = CreateCartSchema.parse(req.body);
	let product: Product;
	try {
		product = await prismaClient.product.findUnique({
			where: {
				id: validatedData.productId,
			},
		}) as Product;
	} catch (error) {
		throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);
	}

	const cart = await prismaClient.cartItem.create({
		data: {
			// @ts-ignore
			userId: req.user.id,
			quantity: validatedData.quantity,
			productId: product.id,
		},
	});

	res.status(201).json(cart);

};

export const deleteItemFromCart = async (req: Request, res: Response) => {
	// @ts-ignore
	if (req.user.id !== req.params.id) {
		throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
	}
	await prismaClient.cartItem.delete({
		where: {
			id: parseInt(req.params.id),
		},
	});

	res.json({ message: 'Item deleted' });
};

export const changeQuantity = async (req: Request, res: Response) => {
	const validated = ChangeQuantitySchema.parse(req.body);
	const updatedCart = await prismaClient.cartItem.update({
		where: {
			id: parseInt(req.params.id),
		},
		data: {
			quantity: validated.quantity,
		},
	});

	res.json(updatedCart);
};

export const getCart = async (req: Request, res: Response) => {
	const cart = await prismaClient.cartItem.findMany({
		where: {
			// @ts-ignore
			userId: req.user.id,
		},
		include: {
			product: true,
		}
	});

	res.json(cart);
};