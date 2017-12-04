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
				bodyParsers: {
	                json: true,
	            },
				path: "/api/v1/",
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
					"POST user": "utilisateur.create", //check
					"GET user/:email": "utilisateur.get", //check
					"PATCH user/:email": "utilisateur.edit", //check

					//product
					"POST product": "products.create",//check
					"GET product/:id_product": "products.get", //check
					"PATCH product/:id_product": "products.edit", //check
					"PATCH product/:id_product/increment": "products.increment",//check
					"PATCH product/:id_product/decrement": "products.decrement",//check

					//commande
					"POST order/user/:id_user": "commandes.create",//check
					"GET order/:id_order": "commandes.getidC",//check
					"GET order/user/:id_user": "commandes.getidU",//check
					"PATCH order/:id_order/product/:id_product/increment": "commandes.increment",//check
					"PATCH order/:id_order/product/:id_product/decrement": "commandes.decrement",//check
					"PATCH order/:id_order": "commandes.validation"//check
				}
			}
		]

	}
};
