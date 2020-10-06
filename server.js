const inquirer = require("inquirer");
const cTable = require("console.table");
const fs = require("fs");
const db = require("./db.js");

function begin() {
  inquirer
    .prompt({
      name: "iWouldLikeTo",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "Add Role",
        "Removed Role",
        "Exit",
      ],
    })
    .then(function (answer) {
      if (answer.iWouldLikeTo === "View All Employees") {
        viewAllEmployees();
      } else if (answer.iWouldLikeTo === "Exit") {
        endConnection();
      }
    });
}
async function findAllEmployees() {
  const allEmployees = await db.viewAllEmployees();
  console.table(allEmployees);
}


async function endConnection() {
    const end = await db.endConnection();
    end;
  }
  


// begin();
// function readDepartment() {
//   console.log("Selecting all departments...\n");
//   connection.query("SELECT * FROM department", function (err, res) {
//     if (err) throw err;
//     // Log all results of the SELECT statement
//     console.table(res);
//   });
// }

//   function readRole() {
//     console.log("Selecting all roles...\n");
//     connection.query("SELECT * FROM role", function(err, res) {
//       if (err) throw err;
//       // Log all results of the SELECT statement
//       console.table(res);
//     });
//   }

//   function readEmployee() {
//     console.log("Selecting all employees...\n");
//     connection.query("SELECT * FROM employees", function(err, res) {
//       if (err) throw err;
//       // Log all results of the SELECT statement
//       console.table(res);
//       endConnection();
//     });
//   }

