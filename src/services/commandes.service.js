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


		//	call "commandes.getidC" --id_commande
		getidC: {
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
								return new MoleculerError("Commandes", 500, "ERR_CRITIALGET", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Commandes", 404, "Product doesnt exists", { code: 404, message: "Product doesn't exists" } )
					}
				})
			}
		},

		//	call "commandes.getidU" --id_utilisateur
		getidU: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verifyid", { id_utilisateur: ctx.params.id_utilisateur })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var commandeuser = db.get("commandes").map( "id_commande" ).value();;
								return commandeuser;
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

		//	call "commandes.verifyid" --id_utilisateur
		verifyid: {
			params: {
				id_utilisateur: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_utilisateur: ctx.params.id_utilisateur })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "commandes.increment" --id_commande --id_product
		increment: {
			params: {
				id_commande : "string",
				id_product : "string"
			},
			handler(ctx) {
				return ctx.call("commandes.getidC", { id_commande: ctx.params.id_commande })
						.then((db_commandes) => {
							//
							var commande = new Models.Commande(db_commandes).create();
							commande.id_product = ctx.params.id_product || db_commandes.id_product;
							commande.quantity = db_commandes.quantity + 1;
							//
							return Database()
								.then((db) => {
									return db.get("commandes")
										.find({ id_commande: ctx.params.id_commande })
										.assign(commande)
										.write()
										.then(() => {
											return commande.quantity;
										})
										.catch(() => {
											return new MoleculerError("Commandes", 500, "ERR_CRITIALIncrement", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},

		//	call "commandes.decrement" --id_commande --id_product
		decrement: {
			params: {
				id_commande : "string",
				id_product : "string"
			},
			handler(ctx) {
				return ctx.call("commandes.getidC", { id_commande: ctx.params.id_commande })
						.then((db_commandes) => {
							//
							var commande = new Models.Commande(db_commandes).create();
							commande.id_product = ctx.params.id_product || db_commandes.id_product;
							commande.quantity = db_commandes.quantity - 1;
							//
							return Database()
								.then((db) => {
									return db.get("commandes")
										.find({ id_commande: ctx.params.id_commande })
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

		//	call "commandes.edit" --id_commande
		validation: {
			params: {
				id_commande : "string"
			},
			handler(ctx) {
				return ctx.call("commandes.getidC", { id_commande: ctx.params.id_commande })
						.then((db_commandes) => {
							//
							var commande = new Models.Commande(db_commandes).create();
							commande.validation = "true" || db_commandes.validation;
							//
							return Database()
								.then((db) => {
									return db.get("commandes")
										.find({ id_commande: ctx.params.id_commande })
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