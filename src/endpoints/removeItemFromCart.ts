// src/endpoints/removeItemFromCart.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { ShoppingCart } from '../model/ShoppingCart';
import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";

export class RemoveItemFromCartHandler extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Cart"],
		summary: "Removes an item from cart.",
		requestBody: RemoveItemRequest,
		responses: {
			"200": {
				description: "Returns the updated cart. Item removed.",
				schema: {
					success: Boolean,
					result: {
						cart: ShoppingCart,
					},
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
		const removeItemRequest = data.body;
		try {
			const cartData = await env.CARTS.get(`cart-${removeItemRequest.userId}`);
			if (!cartData) {
				return Response.json({ success: false, error: "Cart not found", }, { status: 404, });
			}

			const cart = new ShoppingCart();
			cart.fromJSON(cartData);
			cart.removeItem(removeItemRequest.productId);

			await env.CARTS.put(`cart-${userId}`, cart.toJSON());
			return {
				success: true,
				cart: cart.toJSON(),
			};

		} catch (error) {
			return Response.json({ success: false, error: error.message, }, { status: 400, });
		}
	}
}