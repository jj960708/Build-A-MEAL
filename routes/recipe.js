const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const axios = require('axios');
const InventoryIngredient = require('../models/inventoryIngredient.model');
const Inventory = require('../models/inventory');
let Ingredient = require('../models/ingredient.model'); 

//get ingredient names from a recipe
const get_ingredient_names = function(ingredientsList){
    const ingredientNames = ingredientsList.map(ingredient => {
        return ingredient.IngredientName;
    });
    return ingredientNames;
}

//query spoonacular for 15 recipes based on the ingredients that the user has
router.post("/", async (req, res) => {
    
    try{
        console.log(req.body.ingredientsList);
        var ingredientsListBulk = req.body.ingredientsList;
        var ingredientsList = get_ingredient_names(ingredientsListBulk);
        const ingredient = ingredientsList.join(",");
        
        const recipe = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
            params: {
            ingredients: ingredient,
            number: '15',
            apiKey: '76a4d6fd5fe747da9a6cc645228c9e53', 
            }
        });

        return res.json(recipe.data);
        


    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");

    }

});
//find recipe info
router.get("/findrecipe/:id", async (req, res) => {
    
    try{
        
        const recipe_id = req.params.id;
        
        
        const recipe = await axios.get('https://api.spoonacular.com/recipes/'+recipe_id.toString()+'/information', {
            params: {
            apiKey: '76a4d6fd5fe747da9a6cc645228c9e53', 
            }
        });

        return res.json(recipe.data);
        


    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");

    }

});
//get more specific data info based on an id
router.get("/find/:id", async (req, res) => {
    
    try{
        
        const recipe_id = req.params.id;
        
        
        const recipe = await axios.get('https://api.spoonacular.com/recipes/'+recipe_id.toString()+'/analyzedInstructions', {
            params: {
            apiKey: '76a4d6fd5fe747da9a6cc645228c9e53', 
            }
        });

        return res.json(recipe.data);
        


    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");

    }

});
//get ingredient info from a recipe based on id
const addIngredient = function(ID){
    const req_str = 'https://api.spoonacular.com/food/ingredients/' + ID +  '/information'
    axios.get(req_str, {
        params: {
        apiKey: '76a4d6fd5fe747da9a6cc645228c9e53', 
        }
    }).then(resp => {
        const ingredientName = resp.data.name;
        const ingredientType = resp.data.aisle;
        var ingredientID = ID;
        var ingredientImage; 
        
        var ingredientQuantityMeasureValue;
        if(resp.data.image){
            ingredientImage = "https://spoonacular.com/cdn/ingredients_500x500/" + resp.data.image;
        } else{
            ingredientImage = "";
        }
        if(resp.data.shoppingListUnits){
            if(resp.data.shoppingListUnits.length > 0){
                ingredientQuantityMeasureValue = resp.data.shoppingListUnits;
            }
            else{
                ingredientQuantityMeasureValue = [];
            }
        } else{
            ingredientQuantityMeasureValue = [];
        }
        const newIngredient = new Ingredient({
            ingredientName,
            ingredientType,
            ingredientImage,
            ingredientQuantityMeasureValue,
            ingredientID,
            
        });
        //console.log("made newIngredient!");
        newIngredient.save()
            .then(() => console.log(ingredientName, ' added!'))
    }).catch(err =>{
        console.log(err);
    })
    
}

const find_ingredient_substring = async function(inventory, ingredient_use){
    for(var i = 0; i < inventory.IngredientName.length; i++){
        var ingredient = await InventoryIngredient.findOne({_id: inventory.IngredientName[i]});        
        console.log(ingredient.IngredientName);
        if(ingredient.IngredientName.search(ingredient_use.name) != -1){
            //console.log("you've found the right ingredient!");
            return(ingredient)
        }
        
    }
    return null;
}

