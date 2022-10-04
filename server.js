const inquirer = require('inquirer');
const mysql = require('mysql');
require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "team_db"
});

connection.connect(function (error) {
    if (error) throw error;
    app.listen(PORT, () => {
        console.log("Now listening..."); 
     })

     runPrompts();
});

//runPrompts
function runPrompts() {
    inquirer.prompt([{
        name: "runPrompts",
        type: "list",
        message: "What would you like to do? Use arrow keys to select.",
        choices: ["View Employees", "View Departments", "View Roles", "Add an Employee", "Add a Department", "Add a Role", "Update an Employee's Role", "Nothing"],
    },
    ]).then(function (answer) {
        switch(answer.runPrompts) {
            case "View Employees":
                viewEmployees();
                break;
            case "View Departments":
                viewByDepartment();
                break;
            case "View Roles":
                viewByRole();
                break;
            case "Add an Employee":
                addEmployee();
                break;
            case "Add a Department":
                addDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Update an Employee's Role":
                updateEmployeeRole();
            case "Nothing":
                connection.end();
                console.log("Goodbye");
                break;
        }
    });
}

// View Employees
function viewEmployees() {
    let query = "SELECT * FROM employee";
    connection.query(query, function(error, answer) {
        if (error) throw error;
        console.log("Viewing all employees");
        console.table(answer)
        runPrompts();
    })
}

// View Employees by Department
function viewByDepartment() {
    let query = "SELECT * FROM department";
    connection.query(query, function(error, answer) {
        if (error) throw error;
        console.log("Viewing all departments");
        console.table(answer)
        runPrompts();
    })
}

// View Employees by Role
function viewByRole() {
    let query = "SELECT * FROM role";
    connection.query(query, function(error, answer) {
        if (error) throw error;
        console.log("Viewing all roles");
        console.table(answer)
        runPrompts();
    })
}

// Add an Employee
function addEmployee() {

}

// Add a Department
function addDepartment() {

}

// Add a Role
function addRole() {

}

// Update an Employee's Role
function updateEmployeeRole() {

}