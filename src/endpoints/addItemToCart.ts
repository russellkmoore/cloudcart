// src/endpoints/addItemToCart.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { Item, ShoppingCart } from '../model/ShoppingCart';
import { OpenAPIRoute, OpenAPIRouteSchema } from "@cloudflare/itty-router-openapi";
import { AddItemRequest } from '../model/RequestTypes';

export class AddItemToCartHandler extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Cart"],
		summary: "Add an item to cart. If there is no cart, it will create one.",
		requestBody: AddItemRequest,
		responses: {
			"200": {
				description: "Returns the updated cart",
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
	
	async handle( request: Request, env: any, context: any, data: Record<string, any>) {
		// Retrieve the validated request body
		const addItemRequest = data.body;
		try {
			const cartData = await env.CARTS.get(`cart-${addItemRequest.userId}`);
			if (!cartData) {
				return Response.json(
					{ success: false, error: "Cart not found", },
					{ status: 404, }
				);
			}
			
			const cart = new ShoppingCart();
			cart.fromJSON(cartData);
			const item = new Item(addItemRequest.productId, addItemRequest.name, addItemRequest.price, addItemRequest.quantity);
			cart.addItem(item);
			
			await env.CARTS.put(`cart-${userId}`, cart.toJSON());
			return {
				success: true,
				cart: cart.toJSON(),
			};
			
		} catch (error) {
			return  Response.json(
				{ success: false, error: error.message, },
				{ status: 400, }
			);
		}
	}
}

