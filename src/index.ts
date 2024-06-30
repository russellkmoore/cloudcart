import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { createCors } from 'itty-router'
import createCartHandler from './endpoints/createCart';
import addItemToCartHandler from './endpoints/addItemToCart';
import removeItemFromCartHandler from './endpoints/removeItemFromCart';
import clearCartHandler from './endpoints/clearCart';
import getCartCountHandler from './endpoints/getCartCount';
import getTotalCostHandler from './endpoints/getTotalCost';
import getCartHandler from './endpoints/getCart';
import updateQuantityHandler from './endpoints/updateQuantity';

// get preflight and corsify pair
const { preflight, corsify } = createCors();

// Create a router
const router = OpenAPIRouter({
	before: [preflight],  // add preflight upstream
	finally: [corsify],   // and corsify downstream
	//schema: './openapi.json',
	docs_url: '/',
});

// Define routes
router.post('/create', createCartHandler);
router.post('/add-item', addItemToCartHandler);
router.post('/remove-item', removeItemFromCartHandler);
router.post('/clear-cart', clearCartHandler);
router.post('/get-cart-count', getCartCountHandler);
router.post('/get-total-cost', getTotalCostHandler);
router.post('/get-cart', getCartHandler);
router.post('/update-quantity', updateQuantityHandler);

// Handle requests
export default {
	async fetch(request: Request) {
		return router.handle(request);
	},
};