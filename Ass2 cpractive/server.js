/*
By Kai Sunahara
*/
var express = require('express'); //require express
var myParser = require("body-parser"); //require body parser
var data = require('./public/product_data.js'); //load product_data.js
var products = data.products; //Code from bottom of product_data.js
var fs = require('fs'); //Code from Lab 13
var app = express(); //require express

//starts parser
app.use(myParser.urlencoded({ extended: true }));

//Taken from Lab 13 **NOTE for some reason, I could not figure out why the IsNonNegInt Function was not working properly. Will need to modify function.
app.post("/process_form", function (request, response) {
    let POST = request.body; 
    console.log(POST);
    var CorrectValue = true; //Values are number,an interger, and not negative
    var Quantities = false; //Makes sure that there is at least one value
     for (i in products) {
        if(isNaN(POST[`quantity${i}`]) == true) { //Runs isNonNegInt function for q
            CorrectValue = false; //If q is false, set variable to false (quantity is not an int)
        }

        if (POST[`quantity${i}`] > 0) { //If q variable greater than 0
            Quantities = true; //And item has been purchased, set variable to true
        }
    }
    console.log(CorrectValue,Quantities);

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
    
    //Taken from Assignment 1 example. 
    function display_invoice_table_rows() {
        subtotal = 0;
        str = '';
        for (i = 0; i < products.length; i++) {
            a_qty = 0;
            if(typeof POST[`quantity${i}`] != 'undefined') {
                a_qty = POST[`quantity${i}`];
            }
            if (a_qty > 0) {
                // product row
                extended_price =a_qty * products[i][`Price`]
                subtotal += extended_price;
                str += (`
      <tr>
        <td width="43%">${products[i][`Type`]}</td>
        <td align="center" width="11%">${a_qty}</td>
        <td width="13%">\$${products[i][`Price`]}</td>
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
        }
        else if (subtotal <= 100) {
            shipping = 5;
        }
        else {
            shipping = 0.05 * subtotal; // 5% of subtotal
        }

        // Compute grand total
        total = subtotal + tax + shipping;
        
        return str;
    }

});;

var filename = 'user_data.json';

//Taken from Lab 14
if (fs.existsSync(filename)) { //This will go and check if a filename exists and then returns true or false or runs some code.  We will run this in an if statement.
    stats = fs.statSync(filename); //We will use the statSync, apply it to variable stat
    console.log(filename + ' has ' + stats.size + ' characters'); //The .size stat will output CHARACTERS
    
    data = fs.readFileSync(filename, 'utf-8');  //Here we load in our json data
   
    users_reg_data = JSON.parse(data); //This will move through our data string from a json file and turn it into an object

    console.log(users_reg_data['knsunaha'].password); //Console log for testing (shows actual object properties) NOTE: ONLY FOR A SPECIFIC USER/property
    console.log(users_reg_data);

} else {
    console.log(filename + ' does not exist!'); //If our file doesnt exist, run other code
}

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not

});
