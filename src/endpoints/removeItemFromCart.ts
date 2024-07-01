// src/endpoints/removeItemFromCart.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { ShoppingCart } from '../model/ShoppingCart';
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi';
import { RemoveItemRequest } from '../model/RequestTypes';

export class RemoveItemFromCartHandler extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Cart"],
		summary: "Removes an item from cart.",
		requestBody: RemoveItemRequest,
		responses: {
			"200": {
				description: "Returns the updated cart. Item removed.",
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
		const removeItemRequest = data.body;
		try {
			const cartData = await env.CARTS.get(`cart-${removeItemRequest.userId}`);
			if (!cartData) {
				return new Response(
					JSON.stringify({ success: false, error: "Cart not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } }
				);
			}

			const cart = new ShoppingCart();
			cart.fromJSON(cartData);
			cart.removeItem(removeItemRequest.productId);

			await env.CARTS.put(`cart-${removeItemRequest.userId}`, cart.toJSON());
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