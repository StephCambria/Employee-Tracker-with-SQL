// Here are all of the dependencies.
const inquirer = require("inquirer");
const express = require("express");
const app = express();
const mysql = require("mysql");
const consoleTable = require("console.table");
const PORT = process.env.PORT || 3306; // MySQL server.

// I decided to keep the connection, as well as all of the prompts and functions, in the server file.
// Mainly because for whatever reason, every time I've tried to write inquirer prompts in a seperate file from my functions, I get lost in my own code,
// even though it would probably be easier that way.
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "team_db",
});

// To run the database || mysql -u root -p
// enter password
// use team_db;
// exit;

// Running the connection.
// node server.js
connection.connect(function (err) {
  if (err) throw err;
  app.listen(PORT, () => {
    console.log("Now listening...");
  });

  runPrompts();
});

// Calling a list of every prompt function upon start up.
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
      // Using switch cases for user selection.
      switch (answer.runPrompts) {
        case "View Employees":
          viewEmployees();
          break;
        case "View Departments":
          viewDepartments();
          break;
        case "View Roles":
          viewRoles();
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
          // Originally, I had a connection.end() function here,
          // but it kept causing me errors whenever the app ran a connection query.
          // So now it's just a console message.
          console.log("Goodbye!");
          break;
      }
    });
}

// View Employees
function viewEmployees() {
  connection.query(
    // The query below will format the information from the database so it displays as:
    // employee_id || first_name || last_name || role_id || role_title || department_name || salary || manager('s last name)
    // by the employee ID in ascending order.
    "SELECT e.employee_id, e.first_name, e.last_name, role.role_id, role.role_title, department.department_name, role.salary, CONCAT(m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.employee_id JOIN role ON e.role_id = role.role_id JOIN department ON department.department_id = role.department_id ORDER BY e.employee_id ASC",
    (err, answer) => {
      if (err) throw err;
      console.log("Viewing all employees");
      console.table(answer);
      runPrompts();
    }
  );
}

// View Departments
function viewDepartments() {
  // The query below will format the information from the database so it displays as:
  // department_id || department_name
  // Because these are the only two values in the department table, no Join statements are used.
  let query = "SELECT * FROM department";
  connection.query(query, function (err, answer) {
    if (err) throw err;
    console.log("Viewing all departments");
    console.table(answer);
    runPrompts();
  });
}

// View Roles
function viewRoles() {
  // The query below will format the information from the database so it displays as:
  // role_id || role_title || salary || department_name || department_id
  // The role table is joined with the department table using the department id as a constraint / foreign key.
  let query =
    "SELECT role.role_id, role.role_title, role.salary, department.department_name, department.department_id FROM role JOIN department ON role.department_id = department.department_id";
  connection.query(query, function (err, answer) {
    if (err) throw err;
    console.log("Viewing all roles");
    console.table(answer);
    runPrompts();
  });
}

