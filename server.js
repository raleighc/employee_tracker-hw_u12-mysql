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
  database: "tracker_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  begin();
});

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
      } else if (answer.iWouldLikeTo === "View All Employees By Department") {
        viewByDept();
      } else if (answer.iWouldLikeTo === "Add Employee") {
        addEmployee();
      } else if (answer.iWouldLikeTo === "Exit") {
        endConnection();
      }
    });
}

function viewAllEmployees() {
  console.log("");
  connection.query(
    `SELECT employees.emp_id, employees.first_name, employees.last_name, role.title,
      department.name, role.salary,
      concat(managers.first_name , " " , managers.last_name) AS "manager"
      FROM employees LEFT JOIN employees AS managers ON employees.manager_id=managers.emp_id
      INNER JOIN role ON employees.role_id=role.role_id
      INNER JOIN department ON role.dept_id=department.dept_id ORDER BY employees.emp_id asc;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      begin();
    }
  );
}

function viewByDept() {
  console.log("");
  connection.query(`SELECT name FROM department;`, (err, result) => {
    if (err) throw err;
    const departmentsArray = [];
    for (let i = 0; i < result.length; i++) {
      departmentsArray.push(result[i]);
      console.log(result[i])
    }
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Which department would you like to see employees for?",
        choices: departmentsArray,
      })
      .then(({ department }) => {
        // console.log(department);
        connection.query(
          `SELECT employees.emp_id, employees.first_name, employees.last_name, role.title
                  FROM employees
                  INNER JOIN role ON employees.role_id=role.role_id
                  INNER JOIN department ON role.dept_id=department.dept_id
                  WHERE department.name = ?;`,
          [department],
          (err, res) => {
            if (err) throw err;
            console.table(res);
            begin();
          }
        );
      });
  });
}

function addEmployee() {
    
    connection.query(`SELECT title FROM role;`, (err, result) => {
        if (err) throw err;
        const rolesArray = [];
        for (let i = 0; i < result.length; i++) {
          rolesArray.push(result[i].title);
        }
    inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "last",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "jobTitle",
            type: "list",
            message: "What is the employee's role?",
            choices: rolesArray,
        },
    ]).then((info) => {
        const associatedID = connection.query(`SELECT role-id FROM role WHERE title = ${info.jobTitle};`, (err, res) =>{
            if (err) throw err;
            console.log(res)
        })
        connection.query(
            `INSERT INTO employees (first_name, last_name, role_id)
            VALUES (?, ?, ?);`,
            [info.first, info.last, associatedID],
            (err, res) => {
              if (err) throw err;
              console.table(res);
              viewAllEmployees();
              begin();
            }
          );
    })
});
}



function endConnection() {
  console.log("...your connection has been severed.");
  connection.end();
}
