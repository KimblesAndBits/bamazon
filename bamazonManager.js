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
                console.log("Add to inventory");
                managerView();
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