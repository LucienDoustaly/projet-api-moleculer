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

		//	call "commandes.create" --id_user
		create: {
			params: {
				id_user: "string"
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
					return new MoleculerError("Commandes", 417, "Expectation failed", { code: 417, message: "Expectation failed" } )
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


		//	call "commandes.getidC" --id_order
		getidC: {
			params: {
				id_order: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify", { id_order: ctx.params.id_order })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var commande = db.get("commandes").find({ id_order: ctx.params.id_order }).value();;
								return commande;
							})
							.catch(() => {
								return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Commandes", 404, "NOT FOUND", { code: 404, message: "Not found" } )
					}
				})
			}
		},

		//	call "commandes.getidU" --id_user
		getidU: {
			params: {
				id_user: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verifyid", { id_user: ctx.params.id_user })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var commandeuser = db.get("commandes").map( "id_order" ).value();;
								return commandeuser;
							})
							.catch(() => {
								return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Commandes", 404, "NOT FOUND", { code: 404, message: "Not found" } )
					}
				})
			}
		},

		//	call "commandes.verify" --id_order
		verify: {
			params: {
				id_order: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_order: ctx.params.id_order })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "commandes.verifyid" --id_user
		verifyid: {
			params: {
				id_user: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_user: ctx.params.id_user })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "commandes.increment" --id_order --id_product
		increment: {
			params: {
				id_order : "string",
				id_product : "string"
			},
			handler(ctx) {
				return ctx.call("commandes.getidC", { id_order: ctx.params.id_order })
						.then((db_commandes) => {
							//
							var commande = new Models.Commande(db_commandes).create();
							commande.id_product = ctx.params.id_product || db_commandes.id_product;
							commande.quantity = db_commandes.quantity + 1;
							//
							return Database()
								.then((db) => {
									return db.get("commandes")
										.find({ id_order: ctx.params.id_order })
										.assign(commande)
										.write()
										.then(() => {
											return commande.quantity;
										})
										.catch(() => {
											return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},

		//	call "commandes.decrement" --id_order --id_product
		decrement: {
			params: {
				id_order : "string",
				id_product : "string"
			},
			handler(ctx) {
				return ctx.call("commandes.getidC", { id_order: ctx.params.id_order })
						.then((db_commandes) => {
							//
							var commande = new Models.Commande(db_commandes).create();
							commande.id_product = ctx.params.id_product || db_commandes.id_product;
							commande.quantity = db_commandes.quantity - 1;
							//
							return Database()
								.then((db) => {
									return db.get("commandes")
										.find({ id_order: ctx.params.id_order })
										.assign(commande)
										.write()
										.then(() => {
											return commande.quantity;
										})
										.catch(() => {
											return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},

		//	call "commandes.edit" --id_order
		validation: {
			params: {
				id_order : "string"
			},
			handler(ctx) {
				return ctx.call("commandes.getidC", { id_order: ctx.params.id_order })
						.then((db_commandes) => {
							//
							var commande = new Models.Commande(db_commandes).create();
							commande.validation = "true" || db_commandes.validation;
							//
							return Database()
								.then((db) => {
									return db.get("commandes")
										.find({ id_order: ctx.params.id_order })
										.assign(commande)
										.write()
										.then(() => {
											return commande;
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