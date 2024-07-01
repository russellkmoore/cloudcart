// src/endpoints/getTotalCost.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { ShoppingCart } from '../model/ShoppingCart';
import { OpenAPIRoute, OpenAPIRouteSchema, Path } from '@cloudflare/itty-router-openapi';

export class GetTotalCostHandler extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Cart"],
		summary: "Gets the total cost of the shopping cart.",
		parameters: {
			userId: Path(String, {
				description: "User ID",
			}),
		},
		responses: {
			"200": {
				description: "Success.",
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								totalCost: { type: 'number' },
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

			const cart = new ShoppingCart();
			cart.fromJSON(cartData);
			const totalCost = cart.getTotalCost();

			return new Response(
				JSON.stringify({ totalCost }), { status: 200, headers: { 'Content-Type': 'application/json' } }
			);

		} catch (error) {
			return new Response(
				JSON.stringify({ success: false, error: error.message }), { status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}
	}
}