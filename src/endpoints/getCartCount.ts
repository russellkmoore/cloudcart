// src/endpoints/getCartCount.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { ShoppingCart } from '../model/ShoppingCart';

export default async function getCartCountHandler(req: Request) {
	try {
		const { userId } = await req.json();

		// Retrieve the existing cart from KV
		const cartData = await CARTS.get(`cart-${userId}`);
		if (!cartData) {
			return new Response(JSON.stringify({ message: 'Cart not found' }), { status: 404 });
		}

		const cart = new ShoppingCart();
		cart.fromJSON(cartData);
		const itemCount = cart.getItems().length;

		return new Response(JSON.stringify({ itemCount }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid request', error: error.message }), { status: 400 });
	}
}