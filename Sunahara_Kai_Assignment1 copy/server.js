/*
By Kai Sunahara
*/
var express = require('express'); //require express
var myParser = require("body-parser"); //require body parser
var data = require('./public/product_data.js'); //load product_data.js
var products = data.products; //Code from bottom of product_data.js
var fs = require('fs'); 
var app = express();

//check where coming from and request (set as comment when not debugging)
/*
app.all('*', function(request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});
*/


app.use(myParser.urlencoded({ extended: true }));



//Taken from Lab 13
app.post("/process_form", function (request, response) {
    let POST = request.body; 
    console.log(POST);
    var CorrectValue = true; //Values are number,an interger, and not negative
    var Quantities = false; //Makes sure that there is at least one value
     for (i in products) {
        var q = POST[`quantity${i}`];
        if(isNonNegIntString(q)) { //Runs isNonNegInt function for q
            CorrectValue = true; //If q is false, set variable to false (quantity is not an int)
        } 
        if (q > 0) { //If q variable greater than 0
            Quantities = true; //And item has been purchased, set variable to true
        }
        console.log( q, CorrectValue, Quantities); //Check data in console
  }


    if (CorrectValue && Quantities) {
        display_invoice_table_rows(POST,response);
    }else{
        response.send(`
        <head>
        Invalid Data
        </br>Please Go Back
        </head>
        `)
    } 

    //I used the data that was in the Assignment 1 example. The fs.readFileSync can only be rendered as a text file. Meaning that the js can to be computed in this file before being sent to the txt.
    var contents = fs.readFileSync('./public/invoice.view', 'utf8');
    response.send(eval('`' + contents + '`')); // render template string
    

    function display_invoice_table_rows() {
        subtotal = 0;
        str = '';
        for (i = 0; i < products.length; i++) {
            product_quantity = 0;
            if (typeof POST[`quantity${i}`] != 'undefined') {
                product_quantity = POST[`quantity${i}`];
            }
            if (product_quantity > 0) {
                // product row
                extended_price = product_quantity * products[i]["Price"];
                subtotal += extended_price;
                str += (`
      <tr>
        <td width="43%">${products[i]["Type"]}</td>
        <td align="center" width="11%">${product_quantity}</td>
        <td width="13%">\$${products[i]["Price"]}</td>
        <td width="54%">\$${extended_price}</td>
      </tr>
      `);
            }
        }
        // Compute tax
        tax_rate = 0.0575;
        tax = tax_rate * subtotal;

        // Compute shipping
        if (subtotal <= 50) {
            shipping = 2;
        } else if (subtotal <= 100) {
            shipping = 5;
        } else {
            shipping = 0.05 * subtotal; // 5% of subtotal
        }

        // Compute grand total
        total = subtotal + tax + shipping;

        return str;
    }
});

   //Data Validation
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