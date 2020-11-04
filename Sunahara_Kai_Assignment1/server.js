var express = require('express');
var myParser = require("body-parser");
var fs = require('fs');
var queryString = require("querystring");
var data = require('./public/product_data.js');
var products = data.products;

var app = express();

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});


app.use(myParser.urlencoded({ extended: true }));

app.post("/process_form", function (request, response) {
    /*process_quantity_form(request.body, response);
    response.send(request.body);*/
    let POST = request.body;
    console.log(POST);
    var quertyPOST = queryString.stringify(POST);
    for(i = 0; products.length;i++) {
    if(isNonNegInt(POST["quantity" + i])){
        response.redirect(`./invoice.html?` + quertyPOST);
    } else {
        response.redirect(`./products_display.html?`+quertyPOST);
    }
    
}
});

function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

/*function process_quantity_form(POST, response) {
    if (typeof POST['purchase_submit_button'] != 'undefined') {
        var qString = queryString.stringify(POST);
        for (i in products) {
            let q = POST[`quantity${i}`];
            if (isNonNegInt(q)) {
                response.redirect(`invoice.html?`+qString) // render template string
            } else {
                response.redirect(`product_display.html` + qString);
            }
        }

    }
}
*/
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));