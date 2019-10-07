const router = require('express').Router();
const csv = require('csv-parser');
const fs = require('fs');
let IngredientIndex = require('../models/ingredientIndex.model');
var SpoonacularApi = require('spoonacular_api');

router.route('/').get((req, res) => {
    const file = "./assets/top-1k-ingredients.csv";
    var current_index;
    var api = new SpoonacularApi.DefaultApi()
    var q = "salmon with fusilli and no nuts"; // {String} The recipe search query.
    var callback = function(error, data, response) {
      if (error) {
        console.error(error);
      } else {
        console.log('API called successfully. Returned data: ' + data);
      }
    };
    //api.analyzeARecipeSearchQuery(q, callback);

    IngredientIndex.findById("5d9b37a2a371e34b10cc2a87")
    .then(index => {
        current_index = index.ingredientIndex;
        console.log(current_index);
        fs.createReadStream(file)
        .pipe(csv())
        .on('data', (row) => {
            current_index += 1;
            //console.log(current_index);
            //console.log(row);
            
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