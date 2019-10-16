const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ingredientIndexSchema = new Schema({
	ingredientIndex: {
		type: Number,
		required: true,
		unique: true,
	},

}, {
	timestamps: true,
});

const IngredientIndex = mongoose.model('IngredientIndex', ingredientIndexSchema); //'Ingredient' is just the ingredientName

module.exports = IngredientIndex;
