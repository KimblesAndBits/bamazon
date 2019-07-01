var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

function productSales() {
    
};

function supervisorView() {
    inquirer.prompt(
        [
            {
                type: "list",
                message: "What would you like to do supervisor?",
                choices: ["View Product Sales by Department", "Create New Department", "Exit"],
                name: "choice"
            }
        ]).then(answer => {
            switch (answer.choice) {
                case "View Product Sales by Department":
                    console.log("Sales");
                    supervisorView();
                    break;
                case "Create New Department":
                    console.log("Create");
                    supervisorView();
                    break;
                case "Exit":
                    console.log("Thank you for using bamazon Supervisor View!");
                    connection.end();
            };
        });
};

connection.connect(err => {
    if (err) throw err;
    supervisorView();
});