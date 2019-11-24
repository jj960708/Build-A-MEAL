const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
	ingredientName: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},

	ingredientType: {
		type: String,
		required: true,
		unique: false,
		trim: true,
	},

	ingredientImage: {
		type: String, //  Should refer to image path?
		required: true
	},

	ingredientQuantityMeasureValue: {
		type: Array,
		required: true,
	},

	ingredientID: {
		type: String,
	},

}, {
	timestamps: true,
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema); //'Ingredient' is just the ingredientName

module.exports = Ingredient;
