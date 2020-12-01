var express = require('express');
var app = express();
var cookieParser = require(`cookie-parser`);

var products_data = require('./products.json');


app.post("/get_products_data", function (request, response) {
    response.json(products_data);
});

app.use(cookieParser());

app.get("./Login", function (request, response) {
    response.cookie("username",`Kai`).send(`Cookie sent`);
});

app.get("./logout", function (request, response) {
    username = request.cookies;
    response.clearCookie("username").send(`${username} logged out!`);
});


app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));