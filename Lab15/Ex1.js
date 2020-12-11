var fs = require('fs');
var express = require('express');
var app = express();
var myParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require(`express-session`)

app.use(session({secret: "ITM352 rocks!"}));
app.use(cookieParser());

app.get("/use_session", function (request, response) {
    if(typeof request.session.id !=`undefined`){
        response.send(Date())
    }else{
        response.send(`First time`)
    }
    session.destroy()
});

app.use(myParser.urlencoded({ extended: true }));
var filename = 'user_name.json';

//check if file exists
if (fs.existsSync(filename)) {

    stats = fs.statSync(filename);

    console.log(filename + ' has ' + stats.size + ' characters');

    data = fs.readFileSync(filename, 'utf-8');

    users_reg_data = JSON.parse(data);

    // username = 'newuser';
    // users_reg_data[username] = {};
    // users_reg_data[username].password = 'newpass';
    // users_reg_data[username].email = 'newuser@user.com';

    // fs.writeFileSync(filename, JSON.stringify(users_reg_data));

    console.log(users_reg_data);
} else {
    console.log(filename + ' does not exist');
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
    console.log(request.body);
    the_username = request.body.username;
    response.cookie(`username`,the_username)
    if (request.cookies.username != 'undefined') {
        //if username exists, get password 
        response.send(`welcome ${request.cookies.username}`)
    }
     else {
            //send user back to login
            response.send('Invalid');
        }
});

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
    var password = request.body.password;
    var second_password = request.body.repeat_password;
    var username = request.body.username;
    if(typeof users_reg_data[username] == 'undefined') {
        if(password == second_password){
            username = request.body.username;
            users_reg_data[username] = {};
            users_reg_data[username].password = request.body.password;
            users_reg_data[username].email = request.body.email;

            fs.writeFileSync(filename, JSON.stringify(users_reg_data));
            response.redirect(`./login`)
        }

    }else{
        response.send(`Invalid`);
    }
});

app.get("/set_cookie", function (request, response) {
response.cookie("myname",`Kai`);
response.send(`cookie sent!`)
});

app.get("/use_cookie", function (request, response) {
    console.log(request.cookies);
        thename = `ANONYMOUSE`
    if(typeof request.cookies[`myname`] != `undefined`){
        thename = request.cookie[`myname`]
    response.send(`Welcome to the Cookie page ${thename}`)        
    }else{
        response.redirect(`./set_cookie`);
    }

    });

app.listen(8080, () => console.log(`listening on port 8080`));