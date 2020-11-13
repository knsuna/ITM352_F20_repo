/*
By Kai Sunahara
*/
var express = require('express'); //require express
var myParser = require("body-parser"); //require body parser
var data = require('./public/product_data.js'); //load product_data.js
var products = data.products; //Code from bottom of product_data.js
var fs = require('fs'); //Code from Lab 13
const { DH_CHECK_P_NOT_SAFE_PRIME } = require('constants');
var app = express(); //require express

//starts parser
app.use(myParser.urlencoded({ extended: true }));

//Taken from Lab 13 **NOTE for some reason, I could not figure out why the IsNonNegInt Function was not working properly. Will need to modify function.
app.post("/process_form", function (request, response) {
    let POST = request.body; 
    console.log(POST);
     for (i in products) {  
        var productquantitites = POST[`quantity${i}`];
        var totalproductquantities = productquantitites + totalproductquantities;
    if (totalproductquantities != "undefined"){//checks if the quantites are defined when added together. If it is undefined, it means that there are no values.
       console.log("Not Undefined")
    }
    else{
        response.send(`
        <head>
        Invalid Data
        </br>Please Go Back
        </head>
        `)
    }
    if (isNonNegInt(productquantitites)) {
        display_invoice_table_rows(POST,response);
    }     
    else {
        response.send(`
        <head>
        Invalid Data
        </br>Please Go Back
        </head>
        `)
      }

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


function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0; // handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}


app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));