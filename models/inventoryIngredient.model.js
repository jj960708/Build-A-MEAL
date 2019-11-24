const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inventoryIngredientSchema = new Schema({
	user:{
		type:Schema.Types.ObjectId,
		ref:'User'

	},

	IngredientName: {
		type: String,
		required: true,
		trim: true,
		 /* It may be more useful to implement a key to allow for
		 multiple instances of the same ingredient with different attributes.
		 If this is done, the following should be set to "false".
		 Also: See the inventoryIngredientID attribute.*/
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
		type: String,
		required: true,
	},

	unit: {
		type: String,
		
	}

});

const inventoryIngredient = mongoose.model('inventoryIngredient', inventoryIngredientSchema);

module.exports = inventoryIngredient;
