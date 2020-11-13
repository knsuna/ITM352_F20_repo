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
        response.redirect(`./login`);
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

});

const user_data_filename = `user_data.json`;

//Taken from Lab14. Checks if the login already exists
if (fs.existsSync(user_data_filename)) {
    data = fs.readFileSync(user_data_filename, 'utf-8');

    stats = fs.statSync(user_data_filename)
    console.log(user_data_filename + ' has ' + stats.size + ' characters');

    var user_reg_data = JSON.parse(data); // Takes a string and converts it into object or array

    fs.writeFileSync(user_data_filename, JSON.stringify(user_reg_data));

    console.log(user_reg_data);
} else {
    console.log(user_data_filename + ' does not exist!');
}

app.get("/login", function (request, response) {
    var login = fs.readFileSync(`./public/login.html`,`utf-8`);
    response.redirect(login);
});
;

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    // Checks if username exists already USE FOR LOGIN CHECK
    if (typeof user_reg_data[request.body.username] != 'undefined') {
        if (user_reg_data[request.body.username].password == request.body.password) {
            display_invoice_table_rows(request.body.username,response);
        } else {
            response.redirect('./login'); //REDIRECT to Login HTML
        }
    }
});


// CHANGE to Register HTML
app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
        <body>
        <form action="" method="POST">
        <input type="text" name="username" size="40" placeholder="enter username" ><br />
        <input type="password" name="password" size="40" placeholder="enter password"><br />
        <input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
        <input type="email" name="email" size="40" placeholder="enter email"><br />
        <input type="submit" value="Submit" id="submit">
        </form>
        </body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    // process a simple register form

    //validate registration data

    //all good so save the new user
    username = request.body.username;
    user_reg_data[username] = {};
    user_reg_data[username].password = request.body.password;
    user_reg_data[username].email = request.body.email;

    fs.writeFileSync(user_data_filename, JSON.stringify(user_reg_data));
    
    response.send(`${username} registered!`);
});

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