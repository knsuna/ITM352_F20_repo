/*
By Kai Sunahara
Server javascript
*/
var express = require('express'); //require express
var myParser = require("body-parser"); //require body parser
var queryString = require("querystring"); //querystring to be used to process to invoice https://nodejs.org/api/querystring.html (Found from searching the web)
var data = require('./public/product_data.js'); //load product_data.js
var products = data.products; //Code from bottom of product_data.js
var app = express(); //starts express

//Starts up myParser
app.use(myParser.urlencoded({ extended: true }));

//From Lab 13
app.post("/process_form", function (request, response) {
    let POST = request.body;
    //console.log(POST); //check POST array to see if it is pulling the correct thing
    var quertyPOST = queryString.stringify(POST); //set as a query so that it can be read by invoice https://nodejs.org/api/querystring.html
    for (i in products) {
        if (isNonNegIntString(POST[`products${i}`])) {
            response.redirect(`./invoice.html?` + quertyPOST); //send to invoice
        } else {
            response.redirect(`./products_display.html?` + quertyPOST); //send back to product_display
        }

    }
});



//From Lab 12
function isNonNegIntString(string_to_check, returnErrors = false) {
    /*This function returns true  if string_to_check is a non-negative integer. If returnErrors= true it will return the array of reasons it is not a non-negative integer.
     */
    errors = []; // assume no errors at first
    if (Number(string_to_check) != string_to_check) errors.push('Not a number!'); // Check if string is a number value
    if (string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));