// Add an Employee
function addEmployee() {
  // Selecting all data from the role table.
  connection.query("SELECT * FROM role", function (err, answer) {
    // Using the map function to find specific information from the table.
    if (err) throw err;
    let roles = answer.map((role) => ({
      // Getting the specific data we're looking for.
      name: role.role_title,
      value: role.role_id,
    }));
    connection.query("SELECT * FROM employee", (err, answer) => {
      // Using that same map function here.
      if (err) throw err;
      let employees = answer.map((employee) => ({
        // Same idea below.
        name: employee.last_name,
        value: employee.employee_id,
      }));
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?",
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the new employee's title?",
            choices: roles, // Calling the data targeted in the role table here as a list.
          },
          {
            name: "manager",
            type: "rawlist",
            message: "Who is the new employee's manager?",
            choices: employees, // Getting the manager names from the employee table.
          },
        ])
        .then((answer) => {
          connection.query(
            "INSERT INTO employee SET ?", // Querying the new data and adding it to the employee table.
            {
              // Specifying where the user responses should go in the table.
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: answer.role,
              manager_id: answer.manager,
            },
            (err) => {
              if (err) throw err;
            }
          );
          connection.query(
            "INSERT INTO role SET ?", // Because we selected a new role, we are updating the department ID to match.
            {
              department_id: answer.department_id,
            },
            (err) => {
              if (err) throw err;
              console.log("Employee added");
              runPrompts();
            }
          );
        });
    });
  });
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
    .then((answer) => {
      connection.query(
        // Because we are simply inputting a new department name, we can use a straightforward query.
        "INSERT INTO department SET ?",
        {
          department_name: answer.newDepartment, // Telling the new data where to go in the department table.
        },
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
  // Selecting all data from the departments table.
  connection.query("SELECT * FROM department", (err, answer) => {
    if (err) throw err;
    // Using the map function to target specific data again.
    let departments = answer.map((department) => ({
      name: department.department_name,
      value: department.department_id, // The department ID is the constraint / foreign key in the role table.
    }));

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
          name: "department_name",
          type: "list",
          message: "Please choose the department that this role belongs to.",
          choices: departments, // Getting the department names from the department table.
        },
      ])
      .then((answer) => {
        connection.query(
          // Telling the user input where to do in the role table.
          "INSERT INTO role SET ?",
          {
            role_title: answer.newRole,
            salary: answer.salary,
            department_id: answer.department_name, // Because we are adding a new role, we are specifying its corresponding department ID.
          },
          function (err) {
            if (err) throw err;
            console.log("Role added");
            runPrompts();
          }
        );
      });
  });
}

// I ended up re-writing the functionality above a handful of times until I settled on the map function,
// as it was the cleanest for me to write and returned the best results.

// However, when I tried using that same method below to update employee information, I ran into countless bugs.
// For example, when I would try to tell the data where to go in the employee table (such as the new role), it WOULD go to the correct row,
// but it would also update that same row for every employee's role || if I tried to update an employee's role to accountant, for instance,
// it would make every employee's role accountant.
// When I specified to use employee IDs instead of names, my returned lists would only consist of numbers.

// Ultimately, I switched to a for loop for ease of access, even though it's not the cleanest practice.

// Update an Employee's Role
function updateEmployeeRole() {
  // Selecting all of the data in the employee table.
  connection.query("SELECT * FROM employee", function (err, answer) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employeeUpdate",
          type: "list",
          choices: function () {
            // Using a for loop to generate a list of all of the employee's last names.
            let employeeArray = [];
            for (i = 0; i < answer.length; i++) {
              employeeArray.push(answer[i].last_name); // Here is where the loop is told to only return the values in the last_name row.
            }
            return employeeArray;
          },
          message: "Which employee should be updated?",
        },
      ])
      .then(function (answer) {
        const employeeUpdate = answer.employeeUpdate; // Saving the employee name to update for later in the process.

        connection.query("SELECT * FROM role", function (err, answer) {
          if (err) throw err;
          inquirer
            .prompt([
              {
                name: "roleUpdate",
                type: "list",
                choices: function () {
                  // Using the same for loop to return a list of all role titles in the database
                  var roleArray = [];
                  for (i = 0; i < answer.length; i++) {
                    roleArray.push(answer[i].role_title); // Rendering the role IDs as a list.
                  }
                  return roleArray;
                },
                message: "What is the employee's new role title?",
              },
              {
                name: "idUpdate",
                type: "number",
                validate: function (value) {
                  // Making it so users can only input a number
                  if (isNaN(value) === false) {
                    return true;
                  }
                  return false;
                },
                // In the role table, role_id is set to auto increment, but it is not set to auto increment in the employee table.
                // This is because only one integer value can be set to auto increment in every MySQL table.
                // Because the table information will not update correctly (or at all) without an ID,
                // I am adding this input to keep the user experience simple.
                message: "What is the employee's new role ID?",
              },
            ])
            .then(function (answer) {
              // We are changing the role, not the employee, so we specify to make the changes AT the specific employee's row, but not to the actual employee.
              connection.query("UPDATE employee SET ? WHERE last_name = ?", [
                {
                  role_title: answer.roleUpdate, // Telling the updated title where to go.
                  role_id: answer.idUpdate, // Telling the updated ID where to go.
                },
                employeeUpdate, // Validation for which employee's info should be updated ^^^.
              ]),
                console.log("Employee information updated");
              runPrompts();
            });
        });
      });
  });
}
