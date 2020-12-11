/*
By Kai Sunahara
*/
var express = require('express'); //require express
var myParser = require("body-parser"); //require body parser
var data = require('./public/product_data.js'); //load product_data.js
var products = data.products; //Code from bottom of product_data.js
var fs = require('fs'); //Code from Lab 13
var app = express(); //require express
var user_data_filename = `user_data.json`;

//starts parser
app.use(myParser.urlencoded({ extended: true }));

var permanentquantities = {};//running variable to keep the values from POST
//Taken from Lab 13 **NOTE for some reason, I could not figure out why the IsNonNegInt Function was not working properly. Will need to modify function.
app.post("/process_form", function (request, response) {
    let POST = request.body;
    console.log(POST)
    permanentquantities = POST;//assignes POST to permanent quantities to be used later when recalling the quantities for invoice
    var TotalQuantity = 0;//assigns total quantity 0, if there are quantitites, the values will be added here
    var NonNegIntQuantity = false;//assign variable to false and will be changed to true if it meets IsNonNegInt requirements
    for (i in products) {
        //console.log(POST[`quantity${i}`]);
        IndividualQuantity = POST[`quantity${i}`]; //assigns a variable that will be used to add to Total Quantity
        TotalQuantity += IndividualQuantity;
        if (isNonNegInt(IndividualQuantity)) {//if isNonNegInt is true, assign this variable as true
            NonNegIntQuantity = true;
        }
    }
    if (TotalQuantity > 0 && NonNegIntQuantity == true) {//checks if there are quantites and checks if NonNegIntQuantity variable is true

        return response.redirect(`./login`)
    }
    else {//sends an alert that will redirect back to process form page
        return response.send(`<script>
            alert("Please enter a valid quantity in the products form"); 
            window.history.back();
            
            </script>`);
    }

});

//Taken from Lab14. Checks to see if user_data.json exists
if (fs.existsSync(user_data_filename)) {
    data = fs.readFileSync(user_data_filename, 'utf-8');
    stats = fs.statSync(user_data_filename)
    var user_reg_data = JSON.parse(data); // Takes a string and converts it into object or array    
    console.log(user_data_filename + ' has ' + stats.size + ' characters');

    console.log(user_reg_data);//Displays register users in user_data.json
} else {
    console.log(user_data_filename + ' does not exist!');//Displays warning if user_data.json is missing
}

//The GET request is from the login.view page. Whenver /login is used, they will be sent to login.view
app.get("/login", function (request, response) {
    var contents = fs.readFileSync('./public/login.view', 'utf8');
    response.send(eval('`' + contents + '`')); // render template string
});

//The POST request will be redirected to either the invoice or be given a page to retry login/register new account. Partically taken from Lab 14
app.post("/loginform", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    username = request.body.username.toLowerCase();//will recieve username in lowercase ONLY
    if (typeof user_reg_data[username] != 'undefined') {
        //if username exists, get password 
        if ((user_reg_data[username].password == request.body.password)== true ) {

            console.log(username + ' logged in');
            fullname = user_reg_data[username].name;
            var contents = fs.readFileSync('./public/invoice.view', 'utf8'); //So that the display_invoice_table_rows will be rendered with invoice.view
            response.send(eval('`' + contents + '`')); // render template string
        } else{
            response.send(`<script>
            alert("The password that you have entered is not correct."); 
            window.history.back(); 
            
            </script>`);
        }
    } else {
        //Option to go back and retry login, or register a new account
        response.send(`<script>
        alert("The username you have entered does not match our records."); 
        window.history.back(); 
        
        </script>`);
    }

});


