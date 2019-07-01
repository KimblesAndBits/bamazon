var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

class Department {
    constructor(id, name, over, sales, profit) {
        this.department_id = id;
        this.department_name = name;
        this.overhead_costs = over;
        this.product_sales = sales;
        this.total_profits = profit;
    }
} 

function productSales() {
    connection.query("select departments.department_id, departments.department_name, departments.overhead_costs, products.product_sales, products.product_sales - departments.overhead_costs as total_profits from departments left join products on products.department_name = departments.department_name",
    function (err, res) {
        if (err) throw err;
        var depts = [];
        res.forEach(element => {
            if (element.department_id > depts.length) {
                var dept = new Department(element.department_id, element.department_name, element.overhead_costs, element.product_sales, element.total_profits);
                depts.push(dept);
            } else {
                depts[element.department_id - 1].product_sales += element.product_sales;
                depts[element.department_id - 1].total_profits = depts[element.department_id - 1].product_sales - depts[element.department_id - 1].overhead_costs;
            };
        });
        console.table(depts);
        supervisorView();
    });
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
                    productSales();
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