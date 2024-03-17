import type { Request, Response } from 'express';
import { prismaClient } from '..';
import { ErrorCode } from '../exceptions/root';
import { NotFoundException } from '../exceptions/not-found';

export const createProduct = async (req: Request, res: Response) => {

	const product = await prismaClient.product.create({
		data: {
			...req.body,
			tags: req.body.tags.join(','),
		}
	})
	res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const product = req.body;
		if (product.tags) {
			product.tags = product.tags.join(',');
		}
		const updatedproduct = await prismaClient.product.update({
			where: {
				id: parseInt(req.params.id)
			},
			data: product
		});
		res.json(updatedproduct);
	} catch (err) {
		throw new NotFoundException('Product not found', ErrorCode.NOT_FOUND);
	}
};

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const product = await prismaClient.product.delete({
			where: {
				id: parseInt(req.params.id)
			}
		});
		res.json(product);
	} catch (err) {
		throw new NotFoundException('Product not found', ErrorCode.NOT_FOUND);
	}
};

export const listProducts = async (req: Request, res: Response) => {
	const count = await prismaClient.product.count();

	const products = await prismaClient.product.findMany({
		skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
		take: 5,
	});
	res.json({count, data: products});
};

export const getProductById = async (req: Request, res: Response) => {
	try {
		const product = await prismaClient.product.findFirstOrThrow({
			where: {
				id: parseInt(req.params.id)
			}
		});
		res.json(product);
	} catch (err) {
		throw new NotFoundException('Product not found', ErrorCode.NOT_FOUND);
	}
};

export const searchProducts = async (req: Request, res: Response) => {
console.log('************', req.query.q);
	const products = await prismaClient.product.findMany({
		where: {
			name: {
				search: req.query.q as string
			},
			description: {
				search: req.query.q as string
			},
			tags: {
				search: req.query.q as string
			}
		},
		skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
		take: 5,
	});
	res.json(products);
};