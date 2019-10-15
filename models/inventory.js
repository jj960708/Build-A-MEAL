const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inventorySchema = new Schema({
	user:{
		type:Schema.Types.ObjectId,
		ref:'User'

	},
	IngredientName: [{ type: Schema.Types.ObjectId, ref: 'inventoryIngredient' }]

}, {
	timestamps: true,
});

const inventory = mongoose.model('inventory', inventorySchema);

module.exports = inventory;