//use recipe and subtract the ingredients used from the inventory
router.post("/useRecipe/:id", auth, async (req, res) => {

    try{
        var ingredientslist = req.body.ingredients;
        var missedIngredients = req.body.missedIngredients;
        var inventory = await Inventory.findOne({user:req.user.id})
        

        //console.log(inventory);
        var RecipeResponse = [];
        for(var i = 0; i < missedIngredients.length; i++){
            var ingredientItem = await Ingredient.findOne({ingredientID: missedIngredients[i].id});
            if(!ingredientItem){
                //adds the ingredient item to my available ingredients
                console.log("adding ingredient: ", missedIngredients[i].name);
                addIngredient(missedIngredients[i].id);
                var ingredient = await find_ingredient_substring(inventory, missedIngredients[i]);
                if(ingredient == null){
                    console.log("could not find the right ingredient");
                    return 0;
                }
            }
        }

        for(var i = 0; i < ingredientslist.length; i++){
            var ingredientItem = await Ingredient.findOne({ingredientID: ingredientslist[i].id});
            if(!ingredientItem){
                //adds the ingredient item to my available ingredients
                //console.log("adding ingredient!\n");
                addIngredient(ingredientslist[i].id);
                var ingredient = await find_ingredient_substring(inventory, ingredientslist[i]);
                if(ingredient == null){
                    console.log("could not find the right ingredient");
                    return 0;
                }
            }else{
                console.log(ingredientItem.ingredientName);
                var ingredient = await InventoryIngredient.findOne({IngredientName: ingredientItem.ingredientName, user: req.user.id });
            }
            if(ingredient == null){
                var ingredient = await find_ingredient_substring(inventory, ingredientslist[i])
                RecipeResponse.push({
                    success: false,
                    error: true, 
                    remove: false,
                    substitute: true,
                    msg: "ERROR: Exact ingredient not found. Suggesting " + ingredient.IngredientName+ " instead.",
                    ingredient: ingredient,                   
                });
                continue;
            }
            var quantity_deduct;

            if(ingredient && ingredient.unit != ingredientslist[i].unit && (ingredient.unit != "" && ingredientslist[i].unit != "")){
                var convert_req = "https://api.spoonacular.com/recipes/convert"
                console.log("in the if statement");
                console.log("ingredients: ",ingredientslist[i]);
                console.log(ingredient);
                quantity_deduct = await axios.get(convert_req, {
                    params: {
                        ingredientName: ingredient.IngredientName,
                        sourceAmount: ingredientslist[i].amount,
                        sourceUnit: ingredientslist[i].unit,
                        targetUnit: ingredient.unit,
                        apiKey: '76a4d6fd5fe747da9a6cc645228c9e53', 
                    } 
                }).then((res) => {
                    // console.log("response => ",res);
                    // quantity_deduct = res.data.targetAmount;
                    // console.log(quantity_deduct);
                    return res.data.targetAmount;

                }).catch((err) => {
                    console.log(err);
                    return 0;
                });
                //console.log("quantity deduct ==", quantity_deduct);
            }else{
                quantity_deduct = ingredientslist[i].amount;
            }
            var newQuantity = ingredient.inventoryIngredientQuantity - quantity_deduct;
        
            if(newQuantity < 0 && !req.body.override){
                RecipeResponse.push({
                    success: false,
                    error: true, 
                    remove: false,
                    substitute: false,
                    msg: "ERROR: Not enough " + ingredient.IngredientName,
                    ingredient: ingredient,
                    newQuantity: newQuantity,
                });
            } else if(newQuantity <= 0){
                RecipeResponse.push({
                    success: true,
                    error: false,
                    remove: true,
                    substitute: false,
                    msg: "Used up all of the " + ingredient.IngredientName,
                    ingredient: ingredient,
                    newQuantity: 0,
                });
            }  else {
                RecipeResponse.push({
                    success: true,
                    error: false,
                    remove: false,
                    substitute: false,
                    msg: "Reduced appropriate amount from  " + ingredient.IngredientName,
                    ingredient: ingredient,
                    newQuantity: newQuantity,

                })
            }
        }
        return res.json(RecipeResponse);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");

    }

});


module.exports = router;

