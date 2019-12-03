const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//inventory schema
const inventorySchema = new Schema({
	user:{
		type:Schema.Types.ObjectId,
		ref:'User'

	},
	IngredientName: {
		type: [{ type: Schema.Types.ObjectId, ref: 'inventoryIngredient' }],
		validate: [arrayLimit, '{PATH} exceeds the limit of 10']
	}

}, {
	timestamps: true,
});

const inventory = mongoose.model('inventory', inventorySchema);

function arrayLimit(val) {
	return val.length <= 10;
}

module.exports = inventory;