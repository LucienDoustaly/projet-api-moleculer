"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "utilisateur",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "utilisateur.create" --email "x@x" --lastname "lastName" --firstname "firstname"
		create: {
			params: {
				email: "string",
				lastname: "string",
				firstname: "string"
			},
			handler(ctx) {
				var user = new Models.Utilisateur(ctx.params).create();
				return ctx.call("utilisateur.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists == false){
						console.log("utilisateur - create - ", user);
						if (user) {
							return Database()
							.then((db) => {
								return db.get("utilisateur")
									.push(user)
									.write()
									.then(() => {
										return user;
										})
									.catch(() => {
										return new MoleculerError("Utilisateur", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
									});
								});
						}else {
								return new MoleculerError("Utilisateur", 417, "ERR_CRITIAL", { code: 417, message: "Utilisateur is not valid" } )
							}
					}else {
							return new MoleculerError("Utilisateur", 409, "ERR_CRITIAL", { code: 409, message: "Utilisateur existe déjà" } )
					}
				})
			}
		},

		//	call "utilisateur.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("utilisateur").value();
					});
			}
		},


		//	call "utilisateur.get" --email "ab@ab"
		get: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return ctx.call("utilisateur.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user = db.get("utilisateur").find({ email: ctx.params.email }).value();;
								return user;
							})
							.catch(() => {
								return new MoleculerError("Utilisateur", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Utilisateur", 404, "ERR_CRITIAL", { code: 404, message: "Utilisateur doesn't exists" } )
					}
				})
			}
		},

		//	call "utilisateur.verify" --email
		verify: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("utilisateur")
										.filter({ email: ctx.params.email })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	z
			edit: {
			params: {
				email: "string",
				lastname: "string",
				firstname: "string"
			},
			handler(ctx) {
				return ctx.call("utilisateur.get", { email: ctx.params.email })
						.then((exists) => {
							if(exists){
								return ctx.call("utilisateur.get", { email: ctx.params.email })
								.then((db_utilisateur)=>{
							//
							var utilisateur = new Models.Utilisateur(db_utilisateur).create();
							console.log(db_utilisateur, utilisateur);
							utilisateur.lastname = ctx.params.lastname || db_utilisateur.lastname;
							utilisateur.firstname = ctx.params.firstname || db.utilisateur.firstname;
							//
							return Database()
								.then((db) => {
									return db.get("utilisateur")
										.find({ email: ctx.params.email })
										.assign(utilisateur)
										.write()
										.then(() => {
											return utilisateur.email;
										})
										.catch(() => {
											return new MoleculerError("Utilisateur", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							/*.catch(() => {
								return new MoleculerError("Utilisateur", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error2" } )
							});*/
						}else {
							return new MoleculerError("Utilisateur", 404, "ERR_CRITIAL", { code: 404, message: "Critical Error" } )
						}
					})
			}
		}
	}
}