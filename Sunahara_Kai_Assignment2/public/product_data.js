/**
By Kai Sunahara
 */
//Furniture Store
var products = [
{
    //Regular Sofa, different from Premium items
    "Type": "Regular Sofa",
    "Price": "199.99",
    "Image": "./images/RegSofa.jpg",
},
{
    //Premium Sofa, more expensive, made of leather
    "Type": "Premium Sofa",
    "Price": "399.99",
    "Image": "./images/PreSofa.jpg",
},
{
    //Table made of Koa Wood
    "Type": "Koa Wood Table",
    "Price": "199.99",
    "Image": "./images/KoaTable.jpg",
},
{
    //Wood Chairs
    "Type": "Wooden Chairs",
    "Price": "69.99",
    "Image": "./images/WoodChair.jpg"
},
{
    //Wood Desk
    "Type": "Wooden Desk",
    "Price": "399.99",
    "Image": "./images/WoodDesk.jpg"
},
];
//from Assignment 1 example
if(typeof module != 'undefined') {
    module.exports.products = products;
  }