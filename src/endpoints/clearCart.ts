// src/endpoints/clearCart.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { ShoppingCart } from '../model/ShoppingCart';

export default async function clearCartHandler(req: Request) {
	try {
		const { userId } = await req.json();

		// Retrieve the existing cart from KV
		const cartData = await CARTS.get(`cart-${userId}`);
		if (!cartData) {
			return new Response(JSON.stringify({ message: 'Cart not found' }), { status: 404 });
		}

		const cart = new ShoppingCart();
		cart.fromJSON(cartData);
		cart.clearCart();

		await CARTS.put(`cart-${userId}`, cart.toJSON());

		return new Response(JSON.stringify({ message: 'Cart cleared' }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid request', error: error.message }), { status: 400 });
	}
}