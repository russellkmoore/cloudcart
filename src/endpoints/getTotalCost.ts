// src/endpoints/getTotalCost.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { ShoppingCart } from '../model/ShoppingCart';
import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";

export class GetCartTotalCostHandler extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Cart"],
		summary: "Clears the shopping cart total cost.",
		parameters: {
			userId: Path(String, {
				description: "User ID",
			}),
		},
		responses: {
			"200": {
				description: "Success.",
				schema: {
					success: Boolean,
					totalCost: Number;
				},
			},
			"400": {
				description: "Invalid Request",
				schema: {
					success: Boolean,
					error: String,
				},
			},
			"404": {
				description: "Cart Not Found",
				schema: {
					success: Boolean,
					error: String,
				},
			},
		},
	};

	async handle(request: Request, env: any, context: any, data: Record < string, any > ) {
		// Retrieve the validated request body
		const { userID } = data.params;
		try {
			const cartData = await env.CARTS.get(`cart-${AddItemRequest.userId}`);
			if (!cartData) {
				return Response.json({ success: false, error: "Cart not found", }, { status: 404, });
			}

			const cart = new ShoppingCart();
			cart.fromJSON(cartData);
			const totalCost = cart.getTotalCost();
			return {
				success: true,
				totalCost: totalCost,
			};

		} catch (error) {
			return Response.json({ success: false, error: error.message, }, { status: 400, });
		}
	}
}