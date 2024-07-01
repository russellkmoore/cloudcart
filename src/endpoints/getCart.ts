// src/endpoints/getCart.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { OpenAPIRoute, OpenAPIRouteSchema, Path } from '@cloudflare/itty-router-openapi';
import { Item, ShoppingCart } from '../model/ShoppingCart';

export class GetCartHandler extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Cart"],
		summary: "Gets the shopping cart.",
		parameters: {
			userId: Path(String, {
				description: "User ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns the cart",
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
		const { userId } = data.params;
		try {
			const cartData = await env.CARTS.get(`cart-${userId}`);
			if (!cartData) {
				return new Response(
					JSON.stringify({ success: false, error: "Cart not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } }
				);
			}
			
			let cart = new ShoppingCart();
			cart.fromJSON(cartData);

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