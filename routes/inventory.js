const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Inventory = require('../models/inventory');
const InventoryIngredient = require('../models/inventoryIngredient.model');
const Ingredient = require("../models/ingredient.model");
const { check, validationResult } = require("express-validator");
ObjectId = require('mongodb').ObjectID;

//get ingredients in the inventory
const get_inventory_ingredients = async function(inventoryList){
    result = [];
    //console.log("inventoryList", inventoryList);
    for(var i = 0; i < inventoryList.length; i++){
        
        var inventoryIngredient = await InventoryIngredient.findOne({_id: new ObjectId(inventoryList[i])});
        var ingredient = await Ingredient.findOne({ingredientName: inventoryIngredient.IngredientName});
        if(!ingredient){
            console.log("description:", ingredient);
            //console.log("Not a valid ingredient!");
        }
        var measure_word = ingredient["ingredientQuantityMeasureValue"];
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        console.log(inventoryIngredient);
        inventoryIngredient = {
            "_id": inventoryList[i],
            "IngredientName": inventoryIngredient["IngredientName"],
            "inventoryIngredientAdded": inventoryIngredient["inventoryIngredientAdded"].toLocaleDateString("en-US", options),
            "inventoryIngredientExpiration": inventoryIngredient["inventoryIngredientExpiration"].toLocaleDateString("en-US", options),
            "inventoryIngredientQuantity": inventoryIngredient["inventoryIngredientQuantity"],
            "ingredientType": ingredient["ingredientType"],
            "ingredientImage": ingredient["ingredientImage"],
            "measureWord": measure_word,
            "unit": inventoryIngredient["unit"],
        }
        
        
        result.push(inventoryIngredient);
    }
    //console.log("Result:",result);
    return result;
}


router.get("/me", auth, async (req, res) => {
    
    try{
        console.log("in /me");
        console.log(req.user.id);
        const inventory = await Inventory.findOne({user:req.user.id}).populate('user','name');
        if (!inventory){
            return res.status(404).json({msg:'There is no inventory for this user'})
        }
        var inventory_ingredients_list = await get_inventory_ingredients(inventory.IngredientName);
        return res.json(inventory_ingredients_list);

    }catch(err){
        console.error(err.message);
        return res.status(500).send("Server Error");

    }

});

//get inventory ingredient by id
router.get("/inventoryIngredient/:id", auth, async(req, res)=>{
    try{
        const inventoryIngredient = await InventoryIngredient.findById(req.params.id)
        if(!inventoryIngredient){
            return res.status(404).json({msg: 'Inventory ingredient does not exist'})
        }
        return res.json(inventoryIngredient);
    }catch(err){
        console.error(err.message);
        return res.status(500).send("Server Error");

    }
});

//delete ingredient from the inventory
router.delete('/:id', auth, async(req, res) => {
    var inventory = await Inventory.findOne({user:req.user.id})
    inventory.IngredientName.remove(req.params.id);
    await inventory.save(function (err, event){
        if(err){
            res.status(400).json('Error: ' + err);
         } 
    });
    InventoryIngredient.findByIdAndDelete(req.params.id)
    .then(() => res.json('Inventory item deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//update ingredient after an edit
router.post('/update/:id', auth, async(req, res) => {

    InventoryIngredient.findById(req.params.id)
      .then(inventoryitem => {
        inventoryitem.IngredientName = req.body.name;
        inventoryitem.inventoryIngredientAdded = req.body.from;
        inventoryitem.inventoryIngredientExpiration = req.body.expires;
        inventoryitem.inventoryIngredientQuantity = req.body.quantity;
        inventoryitem.unit = req.body.unit;
        //console.log(inventoryitem);
        inventoryitem.save()
          .then(() => {
              res.json('Inventory Item updated!');
            })
          .catch(err => {
                //console.log("could not update your db", err);
                res.status(400).json('Error: ' + err)
            });
      })
      .catch(err => res.status(400).json('Error: ' + err));
});

//list of ingredients
router.get('/ingredientslist', (req,res)=>{
    Ingredient.find({}, (err, ingredients)=>{
        let ingredientsList = ingredients.map(ingredient => {
            return ingredient.ingredientName
        });
        return res.json({ ingredientsList: ingredientsList });
    })
})

//creates inventory for a new user
router.post('/',auth,async(req,res) =>{ 
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const inventoryFields = {};
    inventoryFields.user = req.user.id;
    /*
    if (req.body.ingredients){
        inventoryFields.IngredientName =  req.body.ingredients.split(',')
    }*/
    try{
        let inventory = await Inventory.findOne({user:req.user.id});
        if(inventory){
            inventory = await Inventory.findOneAndUpdate({user:req.user.id},{$set:inventoryFields},{new:true});

            return res.json(inventory);
        }
        inventory = new Inventory(inventoryFields);
        await inventory.save();
        //console.log('here')
        res.json(inventory);

    }catch(err){
        res.status(500).send('Server error');
    }
}
);


router.post('/ingredients',auth,async(req,res)=>{

    const {
        name,
        from,
        expires,
        quantity,
        unit

    } = req.body;
    const IngredientField = {} ;
    IngredientField.user = req.user.id;
    IngredientField.IngredientName = name;
    IngredientField.inventoryIngredientAdded = from;
    IngredientField.inventoryIngredientExpiration = expires;
    IngredientField.inventoryIngredientQuantity = quantity;
    IngredientField.unit = unit;

    //console.log(IngredientField);
    try{
        inventoryIngredient = new InventoryIngredient(IngredientField);
        await inventoryIngredient.save();
        
        const inventory = await Inventory.findOne({user:req.user.id});
        //console.log(inventory);
        inventory.IngredientName.unshift(inventoryIngredient);
        await inventory.save();
        res.json(inventory);
        

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;