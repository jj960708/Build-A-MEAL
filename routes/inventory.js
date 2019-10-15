const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Inventory = require('../models/inventory');
const InventoryIngredient = require('../models/inventoryIngredient.model');
const { check, validationResult } = require("express-validator");

router.get("/me", auth, async (req, res) => {
    try{
        const inventory = await Inventory.findOne({user:req.user.id}).populate('user','name');
        
        if (!inventory){
            return res.status(404).json({msg:'There is no inventory for this user'})
        }
        return res.json(inventory)

    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");

    }

});

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
        console.log('here')
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
        quantity

    } = req.body;
    const IngredientField = {} ;
    IngredientField.user = req.user.id;
    IngredientField.IngredientName = name;
    IngredientField.inventoryIngredientAdded = from;
    IngredientField.inventoryIngredientExpiration = expires;
    IngredientField.inventoryIngredientQuantity = quantity;
    
    try{
        inventoryIngredient = new InventoryIngredient(IngredientField);
        await inventoryIngredient.save();
        
    
        const inventory = await Inventory.findOne({user:req.user.id});
        inventory.IngredientName.unshift(inventoryIngredient);
        await inventory.save();
        res.json(inventory);
        

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;