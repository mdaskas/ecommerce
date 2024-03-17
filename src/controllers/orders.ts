import type { Request, Response } from 'express';
import { prismaClient } from '..';
import { OrderEventStatus } from '@prisma/client';
import { ErrorCode } from '../exceptions/root';
import { NotFoundException } from '../exceptions/not-found';

export const createOrder = async (req: Request, res: Response) => {

	return await prismaClient.$transaction(async (tx) => {
		const cartItems = await tx.cartItem.findMany({
			where: {
				// @ts-ignore
				userId: req.user.id
			},
			include: {
				product: true
			}
		});
		if (cartItems.length === 0) {
			return res.json({message: 'Cart is empty'});
		}
		const price = cartItems.reduce((acc, item) => acc + (item.quantity * +item.product.price), 0);
		const address = await tx.address.findFirst({
			where: {
				// @ts-ignore
				userId: req.user.defaultShippingAddress
			}
		});
		const order = await tx.order.create({
			data: {
				// @ts-ignore
				userId: req.user.id,
				netAmount: price,
				address: address?.formattedAddress!,
				products: {
					create: cartItems.map((item) => {
						return {
							productId: item.productId,
							quantity: item.quantity
						}
					})

				}
			}
		});
		const orderEvent = await tx.orderEvent.create({
			data: {
				orderId: order.id,
			}
		});
		await tx.cartItem.deleteMany({
			where: {
				// @ts-ignore
				userId: req.user.id
			}
		});

		return res.json(order);
	});

};

export const listOrders = async (req: Request, res: Response) => {
	const orders = await prismaClient.order.findMany({
		where: {
			// @ts-ignore
			userId: req.user.id
		}
	});

	res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
	try {
		const order = await prismaClient.order.update({
			where: {
				id: parseInt(req.params.id)
			},
			data: {
				status: OrderEventStatus.CANCELLED
			}
		});
		await prismaClient.orderEvent.create({
			data: {
				// @ts-ignore
				orderId: order.orderId,
				status: OrderEventStatus.CANCELLED
			}
		});
		res.json(order);
	} catch (err) {
		throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
	}
};

export const getOrderById = async (req: Request, res: Response) => {
	try {
		const order = await prismaClient.order.findFirstOrThrow({
			where: {
				id: parseInt(req.params.id)
			},
			include: {
				products: true,
				events: true,
			}
		});

		res.json(order);
	} catch (err) {
		throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
	}
};

 
export const listAllOrders = async (req: Request, res: Response) => {
	let whereClause = {};

	const status = req.query.status;
	console.log('*** status: ', status);

	if (status) {
		whereClause = {
			status: status
		}
	}
	const orders = await prismaClient.order.findMany({
		where: whereClause,
		skip: +(req.query.skip || 0),
		take: 5
	});

	res.json(orders);
};

export const changeStatus = async (req: Request, res: Response) => {

	try {
		const order = await prismaClient.order.update({
			where: {
				id: parseInt(req.params.id)
			},
			data: {
				status: req.body.status
			}
		});
		await prismaClient.orderEvent.create({
			data: {
				// @ts-ignore
				orderId: order.id,
				status: req.body.status
			}
		});
		res.json({message: 'Status updated'});
	} catch (err) {
		throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
	}
};


export const listUserOrders = async (req: Request, res: Response) => {
	let whereClause: any = {
		userId: +req.params.id
	};

	const status = req.params.status;

	if (status) {
		whereClause = {
			...whereClause,
			status
		}
	}
	const orders = await prismaClient.order.findMany({
		where: whereClause,
		skip: +(req.query.skip || 0),
		take: 5
	});

	res.json(orders);
};
