import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { createCors } from 'itty-router';
import { AddItemToCartHandler } from './endpoints/addItemToCart';
import { RemoveItemFromCartHandler } from './endpoints/removeItemFromCart';
import { ClearCartHandler } from './endpoints/clearCart';
import { GetCartCountHandler } from './endpoints/getCartCount';
import { GetTotalCostHandler } from './endpoints/getTotalCost';
import { GetCartHandler } from './endpoints/getCart';
import { UpdateQuantityHandler } from './endpoints/updateQuantity';

// get preflight and corsify pair
const { preflight, corsify } = createCors();

interface Env {}

async function pruneOldCarts(env) { // Fetch the first set of entries
	let entries = await env.CARTS.list({ limit: 1000, type: 'json' });
	let allKeys = [...entries.keys]; // Initialize allKeys with the first set of keys

	// Continue fetching if there are more entries
	while (!entries.list_complete) {
		entries = await env.CARTS.list({ cursor: entries.cursor, limit: 1000, type: 'json' });
		allKeys.push(...entries.keys); // Add the new keys to allKeys
	}

	// Current date and one day in milliseconds
	let today = new Date();
	const DAY = 24 * 60 * 60 * 1000;

	for (let entry of allKeys) {
		try {
			// Fetch the cart data
			const cartData = await env.CARTS.get(entry.name);
			if (cartData) {
				// Parse the cart data
				let cart = new ShoppingCart();
				cart.fromJSON(cartData);

				// Check if the cart is older than one day
				if (new Date(cart.dateLastUpdated) < new Date(today - DAY)) {
					// Delete the cart if it's older than one day
					await env.CARTS.delete(entry.name);
				}
			}
		} catch (error) {
			// Do nothing, just move on
		}
	}
}

// Create a router
const router = OpenAPIRouter({
	before: [preflight], // add preflight upstream
	finally: [corsify], // and corsify downstream
	docs_url: '/',
});

// Define routes
router.post('/add-item', AddItemToCartHandler);
router.post('/remove-item', RemoveItemFromCartHandler);
router.post('/clear-cart/:userId', ClearCartHandler);
router.get('/get-cart-count/:userId', GetCartCountHandler);
router.get('/get-total-cost/:userId', GetTotalCostHandler);
router.get('/get-cart/:userId', GetCartHandler);
router.post('/update-quantity', UpdateQuantityHandler);

// Handle requests
export default {
	fetch: router.handle,
	
	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
		await pruneOldCarts(env);
		console.log("cron processed - carts pruned.");
	  },
} satisfies ExportedHandler;

