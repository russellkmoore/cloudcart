// src/endpoints/createCart.ts
import { Request } from '@cloudflare/itty-router-openapi';
import { Item, ShoppingCart } from '../model/ShoppingCart';

export default async function createCartHandler(req: Request) {
	try {
		const { userId, productId, name, price, quantity } = await req.json();
		const cartData = await CARTS.get(`cart-${userId}`);
		let cart = new ShoppingCart();

		if (cartData) {
			cart.fromJSON(cartData);
		}

		const item = new Item(productId, name, price, quantity);
		cart.addItem(item);

		await CARTS.put(`cart-${userId}`, cart.toJSON());

		return new Response(JSON.stringify({ message: 'Item added to cart', item }), { status: 201 });
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid request', error: error.message }), { status: 400 });
	}
}