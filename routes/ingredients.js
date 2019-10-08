const router = require('express').Router();
const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');
let IngredientIndex = require('../models/ingredientIndex.model');
let Ingredient = require('../models/ingredient.model');


router.route('/').get((req, res) => {
    const file = "./assets/top-1k-ingredients.csv";
    var current_index;

    //api.analyzeARecipeSearchQuery(q, callback);

    IngredientIndex.findById("5d9b37a2a371e34b10cc2a87")
    .then(index => {
        current_index = index.ingredientIndex;
        continue_request = 0;
        //console.log(current_index);
        fs.createReadStream(file)
        .pipe(csv())
        .on('data', (row) => {
            if(continue_request == 0){
                continue_request +=1;
                current_index += 1;
                const req_str = 'https://api.spoonacular.com/food/ingredients/' + row.ID +  '/information'
                axios.get(req_str, {
                    params: {
                    apiKey: '76a4d6fd5fe747da9a6cc645228c9e53', 
                    }
                }).then(resp => {
                    const ingredientName = row.Ingredient;
                    const ingredientType = resp.data.aisle;
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
            console.log("This is current_index",current_index);
            index.ingredientIndex = current_index;

            index.save()
                .then(() => console.log('index Updated!'))
                .catch(err => res.status(400).json('Error: ' + err));  
            res.json("Index updated!");
        });    
    })   
});

module.exports = router;