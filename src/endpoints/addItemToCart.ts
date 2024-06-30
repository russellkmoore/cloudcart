// src/endpoints/addItemToCart.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { Item, ShoppingCart } from '../model/ShoppingCart';

export default async function addItemToCartHandler(req: Request) {
	try {
		const { userId, productId, name, price, quantity } = await req.json();

		// Retrieve the existing cart from KV
		const cartData = await CARTS.get(`cart-${userId}`);
		if (!cartData) {
			return new Response(JSON.stringify({ message: 'Cart not found' }), { status: 404 });
		}

		const cart = new ShoppingCart();
		cart.fromJSON(cartData);
		const item = new Item(productId, name, price, quantity);
		cart.addItem(item);

		await CARTS.put(`cart-${userId}`, cart.toJSON());

		return new Response(JSON.stringify({ message: 'Item added to cart', item }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid request', error: error.message }), { status: 400 });
	}
}