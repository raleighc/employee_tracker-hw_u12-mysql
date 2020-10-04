const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const fs = require("fs");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "NewRalE88?",
    database: "tracker_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readDepartment();
    readRole();
    readEmployee();
  });

  function readDepartment() {
    console.log("Selecting all departments...\n");
    connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
    });
  }
  
  function readRole() {
    console.log("Selecting all roles...\n");
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
    });
  }

  function readEmployee() {
    console.log("Selecting all employees...\n");
    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      endConnection();
    });
  }

  function endConnection() {
      console.log("...your connection has been severed.");
    connection.end();
  }