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

function addItem() {
    inquirer.prompt([
        {
            message: "What is the item's name?",
            name: "itemName"
        },
        {
            message: "What department is the item in?",
            name: "itemDept"
        },
        {
            message: "What is the price of the item?",
            name: "itemPrice"
        },
        {
            message: "How many of this item are available?",
            name: "itemQuantity"
        }
    ]).then(answer => {
        connection.query("insert into products set ?",
            [
                {
                    product_name: answer.itemName,
                    department_name: answer.itemDept,
                    price: answer.itemPrice,
                    stock_quantity: answer.itemQuantity
                }
            ], function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " item added to bamazon.");
                managerView();
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
                addItem();
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