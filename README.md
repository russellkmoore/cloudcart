# Cloudflare Workers OpenAPI 3.1

This is a Cloudflare Worker with OpenAPI 3.1 using [itty-router-openapi](https://github.com/cloudflare/itty-router-openapi).

This is an example project made to be used as a quick start into building OpenAPI compliant Workers that generates the
`openapi.json` schema automatically from code and validates the incoming request to the defined parameters or request body.

## Get started

1. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
2. Clone this project and install dependencies with `npm install`
3. Run `wrangler login` to login to your Cloudflare account in wrangler
4. Run `wrangler deploy` to publish the API to Cloudflare Workers

## Project structure

1. Your main router is defined in `src/index.ts`.
2. Each endpoint has its own file in `src/endpoints/`.
3. For more information read the [itty-router-openapi official documentation](https://cloudflare.github.io/itty-router-openapi/).

## Development

1. Run `wrangler dev` to start a local instance of the API.
2. Open `http://localhost:9000/` in your browser to see the Swagger interface where you can try the endpoints.
3. Changes made in the `src/` folder will automatically trigger the server to reload, you only need to refresh the Swagger interface.



# Cloudflare Worker Shopping Cart API

This project implements an e-commerce shopping cart API using Cloudflare Workers and itty-router-openapi. The API allows users to create, update, and manage shopping carts with various endpoints for adding, removing, and updating items in the cart.

## Getting Started
1. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
2. Clone this project and install dependencies with `npm install`
3. Run `wrangler login` to login to your Cloudflare account in wrangler
4. Run `wrangler deploy` to publish the API to Cloudflare Workers

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update) (Cloudflare Workers CLI)

### Installation

#### Clone the repository:

```bash
git clone https://github.com/russellkmoore/cloudcart.git
cd cloudcart
```

#### Create a KV Namespace
Log into cloudflare dashboard and create a KV namespace for your cart storage. Update the id value in your wrangler.toml.

```
#:schema node_modules/wrangler/config-schema.json
name = "cloudcart"
main = "src/index.ts"
compatibility_date = "2024-06-20"

[[kv_namespaces]]
binding = "CARTS"
id = "86943d725290455784202e1ea46dc11e"
```

run wrangler dev (for local) or wrangler deploy (to run in cloudflare) to start the project.

Open a browser to the worker URL and you will see the Swagger UI describing and allowing you to interact with the endpoints.
![Swagger UI](/screenshots/swagger.jpg "Swagger UI")