//The GET /register is taken from register.view
app.get("/register", function (request, response) {
    var contents = fs.readFileSync('./public/register.view', 'utf8');
    response.send(eval('`' + contents + '`')); // render template string
});
//When the POST /register is recieved it will begin the process to register new account
app.post("/register", function (request, response) {
    var username = request.body.username;//Assigns username to variable
    var password = request.body.password;//Assigns password to variable
    var second_password = request.body.secondpassword;//Assigns second password to variable
    var email = request.body.email.toLowerCase();//Assigns email to variable and converts to only lowercase
    var fullname = request.body.fullname;

    /*NOTE: I made the validation this way beucase I wanted to be able to display the particular error messages for each issue. 
    Instead of creating some type of function, I wanted the user to be able to see exactly what they were doing wrong by display the issue.
    */
    //if fullname is greater than 30, display error message
    if (!validatefullname(fullname)) {
        console.log(`Full name is more than 30 characters long`);
        response.send(`<script>
            alert("${fullname} is not valid. Please make sure it contains only letters and is shorter than 30 characters"); 
            window.history.back(); 
            
            </script>`);
    }
    else {
        var GoodName = true;
    }
    //if username is already defined, display error message
    if ((typeof user_reg_data[username] != 'undefined')) {
        console.log(`The username requested already exists`);
        response.send(`<script>
            alert("${username} already exists."); 
            window.history.back(); 
            
            </script>`);
    }
    else {
        var GoodUsername = true;
        //if username does not meet requirements from validate Username function (using regular expressions to check)
    }
    if (!validateUsername(username)) {
        console.log(`The username is to long or contains characters other than numbers and letters.`);
        response.send(`<script>
            alert("Your username:${username} is invalid. Please make sure that your password is between 4 and 10 characters (currently at ${username.length}) and only contains number and letters."); 
            window.history.back(); 
            
            </script>`);
    }
    else {
        var GoodUsernameLength = true;
    }
    //if password is not the same as second password, display error message
    if (password != second_password) {
        console.log(`Passwords do not match`);
        response.send(`<script>
            alert("Your passwords ${password} and ${second_password} do not match."); 
            window.history.back(); 
            
            </script>`);
    }
    else {
        var GoodPassword = true;
    }
    //if password is less than 6, display error message
    if (password.length < 6) {
        console.log(`Password is smaller than 6 characters`)
        response.send(`<script>
            alert("Your password ${password} is smaller than 6 characters."); 
            window.history.back(); 
            
            </script>`)
    }
    else {
        var GoodLength = true;
    }
    //if email does not meet requriments in validate email function, displa error message
    if (!validateEmail(email)) {
        console.log(`Email is invalid. Email must only contain letters, numbers, "_", and ".". Domains must be only three characters long.`)
        response.send(`<script>
            alert("Your email ${email} is not valid."); 
            window.history.back(); 
            
            </script>`)
    }
    else {
        var GoodEmail = true;
    }
    //Checks if every variable is true
    if (GoodUsername && GoodPassword && GoodLength && GoodEmail && GoodUsernameLength && GoodName) {
        console.log(`Valid registration`)
        username = request.body.username.toLowerCase(); //get username in lowercase
        user_reg_data[username] = {}; //create empty object for array with username
        user_reg_data[username].name = request.body.fullname; //Assigns full name to new object
        user_reg_data[username].password = request.body.password; //Assigns password to new object
        user_reg_data[username].email = request.body.email.toLowerCase(); //Assigns email to new object

        fs.writeFileSync(user_data_filename, JSON.stringify(user_reg_data)); //This will turn ___ into a string

        var contents = fs.readFileSync('./public/invoice.view', 'utf8');//So that the display_invoice_table_rows will be rendered with invoice.view
        response.send(eval('`' + contents + '`')); // render template string

    }

});

function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0; // handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}
//Taken from an example on the internet. It takes the format from a regular expresion to validate emails. 
/*
Regular Expression Template: For the most part, I was able to following this format when creating the regular expressions for username and email.
[a-z] lower case letters
[A-Z] upper case letters
[0-9] all numbers
List individuals characters in same box
{,} used to define character length
*/
function validateEmail(email) {//used =@ and +\. to seperate sections of email
    const re = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-z]{2,3}$/;
    return re.test(String(email).toLowerCase());
}
//Modified to be between 4-10 characters long.
function validateUsername(user) {
    const re = /^[a-zA-Z0-9]{4,10}$/;
    return re.test(String(user).toLowerCase());
}

function validatefullname(fullname){
    const re = /^[ +a-zA-Z]{0,30}$/
    return re.test(String(fullname));
}

//Taken from Assignment 1 example. 
function display_invoice_table_rows() {

    subtotal = 0;
    str = '';
    for (i = 0; i < products.length; i++) {
        a_qty = 0;
        if (typeof permanentquantities[`quantity${i}`] != undefined) {
            a_qty = permanentquantities[`quantity${i}`];
        }
        if (a_qty > 0) {
            // product row
            extended_price = a_qty * products[i][`Price`]
            subtotal += extended_price;
            str += (`
      <tr>
        <td width="43%">${products[i][`Type`]}</td>
        <td align="center" width="11%">${a_qty}</td>
        <td align="center">\$${products[i].Price}</td>
        <td align="right">\$${extended_price.toFixed(2)}</td>
      </tr>

      `);
      
        }
    }

    // Compute tax
    tax_rate = 0.0575;
    tax = tax_rate * subtotal;

    // Compute shipping
    if (subtotal <= 99.99) {
        shipping = 10;
    }
    else if (subtotal <= 299.99) {
        shipping = 20;
    }
    else {
        shipping = 0.15 * subtotal; // 5% of subtotal
    }

    // Compute grand total
    total = subtotal + tax + shipping;

    return str;

}


app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));