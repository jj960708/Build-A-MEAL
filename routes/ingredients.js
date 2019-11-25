const router = require('express').Router();
const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');
let IngredientIndex = require('../models/ingredientIndex.model');
let Ingredient = require('../models/ingredient.model');

//allow user to edit the ingredient data
router.route('/ingredientsEdit').post(async (req, res) => {
    Ingredient.find({}, async (err, ingredients)=>{
        ingredients.forEach(ingredient => {
            let ingredient_temp = ingredient;
            var IngredImage = ingredient_temp.ingredientImage.replace("100", "500").replace("100", "500");
            //console.log("new image ==",IngredImage);
            ingredient.overwrite({
                ingredientName: ingredient.ingredientName,
                ingredientType: ingredient.ingredientType,
                ingredientImage: IngredImage,
                ingredientQuantityMeasureValue: ingredient.ingredientQuantityMeasureValue,
                ingredientID: ingredient.ingredientID,
            });
            ingredient.save().then(() => {
                console.log(ingredient);
            });
            
        })
    })
});

router.route('/addID').get(async (req, res) => {
    const file = "./assets/top-1k-ingredients.csv";

    //api.analyzeARecipeSearchQuery(q, callback);

    continue_request = 0;
    var possible_ingredients = await Ingredient.find({}, async (err, ingredients)=>{
        return ingredients;
    });
    //console.log(current_index);
    fs.createReadStream(file)
    .pipe(csv())
    .on('data', (row) => {
        if(continue_request == 0){
            possible_ingredients.forEach(ingredient => {
                if(ingredient.ingredientName == row.Ingredient){
                //console.log("new image ==",IngredImage);
                    ingredient.overwrite({
                        ingredientName: ingredient.ingredientName,
                        ingredientType: ingredient.ingredientType,
                        ingredientImage: ingredient.ingredientImage,
                        ingredientQuantityMeasureValue: ingredient.ingredientQuantityMeasureValue,
                        ingredientID: row.ID
                    });
                    ingredient.save().then(() => {
                        console.log(ingredient);
                    });
                }
                
            });
        }
            
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });    
})   

//populate the database with ingredients
router.route('/').get((req, res) => {
    const file = "./assets/top-1k-ingredients.csv";
    var current_index;

    //api.analyzeARecipeSearchQuery(q, callback);

    IngredientIndex.findById("5d9b37a2a371e34b10cc2a87")
    .then(index => {
        var continue_request = 0
        //console.log(current_index);
        fs.createReadStream(file)
        .pipe(csv())
        .on('data', (row) => {
            if(continue_request == 0){
                //continue_request +=1;
                const req_str = 'https://api.spoonacular.com/food/ingredients/' + row.ID +  '/information'
                axios.get(req_str, {
                    params: {
                    ingredients: 'apple, banana, sugar',
                    number: '15',
                    apiKey: '76a4d6fd5fe747da9a6cc645228c9e53', 
                    }
                }).then(resp => {
                    const ingredientName = row.Ingredient;
                    const ingredientType = resp.data.aisle;
                    const ingredientID = row.ID;
                    var ingredientImage; 
                    var ingredientQuantityMeasureValue;
                    if(resp.data.image){
                        ingredientImage = "https://spoonacular.com/cdn/ingredients_100x100/" + resp.data.image;
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
                        .then(() => console.log('Ingredient added!'))
                        
                }).catch(err =>{
                    console.log(err);
                })
            }
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            return res.status(200).json({msg: "SUCCESS!"})
        });    
    })   
});

module.exports = router;