var ingredients = ["apple", "bacon"];
var ingredList = ingredients.join(",");

axios.get(req_str, {
    params: {
    ingredients: ingredList,
    number: '15',
    apiKey: '76a4d6fd5fe747da9a6cc645228c9e53', 
    }
})

