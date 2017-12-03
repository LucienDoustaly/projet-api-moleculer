"use strict";

const ApiGateway = require("moleculer-web");


module.exports = {
	name: "api",
	mixins: [ ApiGateway],

	settings: {
		port: process.env.PORT || 9000,

        cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin: "*",
            // Configures the Access-Control-Allow-Methods CORS header.
            methods: ["GET", "PATCH", "POST"],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: ["Content-Type"],
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders: [],
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials: false,
            // Configures the Access-Control-Max-Age CORS header.
            maxAge: 3600
        },

		routes: [

			{
				path: "/v1/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					// The `name` comes from named param.
					// You can access it with `ctx.params.name` in action
					// "GET hi/:name": "greeter.welcome",
					// "POST user/:auth0_id": "user.create",

					//user
					"POST user": "utilisateur.create",
					"GET user/:email": "utilisateur.get",
					"PATCH user/:email": "utilisateur.edit",

					//product
					"POST product": "products.create",
					"GET product/:id_product": "products.get",
					"PATCH product/:id_product": "products.edit",
					"PATCH product/:id_product/increment": "products.increment",
					"PATCH product/:id_product/decrement": "products.decrement",

					//commande
					"POST order/user/:id_user": "commandes.create",
					"GET order/:id_order": "commandes.getidC",
					"GET order/user/:id_user": "commandes.getidU",
					"GET order/:id_order": "commandes.get",
					"PATCH order/:id_order/product/:id_product/increment": "commandes.increment",
					"PATCH order/:id_order/product/:id_product/decrement": "commandes.decrement",
					"PATCH order/:id_order": "commandes.validation",


					


				}
			},
			{
				bodyParsers: {
	                json: true,
	            },
				path: "/client/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					//	Example project
				}
			}
		]

	}
};
