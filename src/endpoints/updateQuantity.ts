// src/endpoints/updateQuantity.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { ShoppingCart } from '../model/ShoppingCart';
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi';
import { UpdateItemRequest } from '../model/RequestTypes';

export class UpdateQuantityHandler extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Cart"],
		summary: "Updates the quantity of an item in the cart.",
		requestBody: UpdateItemRequest,
		responses: {
			"200": {
				description: "Returns the updated cart. Quantity updated.",
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
				description: "Cart or Item Not Found",
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
		const updateItemRequest = data.body;
		try {
			const cartData = await env.CARTS.get(`cart-${updateItemRequest.userId}`);
			if (!cartData) {
				return new Response(
					JSON.stringify({ success: false, error: "Cart not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } }
				);
			}

			const cart = new ShoppingCart();
			cart.fromJSON(cartData);

			const item = cart.getItems().find(item => item.id === updateItemRequest.productId);
			if (!item) {
				return new Response(
					JSON.stringify({ success: false, error: "Item not found in cart." }), { status: 404, headers: { 'Content-Type': 'application/json' } }
				);
			}
			item.quantity = updateItemRequest.newQuantity;

			await env.CARTS.put(`cart-${updateItemRequest.userId}`, cart.toJSON());
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