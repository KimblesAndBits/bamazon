var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Zzros534",
    database: "bamazon"
});

function displayProducts() {
    connection.query("select * from products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            userInput(res);
        });
};

function userInput(data) {
    inquirer.prompt([
        {
            message: "What is the item_id of the item you wish to purchase?",
            name: "idNumber"
        },
        {
            message: "How many of this item would you like to purchase?",
            name: "quantity"
        }
    ]).then(answer => {
        var item = data[answer.idNumber - 1];
        if (item.stock_quantity < answer.quantity || answer.quantity < 0) {
            console.log("Insufficient quantity!");
            connection.end();
        } else {
            var totalPrice = item.price * answer.quantity;
            var newQuantity = item.stock_quantity - answer.quantity;
            console.log(`You have purchased ${answer.quantity} ${item.product_name} for $${totalPrice}!`);
            updateDB(newQuantity, answer.idNumber);
        }
    })
};

function updateDB(newQuantity, itemId) {
    connection.query("update products set ? where ?",
    [
    {
        stock_quantity: newQuantity
    },
    {
        item_id: itemId
    }],function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " item's quantity updated.");
        connection.end();
    });
};

connection.connect(err => {
    if (err) throw err;
    displayProducts();
});