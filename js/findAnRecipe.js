AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.Credentials({

});

var foodList = []
var recipe = {}

function indexOf(val) {
    for (var i = 0; i < foodList.length; i++) {
        if (foodList[i] == val) return i;
    }
    return -1;
}

function remove(val) {
    var index = indexOf(val);
    if (index > -1) {
        foodList.splice(index, 1);
    }
}

function addToCart() {
    var food = document.getElementById("food").value;
    foodList.push(food)
    console.log(foodList)
    $("#food_list").prepend("<li class=\"list-group-item\" id=\"" + food + "\"><p style=\"display: inline;\">" + food + "</p><button style=\"display: inline; float:right;\" type=\"button\" class=\"btn btn-primary\"  onclick=delFromCart(\"" + food + "\")>Delete</button></li>");
}

function delFromCart(food) {
    //console.log("#"+food);
    remove(food);
    console.log(foodList);
    $("#" + food).remove();
}

function search() {
    // console.log("foodList");
    // console.log(foodList);
    var apigClient = apigClientFactory.newClient({
        //
        //
        // 
    });
    var params = {};
    var body = {
        "ingredients":foodList
    }
    // console.log("body");
    // console.log(body);
    deleteRec();
    var additionalParams = {};
    apigClient.recipePost(params, body, additionalParams)
        .then(function(response) {
            recipe = response.data
            console.log("response")
            console.log(response);
            show();
        }).catch(function(response) {
            console.log("err");
        });
}


function show() {
    var recTitle = recipe.title
    var directions = recipe.directions.slice(2,-2)
    var newRecipe = "<div class=\"" + recTitle + "\"> \
                        <h5>" + recTitle + " </h5> \
                        <p>" + directions + "</p>\
                    </div>"
    $("#recipe_list").append(newRecipe);         
}

function deleteRec() {
    $("#recipe_list").empty();
}

