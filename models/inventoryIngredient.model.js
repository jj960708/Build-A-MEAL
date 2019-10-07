const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inventoryIngredientSchema = new Schema({
	inventoryIngredientName: {
		type: String,
		required: true,
		trim: true,
		 /* It may be more useful to implement a key to allow for
		 multiple instances of the same ingredient with different attributes.
		 If this is done, the following should be set to "false".
		 Also: See the inventoryIngredientID attribute.*/
		unique: true,
	},

	//  If we want to add a unique key to each ingredient in the inventory.
	/*inventoryIngredientID: {
		type: Number,
		required: true,
		unique: true,
		trim: true,
		minlength: 3
	},*/

	inventoryIngredientAdded: {
		type: Date,
		required: true
	},

	inventoryIngredientExpiration: {
		type: Date,
		required: false
	},

	inventoryIngredientQuantity: {
		type: Number,
		required: true,
	},

}, {
	timestamps: true,
});

const inventoryIngredient = mongoose.model('inventoryIngredient', inventoryIngredientSchema);

module.exports = inventoryIngredient;
