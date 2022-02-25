const { model, Schema } = require("mongoose");

const menuSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	image: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
});

const Menu = model("Menu", menuSchema);

module.exports = Menu;