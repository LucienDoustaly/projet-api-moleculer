"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "commandes",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "commandes.create" --id_utilisateur
		create: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
				var commande = new Models.Commande(ctx.params).create();
				console.log("Commandes - create - ", commande);
				if (commande) {
					return Database()
						.then((db) => {
							return db.get("commandes")
								.push(commande)
								.write()
								.then(() => {
									return commande;
								})
								.catch(() => {
									return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} else {
					return new MoleculerError("Commandes", 417, "Product is not valid", { code: 417, message: "Commande is not valid" } )
				}
			}
		},

		//	call "commandes.getAll"
		getAll: {
			params: {
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.values().__wrapped__;
					});
			}
		},


		//	call "commandes.get" --id_commande
		get: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_commande: ctx.params.id_commande })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var commande = db.get("commandes").find({ id_commande: ctx.params.id_commande }).value();;
								return commande;
							})
							.catch(() => {
								return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Commandes", 404, "Product doesnt exists", { code: 404, message: "Product doesn't exists" } )
					}
				})
			}
		},

		//	call "commandes.verify" --id_commande
		verify: {
			params: {
				id_commande: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_commande: ctx.params.id_commande })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "products.edit" --id_product  --description
		edit: {
			params: {
				id_product : "string",
				title : "string",
				description: "string",
				price: "number"
			},
			handler(ctx) {
				return ctx.call("products.get", { id_product: ctx.params.id_product })
						.then((db_products) => {
							//
							var product = new Models.Product(db_products).create();
							product.title = ctx.params.title || db_products.title;
							product.description = ctx.params.description || db_products.description;
							product.price = ctx.params.price || db_products.price;
							//
							return Database()
								.then((db) => {
									return db.get("products")
										.find({ id_product: ctx.params.id_product })
										.assign(product)
										.write()
										.then(() => {
											return product.id_product;
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},

		//	call "products.increment" --id_product
		increment: {
			params: {
				id_product : "string"
			},
			handler(ctx) {
				return ctx.call("products.get", { id_product: ctx.params.id_product })
						.then((db_products) => {
							//
							var product = new Models.Product(db_products).create();
							product.quantity = db_products.quantity + 1;
							//
							return Database()
								.then((db) => {
									return db.get("products")
										.find({ id_product: ctx.params.id_product })
										.assign(product)
										.write()
										.then(() => {
											return [product.id_product, product.quantity];
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},

		//	call "products.decrement" --id_product
		decrement: {
			params: {
				id_product : "string"
			},
			handler(ctx) {
				return ctx.call("products.get", { id_product: ctx.params.id_product })
						.then((db_products) => {
							//
							var product = new Models.Product(db_products).create();
							product.quantity = db_products.quantity - 1;
							//
							return Database()
								.then((db) => {
									return db.get("products")
										.find({ id_product: ctx.params.id_product })
										.assign(product)
										.write()
										.then(() => {
											return [product.id_product,product.quantity];
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		}

	}
};