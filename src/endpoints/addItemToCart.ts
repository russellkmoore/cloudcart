// src/endpoints/addItemToCart.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { Item, ShoppingCart } from '../model/ShoppingCart';
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi';
import { AddItemRequest } from '../model/RequestTypes';

export class AddItemToCartHandler extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Cart"],
		summary: "Add an item to cart. If there is no cart, it will create one.",
		requestBody: AddItemRequest,
		responses: {
			"200": {
				description: "Returns the updated cart",
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								result: {
									type: 'string',
								},
							},
						},
					},
				},
			},
			"400": {
				description: "Invalid Request",
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								success: { type: 'boolean' },
								error: { type: 'string' },
							},
						},
					},
				},
			},
			"404": {
				description: "Cart Not Found",
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								success: { type: 'boolean' },
								error: { type: 'string' },
							},
						},
					},
				},
			},
		},
	};

	async handle(request: Request, env: any, context: any, data: Record < string, any > ) {
		console.log("data.body is:" + data);
		const addItemRequest = data.body;
		try {
			const cartData = await env.CARTS.get(`cart-${addItemRequest.userId}`);
			let cart = new ShoppingCart();
			if (cartData) {
				cart.fromJSON(cartData);
			}

			const item = new Item(addItemRequest.productId, addItemRequest.name, addItemRequest.price, addItemRequest.quantity);
			cart.addItem(item);

			await env.CARTS.put(`cart-${addItemRequest.userId}`, cart.toJSON());

			return new Response(
				cart.toJSON(), { status: 200, headers: { 'Content-Type': 'application/json' } }
			);
		} catch (error) {
			return new Response(
				JSON.stringify({ success: false, error: error.message }), { status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}
	}
}