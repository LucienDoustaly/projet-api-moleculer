"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "products",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "products.create" --title --description
		create: {
			params: {
				title: "string",
				description: "string",
				price: "number"
			},
			handler(ctx) {
				var product = new Models.Product(ctx.params).create();
				console.log("Products - create - ", product);
				if (product) {
					return Database()
						.then((db) => {
							return db.get("products")
								.push(product)
								.write()
								.then(() => {
									return product;
								})
								.catch(() => {
									return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} else {
					return new MoleculerError("Products", 417, "Expectation failed", { code: 417, message: "Expectation failed" } )
				}
			}
		},

		//	call "products.getAll"
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


		//	call "product.get" --id_product
		get: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return ctx.call("products.verify", { id_product: ctx.params.id_product })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var product = db.get("products").find({ id_product: ctx.params.id_product }).value();;
								return product;
							})
							.catch(() => {
								return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Products", 404, "NOT FOUND", { code: 404, message: "Not found" } )
					}
				})
			}
		},

		//	call "products.verify" --id_product
		verify: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("products")
										.filter({ id_product: ctx.params.id_product })
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