var express = require('express');
var app = express();
var myParser = require("body-parser");
const fs = require(`fs`);

app.use(myParser.urlencoded({ extended: true }));

const user_data_filename = `user_name.json`;

if ( fs.existsSync(user_data_filename)) {
    stats = fs.statSync(user_data_filename);
    console.log(`user_data.json has ${stats.size} characters`);
    var data = fs.readFileSync(user_data_filename, `utf-8`);
    user_reg_data = JSON.parse(data);
    //if user exists get their password
}

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="process_login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
     if(typeof user_reg_data[request.body.username] != `undefined`){
        if(request.body.password == user_reg_data[request.body.password]){
            response.send(`Thank you ${request.body.username} for logging in`);
        } else{
            response.send(`${request.body.password}does not exist`)
        }
    }else{
        response.send(`${request.body.username} does not exist`);
    }

});
//app.use static for login form
app.listen(8080, () => console.log(`listening on port 8080`));
