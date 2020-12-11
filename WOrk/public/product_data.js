/**
By Kai Sunahara
 */
//Furniture Store
var Sofas = [
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
]
var Tables = [
{
    //Table made of Koa Wood
    "Type": "Koa Wood Table",
    "Price": "199.99",
    "Image": "./images/KoaTable.jpg",
},
]
var Chairs =[
{
    //Wood Chairs
    "Type": "Wooden Chairs",
    "Price": "69.99",
    "Image": "./images/WoodChair.jpg"
},
]
var Desks =[
{
    //Wood Desk
    "Type": "Wooden Desk",
    "Price": "399.99",
    "Image": "./images/WoodDesk.jpg"
},
]
var products ={
    "Sofas": Sofas,
    "Tables": Tables,
    "Chairs": Chairs,
    "Desks": Desks

}

//from Assignment 1 example
if(typeof module != 'undefined') {
    module.exports.products = products;
  }