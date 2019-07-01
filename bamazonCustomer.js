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
            userInput();
            connection.end();
        });
};

function userInput() {
    inquirer.prompt([
        {
            
        }
    ])
};

connection.connect(err => {
    if (err) throw err;
    displayProducts();
});