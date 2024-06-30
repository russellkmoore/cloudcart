// src/endpoints/getCart.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { ShoppingCart } from '../model/ShoppingCart';

export default async function getCartHandler(req: Request) {
	try {
		const { userId } = await req.json();

		// Retrieve the existing cart from KV
		const cartData = await CARTS.get(`cart-${userId}`);
		if (!cartData) {
			return new Response(JSON.stringify({ message: 'Cart not found' }), { status: 404 });
		}

		return new Response(cartData, { status: 200, headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid request', error: error.message }), { status: 400 });
	}
}