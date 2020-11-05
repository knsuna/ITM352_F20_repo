/*
By Kai Sunahara
*/
var express = require('express');//require express
var myParser = require("body-parser");//require body parser
var queryString = require("querystring");//querystring to be used to process the POST to invoice https://nodejs.org/api/querystring.html
var data = require('./public/product_data.js'); //load product_data.js
var products = data.products; //get data from product_data.js

var app = express();

//check where coming from and request
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});


app.use(myParser.urlencoded({ extended: true }));


app.post("/process_form", function (request, response) {
    /*process_quantity_form(request.body, response);
    response.send(request.body);*/
    let POST = request.body;
    console.log(POST);//check POST array to see if it is pulling the correct thing
    var quertyPOST = queryString.stringify(POST);//set POST query so that it can be read by invoice https://www.w3schools.com/Jsref/jsref_stringify.asp
    for(i = 0; products.length;i++) {
    if(isNonNegInt(POST[`products${i}`])){
        response.redirect(`./invoice.html?` + quertyPOST);//send to invoice
    } else {
        response.redirect(`./products_display.html?`+quertyPOST);//send back to product_display
    }
    
}
});
//From Lab 12
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));