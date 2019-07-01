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
            managerView();
        });
};

function lowInventory() {
    connection.query("select * from products where stock_quantity < 5",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            managerView();
        });
};

function addInventory() {
    inquirer.prompt([
        {
            message: "What is the item_id of the item for which you wish to add inventory?",
            name: "itemID"
        },
        {
            message: "How many of this item would you like to add?",
            name: "quantity"
        }
    ]).then(answer => {
        connection.query("select stock_quantity from products where ?",
            [
                {
                    item_id: answer.itemID
                }
            ],
            function (err, res) {
                if (err) throw err;
                var newQuantity = res[0].stock_quantity + parseInt(answer.quantity);
                connection.query("update products set ? where ?",
                [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        item_id: answer.itemID
                    }
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " item's quantity updated.");
                    managerView();
                })
            });
    });
};

function managerView() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do, manager?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "manChoice"
        }
    ]).then(answer => {
        switch (answer.manChoice) {
            case "View Products for Sale":
                displayProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                console.log("Add new product.");
                managerView();
                break;
            case "Exit":
                console.log("Thanks for using bamazon Manager View!");
                connection.end();
        };
    });
};

connection.connect(err => {
    if (err) throw err;
    managerView();
});