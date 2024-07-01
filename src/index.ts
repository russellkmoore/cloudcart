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
} satisfies ExportedHandler;