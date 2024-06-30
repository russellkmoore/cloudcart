// src/endpoints/updateQuantity.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { ShoppingCart } from '../model/ShoppingCart';

export default async function updateQuantityHandler(req: Request) {
	try {
		const { userId, productId, newQuantity } = await req.json();

		// Retrieve the existing cart from KV
		const cartData = await CARTS.get(`cart-${userId}`);
		if (!cartData) {
			return new Response(JSON.stringify({ message: 'Cart not found' }), { status: 404 });
		}

		const cart = new ShoppingCart();
		cart.fromJSON(cartData);
		const item = cart.getItems().find(item => item.id === productId);
		if (!item) {
			return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
		}
		item.quantity = newQuantity;

		await CARTS.put(`cart-${userId}`, cart.toJSON());

		return new Response(JSON.stringify({ message: 'Quantity updated', item }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid request', error: error.message }), { status: 400 });
	}
}