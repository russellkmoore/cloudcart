// src/endpoints/getCartCount.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { ShoppingCart } from '../model/ShoppingCart';
import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";


export class GetCartCountHandler extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Cart"],
		summary: "Clears the shopping cart Item Count.",
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
					itemCount: Number;
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
			const itemCount = cart.getItems().length;
			return {
				success: true,
				itemCount: itemcount,
			};

		} catch (error) {
			return Response.json({ success: false, error: error.message, }, { status: 400, });
		}
	}
}