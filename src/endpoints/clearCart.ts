// src/endpoints/clearCart.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { ShoppingCart } from '../model/ShoppingCart';
import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";


export class ClearCartHandler extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Cart"],
		summary: "Clears the shopping cart.",
		parameters: {
			userId: Path(String, {
				description: "User ID",
			}),
		},
		responses: {
			"200": {
				description: "Success. Cart cleared.",
				schema: {
					success: Boolean,
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
			const cartData = await env.CARTS.get(`cart-${userId}`);
			if (!cartData) {
				return Response.json({ success: false, error: "Cart not found", }, { status: 404, });
			}

			await env.CARTS.delete(`cart-${userId}`);
			return {
				success: true,
			};

		} catch (error) {
			return Response.json({ success: false, error: error.message, }, { status: 400, });
		}
	}
}