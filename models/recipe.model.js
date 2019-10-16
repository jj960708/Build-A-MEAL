const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
	recipeName: {
		type: String,
		required: true
	},

	recipeImage: {
		type: String, //  Should refer to image path?
		required: true
	},

	recipePrepTime: {
		type: Number,
		required: true
	},
	
	recipeInstructions: {
		type: String,
		required: true
	},
	
	recipeDishTypes: {
		type: Set(String),
		required: true
	},

	recipeIngredients: {
		type: Set(Ingredient)
		required: true
	}

}, {
	timestamps: true,
});

const Recipe = mongoose.model('recipeName', recipeSchema);

module.exports = Recipe;
