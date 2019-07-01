var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
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
            message: "What is the item_id of the item you wish to purchase? (Type 0 to quit)",
            name: "idNumber"
        },
        {
            message: "How many of this item would you like to purchase? (Type 0 to quit)",
            name: "quantity"
        }
    ]).then(answer => {
        if (answer.idNumber <= 0) {
            console.log("Thanks for using bamazon!");
            connection.end();
        } else {
            var item = data[answer.idNumber - 1];
            if (item.stock_quantity < answer.quantity) {
                console.log("Insufficient quantity!");
                displayProducts();
            } else {
                var totalPrice = item.price * answer.quantity;
                var newQuantity = item.stock_quantity - answer.quantity;
                console.log(`You have purchased ${answer.quantity} ${item.product_name} for $${totalPrice}!`);
                updateDB(newQuantity, totalPrice, answer.idNumber);
            }
        }
    })
};

function updateDB(newQuantity, totalPrice, itemId) {
    connection.query("update products set ? where ?",
        [
            {
                stock_quantity: newQuantity,
                product_sales: totalPrice
            },
            {
                item_id: itemId
            }], function (err, res) {
                if (err) throw err;
                displayProducts();
            });
};

connection.connect(err => {
    if (err) throw err;
    displayProducts();
});