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
          break;
      }
    });
}

// View Employees
function viewEmployees() {
  connection.query(
    "SELECT e.employee_id, e.first_name, e.last_name, role.role_title, department.department_name, role.salary, CONCAT(m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.employee_id JOIN role ON e.role_id = role.role_id JOIN department ON department.department_id = role.department_id ORDER BY e.employee_id ASC",
    (err, answer) => {
      if (err) throw err;
      console.log("Viewing all employees");
      console.table(answer);
      runPrompts();
    }
  );
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
  connection.query("SELECT * FROM role", function (err, answer) {
    if (err) throw err;
    let roles = answer.map((role) => ({
      name: role.role_title,
      value: role.role_id,
    }));
    connection.query("SELECT * FROM employee", (err, answer) => {
      if (err) throw err;
      let employees = answer.map((employee) => ({
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
            choices: roles,
          },
          {
            name: "manager",
            type: "rawlist",
            message: "Who is the new employee's manager?",
            choices: employees,
          },
        ])
        .then((answer) => {
          connection.query(
            "INSERT INTO employee SET ?",
            {
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
            "INSERT INTO role SET ?",
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
        "INSERT INTO department SET ?",
        {
          department_name: answer.newDepartment,
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
  connection.query("SELECT * FROM department", (err, answer) => {
    if (err) throw err;
    let departments = answer.map((department) => ({
      name: department.department_name,
      value: department.department_id,
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
          choices: departments,
        },
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            role_title: answer.newRole,
            salary: answer.salary,
            department_id: answer.department_name,
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

// Update an Employee's Role
function updateEmployeeRole() {
  connection.query("SELECT * FROM employee", function (err, answer) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employeeUpdate",
          type: "list",
          choices: function () {
            let employeeArray = [];
            for (i = 0; i < answer.length; i++) {
              employeeArray.push(answer[i].last_name);
            }
            return employeeArray;
          },
          message: "Which employee should be updated?",
        },
      ])
      .then(function (answer) {
        const employeeUpdate = answer.employeeUpdate;

        connection.query("SELECT * FROM role", function (err, answer) {
          if (err) throw err;
          inquirer
            .prompt([
              {
                name: "roleUpdate",
                type: "list",
                choices: function () {
                  var roleArray = [];
                  for (i = 0; i < answer.length; i++) {
                    roleArray.push(answer[i].role_id);
                  }
                  return roleArray;
                },
                message: "What is the employee's new role ID?",
              },
            ])
            .then(function (answer) {
              connection.query("UPDATE employee SET ? WHERE last_name = ?", [
                {
                  role_id: answer.roleUpdate,
                },
                employeeUpdate,
              ]),
                console.log("Employee information updated");
              runPrompts();
            });
        });
      });
  });
}

// Nothing
function exit() {
  console.log("Goodbye!");
}
