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

     start();
});