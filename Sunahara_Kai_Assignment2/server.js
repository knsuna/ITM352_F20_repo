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
    permanentquantities = POST;
    console.log(POST);
    for (i in products) {
        var productquantitites = POST[`quantity${i}`];
        var totalproductquantities = productquantitites + totalproductquantities;
    }    
        if (totalproductquantities != `undefined` ) {//checks if the quantites are defined when added together. If it is undefined, it means that there are no values.
        console.log(`Defined`)
         if(isNonNegInt(productquantitites)){
            return response.redirect(`./login`)
        }
        }
        else{//sends an alert that will redirect back to process form page
            return response.send(`<script>
            alert("Please enter a quantity in the products form"); 
            window.history.back();
            
            </script>`);
        }
       
    

});

//Taken from Lab14. Checks if the login already exists
if (fs.existsSync(user_data_filename)) {
    data = fs.readFileSync(user_data_filename, 'utf-8');
    stats = fs.statSync(user_data_filename)
    var user_reg_data = JSON.parse(data); // Takes a string and converts it into object or array    
    console.log(user_data_filename + ' has ' + stats.size + ' characters');

    console.log(user_reg_data);
} else {
    console.log(user_data_filename + ' does not exist!');
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
        if (user_reg_data[username].password == request.body.password) {
            console.log(username + ' logged in');
            fullname = user_reg_data[username].name;
            var contents = fs.readFileSync('./public/invoice.view', 'utf8'); //So that the display_invoice_table_rows will be rendered with invoice.view
            response.send(eval('`' + contents + '`')); // render template string
            display_invoice_table_rows(permanentquantities, response); //Invoice is generated with the values from POST
        } 
    }else {
            //send user back to login
        response.send(`
        <!DOCTYPE html>
        <html>
        <body>
        <p>
        Invalid Login. 
        </p>
        <p>
        Click the button below to go back!
        </br><button onclick="goBack()">Go Back</button>
        </p>

        <p>
        
        <form action="/register" action="/register" method="GET">
        Click the button below to register a new account!</br>
        <button class="float-left submit-button">Register</button>
        </form>
        </p>

        <script>
        function goBack() {
          window.history.back();
        }
        </script>
        
        </body>
        </html>`);
        }

});


//The GET /register is taken from register.view
app.get("/register", function (request, response) {
    var contents = fs.readFileSync('./public/register.view', 'utf8');
    response.send(eval('`' + contents + '`')); // render template string
});
//When the POST /register is recieved it will begin the process to register new account
app.post("/register", function (request, response) {
    var username = request.body.username;//to check username
    var password = request.body.password;//check password
    var second_password = request.body.secondpassword;
    var email = request.body.email.toLowerCase();
    var fullname = request.body.fullname;
    //if fullname is greater than 30, display error message
    if(fullname.length > 30){
        response.send(`<script>
            alert("${fullname} is to long."); 
            window.history.back(); 
            
            </script>`);
    }
    else{
        var GoodName = true;
    }
    //if username is already defined, display error message
    if ((typeof user_reg_data[username] != 'undefined')) {
        response.send(`<script>
            alert("${username} already exists."); 
            window.history.back(); 
            
            </script>`);
    }
    else {
        var GoodUsername = true;
    //if username does not meet requirements from validate Username function (using regular expressions to check)
    }
    if (!validateUsername(username)){
                response.send(`<script>
            alert("Your ${username} is ${username.length} characters long. Please make sure that your password is between 4 and 10 characters."); 
            window.history.back(); 
            
            </script>`);
    }
    else{
        var GoodUsernameLength = true;
    }
    //if password is not the same as second password, display error message
    if (password != second_password) {
                response.send(`<script>
            alert("Your passwords ${password} and ${second_password} do not match."); 
            window.history.back(); 
            
            </script>`)
    }
    else {
        var GoodPassword = true;
    }
    //if password is less than 6, display error message
    if(password.length < 6) {
            response.send(`<script>
            alert("Your password ${password} is smaller than 6 characters."); 
            window.history.back(); 
            
            </script>`)
        }
    else {
        var GoodLength = true;
    }
    //if email does not meet requriments in validate email function, displa error message
    if(!validateEmail(email)){
            response.send(`<script>
            alert("Your email ${email} is not valid."); 
            window.history.back(); 
            
            </script>`)
    }
    else{
        var GoodEmail = true;
    }
    //Checks if every variable is true
    if (GoodUsername && GoodPassword && GoodLength && GoodEmail && GoodUsernameLength && GoodName) {
        username = request.body.username.toLowerCase(); //get username
        user_reg_data[username] = {}; //create empty object for array
        user_reg_data[username].name = request.body.fullname;
        user_reg_data[username].password = request.body.password; //get password from password textbox (the .password looks at password textbox name found in script above, the name="" value is password)
        user_reg_data[username].email = request.body.email.toLowerCase(); //get email from email textbox
    

        fs.writeFileSync(user_data_filename, JSON.stringify(user_reg_data)); //This will turn ___ into a string

        var displayInvoice = true
    }
    if (displayInvoice == true) {
        var contents = fs.readFileSync('./public/invoice.view', 'utf8');//So that the display_invoice_table_rows will be rendered with invoice.view
        response.send(eval('`' + contents + '`')); // render template string
        display_invoice_table_rows(permanentquantities, response);
    }
    else{
        console.log(`Error message`)
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
//Taken from an example on the internet. It takes the format from a regular expresion to validate emails
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
//Taken from an example on the internet. Modified to be between 4-10 characters long.
function validateUsername(user){
    const re = /^(?=.{4,10}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    return re.test(String(user).toLowerCase());
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
        <td width="13%">\$${products[i].Price}</td>
        <td width="54%">\$${extended_price.toFixed(2)}</td>
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

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));