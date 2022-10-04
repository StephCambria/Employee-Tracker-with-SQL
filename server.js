const inquirer = require("inquirer");
const express = require("express");
const app = express();
const mysql = require("mysql");
const consoleTable = require("console.table");
const PORT = process.env.PORT || 3306;

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "team_db",
});

connection.connect(function (err) {
  if (err) throw err;
  app.listen(PORT, () => {
    console.log("Now listening...");
  });

  runPrompts();
});

//runPrompts
function runPrompts() {
  inquirer
    .prompt([
      {
        name: "runPrompts",
        type: "list",
        message: "What would you like to do? Use arrow keys to select.",
        choices: [
          "View Employees",
          "View Departments",
          "View Roles",
          "Add an Employee",
          "Add a Department",
          "Add a Role",
          "Update an Employee's Role",
          "Nothing",
        ],
      },
    ])
    .then(function (answer) {
      switch (answer.runPrompts) {
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
          exit();
          console.log("Goodbye");
          break;
      }
    });
}

// View Employees
function viewEmployees() {
  let query = "SELECT * FROM employee";
  connection.query(query, function (err, answer) {
    if (err) throw err;
    console.log("Viewing all employees");
    console.table(answer);
    runPrompts();
  });
}

// View Employees by Department
function viewByDepartment() {
  let query = "SELECT * FROM department";
  connection.query(query, function (err, answer) {
    if (err) throw err;
    console.log("Viewing all departments");
    console.table(answer);
    runPrompts();
  });
}

// View Employees by Role
function viewByRole() {
  let query = "SELECT * FROM role";
  connection.query(query, function (err, answer) {
    if (err) throw err;
    console.log("Viewing all roles");
    console.table(answer);
    runPrompts();
  });
}

// Add an Employee
function addEmployee() {
  connection.query("SELECT * FROM role", function (err, answer) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "Please enter the employee's first name.",
        },
        {
          name: "last_name",
          type: "input",
          message: "Please enter the employee's last name.",
        },
        {
          name: "manager_id",
          type: "number",
          message: "Please enter the employee's manager's ID.",
        },
        {
          name: "role",
          type: "list",
          choices: function () {
            let roles = [];
            for (let i = 0; i < answer.length; i++) {
              roles.push(answer[i].title);
            }
            return roles;
          },
          message: "Please choose the employee's role.",
        },
      ])
      .then(function (answer) {
        let role_id;
        for (let x = 0; x < answer.length; x++) {
          if (answer[x].title == answer.role) {
            role_id = answer[x].id;
            console.log(role_id);
          }
        }
      }).then(function (answer) {
        connection.query(
        "INSERT INTO employee SET ?", {
            first_name: answer.first_name,
            last_name: answer.last_name,
            manager_id: answer.manager_id,
            role_id: answer.role,
        }
      );
      console.log("Employee added");
      runPrompts();
  });
})
}
// Add a Department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "Please enter the new department name.",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department VALUES (DEFAULT, ?)",
        [answer.newDepartment],
        function (err) {
          if (err) throw err;
          console.log("Department added");
          runPrompts();
        }
      );
    });
}

// Add a Role
function addRole() {
    inquirer
    .prompt([
      {
        name: "newRole",
        type: "input",
        message: "Please enter the name of the new role.",
      },
      {
        name: "salary",
        type: "number",
        message: "Please enter the salary for this role.",
      },
      {
        name: "department_id",
        type: "number",
        message: "Please enter the department ID for this role."
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
            title: answer.newRole,
            salary: answer.salary,
            department_id: answer.department_id,
        },
        function (err) {
          if (err) throw err;
          console.log("Role added");
          runPrompts();
        }
      );
    });
}

// Update an Employee's Role
function updateEmployeeRole() {
  connection.query("SELECT * FROM employee", function (error, answer) {
    if (error) throw error;
    inquirer
      .prompt([
        {
          name: "allEmployees",
          type: "list",
          choices: function () {
            let employeeArray = [];
            for (i = 0; i < answer.length; i++) {
              employeeArray.push(answer[i].last_name);
            }
            return employeeArray;
          },
          message: "Select the employee to update",
        },
      ])
      .then(function (answer) {
        const update = answer.allEmployees;
        connection.query("SELECT * FROM employee", function (error, answer) {
          if (error) throw error;
          inquirer
            .prompt([
              {
                name: "role",
                type: "list",
                choices: function () {
                  let roles = [];
                  for (i = 0; i < answer.length; i++) {
                    roles.push(answer[i].role_id);
                  }
                  return roles;
                },
                message: "Select the employee's new role",
              },
            ])
            .then(function (answer) {
              connection.query("UPDATE employee VALUES ? WHERE last_name = ?", [
                {
                  role_id: answer.role,
                },
                update,
              ]);
              console.log("Employee Role Updated");
              runPrompts();
            });
        });
      });
  });
}

// Nothing
function exit() {
  connection.end();
}
