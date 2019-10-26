const express = require("express");
const router = express.Router();
const request = require('request');
const auth = require("../middleware/auth");
const axios = require('axios');

var ingredients = ["apples"];
var ingredList = ingredients.join(",");

/* 
axios.get(req_str, {
    params: {
    ingredients: ingredList,
    number: '15',
    apiKey: '76a4d6fd5fe747da9a6cc645228c9e53', 
    }
});*/

router.get("/test", async (req, res) => {
    
    try{
        
        const ingredient = req.query.ingredients;
        console.log(ingredient);
        const resipe = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
            params: {
            ingredients: ingredient,
            number: '15',
            apiKey: '405f503cf4394f1d953215f491b99658', 
            }
        });

        return console.log(resipe.data);
        


    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");

    }

});


module.exports = router;

