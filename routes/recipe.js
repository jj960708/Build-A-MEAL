const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const axios = require('axios');


const get_ingredient_names = function(ingredientsList){
    const ingredientNames = ingredientsList.map(ingredient => {
        return ingredient.IngredientName;
    });
    return ingredientNames;
}

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



module.exports = router;

