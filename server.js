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
        // "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        // "Update Employee Manager",
        "View All Roles",
        "Add Role",
        "Remove Role",
        "View All Departments",
        "Add Department",
        "Remove Department",
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
      } else if (answer.iWouldLikeTo === "Remove Employee") {
        removeEmployee();
      } else if (answer.iWouldLikeTo === "Update Employee Role") {
        updateEmployeeRole();
      } else if (answer.iWouldLikeTo === "View All Roles") {
        viewAllRoles();
      } else if (answer.iWouldLikeTo === "Add Role") {
        addRole();
      } else if (answer.iWouldLikeTo === "Remove Role") {
        removeRole();
      } else if (answer.iWouldLikeTo === "View All Departments") {
        viewAllDepartments();
      } else if (answer.iWouldLikeTo === "Add Department") {
        addDepartment();
      } else if (answer.iWouldLikeTo === "Remove Department") {
        removeDepartment();
      } else if (answer.iWouldLikeTo === "Exit") {
        endConnection();
      }
    });
}

function viewAllEmployees() {
  console.log("");
  connection.query(
    `SELECT employees.emp_id, employees.first_name, employees.last_name, role.title, department.name, role.salary,
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
      //   console.log(result[i])
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
  connection.query(`SELECT title, role_id FROM role;`, (err, results) => {
    if (err) throw err;
    const rolesArray = [];
    for (let i = 0; i < results.length; i++) {
      const roleID = {
        name: results[i].title,
        value: results[i].role_id,
      };
      rolesArray.push(roleID);
      //   console.log(roleID);
    }
    inquirer
      .prompt([
        {
          name: "first",
          type: "input",
          message: "What is the employee's first name?",
        },
        {
          name: "last",
          type: "input",
          message: "What is the employee's last name?",
        },
        {
          name: "jobTitle",
          type: "list",
          message: "What is the employee's role?",
          choices: rolesArray,
        },
      ])
      .then((info) => {
        // console.log(info.jobTitle);
        connection.query(
          `INSERT INTO employees (first_name, last_name, role_id)
            VALUES (?, ?, ?);`,
          [info.first, info.last, info.jobTitle],
          (err, res) => {
            if (err) throw err;
            console.log("You've added a new Employee. \n");
            begin();
          }
        );
      });
  });
}

function removeEmployee() {
  connection.query(
    `SELECT first_name, last_name, emp_id FROM employees;`,
    (err, results) => {
      if (err) throw err;
      const empArray = [];
      for (let i = 0; i < results.length; i++) {
        const empID = {
          name: results[i].first_name + " " + results[i].last_name,
          value: results[i].emp_id,
        };
        empArray.push(empID);
          
      }
    //   console.log(empArray);
      inquirer
        .prompt([
          {
            name: "employeeToDelete",
            type: "list",
            message: "Which employee would you like to remove?",
            choices: empArray,
          },
        ])
        .then((info) => {
          // console.log(info);
          connection.query(
            `DELETE FROM employees
            WHERE emp_id = ?;`,
            [info.employeeToDelete],
            (err, res) => {
              if (err) throw err;
              console.log("\nYou've removed a problem employee. \n");
              begin();
            }
          );
        });
    }
  );
}

function updateEmployeeRole() {
  connection.query(
    `SELECT employees.emp_id, employees.first_name, employees.last_name, role.title, role.role_id FROM employees
    LEFT JOIN role ON employees.role_id=role.role_id;`,
    (err, results) => {
      if (err) throw err;
      const empArray = [];
      const roleArray = [];
      for (let i = 0; i < results.length; i++) {
        // console.log(results);
        const empID = {
          name: results[i].first_name + " " + results[i].last_name,
          value: results[i].emp_id,
        };
        empArray.push(empID);
      }
      connection.query(`SELECT role_id, title, salary FROM role;`, (err, results) => {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            const roleID = {
                name: results[i].title,
                value: results[i].role_id,
              };
              roleArray.push(roleID);
        }
      });
    //   console.log(empArray);
        // console.log(roleArray);
      inquirer.prompt([
        {
          name: "employeeToChange",
          type: "list",
          message: "Which employee's role would you like to change?",
          choices: empArray,
        },
        {
            name: "employeeRoleEdit",
            type: "list",
            message: "Which role should this employee have?",
            choices: roleArray,
          },
      ]).then((info) => {
        //   console.log(info);
          connection.query(
            `UPDATE employees
            SET role_id = ?
            WHERE emp_id = ?;`,
            [info.employeeRoleEdit, info.employeeToChange],
            (err, res) => {
              if (err) throw err;
              console.log("\nYou've changed the employee's role. \n");
              begin();
            }
          );
        });
    }
  );
}

function viewAllRoles() {
  console.log("");
  connection.query(`SELECT role_id, title, salary FROM role;`, (err, res) => {
    if (err) throw err;
    console.table(res);
    //   console.log(empArray);
    begin();
  });
}

function addRole() {
  connection.query(`SELECT name, dept_id FROM department;`, (err, results) => {
    if (err) throw err;
    const deptArray = [];
    for (let i = 0; i < results.length; i++) {
      const deptID = {
        name: results[i].name,
        value: results[i].dept_id,
      };
      deptArray.push(deptID);
      //   console.log(roleID);
    }
    inquirer
      .prompt([
        {
          name: "roleName",
          type: "input",
          message: "What role would you like to add?",
        },
        {
          name: "roleSalary",
          type: "input",
          message: "What is this role's annual salary?",
        },
        {
          name: "deptConnection",
          type: "list",
          message: "What department is this position in?",
          choices: deptArray,
        },
      ])
      .then((info) => {
        // console.log(info.jobTitle);
        connection.query(
          `INSERT INTO role (title, salary, dept_id)
                VALUES (?, ?, ?);`,
          [info.roleName, info.roleSalary, info.deptConnection],
          (err, res) => {
            if (err) throw err;
            console.log("You've added a new role. \n");
            begin();
          }
        );
      });
  });
}

function removeRole() {
  connection.query(`SELECT title, role_id FROM role;`, (err, results) => {
    if (err) throw err;
    const roleArray = [];
    for (let i = 0; i < results.length; i++) {
      const roleID = {
        name: results[i].title,
        value: results[i].role_id,
      };
      roleArray.push(roleID);
    }
    // console.log(roleArray);
    inquirer
      .prompt([
        {
          name: "roleToDelete",
          type: "list",
          message: "Which role would you like to remove?",
          choices: roleArray,
        },
      ])
      .then((info) => {
        // console.log(info);
        connection.query(
          `DELETE FROM role
              WHERE role_id = ?;`,
          [info.roleToDelete],
          (err, res) => {
            if (err) throw err;
            console.log("\nYou've removed a role. \n");
            begin();
          }
        );
      });
  });
}

function viewAllDepartments() {
  console.log("");
  connection.query(`SELECT dept_id, name FROM department;`, (err, res) => {
    if (err) throw err;
    console.table(res);
    //   console.log(empArray);
    begin();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "deptName",
        type: "input",
        message: "What department would you like to add?",
      },
    ])
    .then((info) => {
      // console.log(info.jobTitle);
      connection.query(
        `INSERT INTO department (name)
                VALUES (?);`,
        [info.deptName],
        (err, res) => {
          if (err) throw err;
          console.log("You've added a new department. \n");
          begin();
        }
      );
    });
}

function removeDepartment() {
  connection.query(`SELECT name, dept_id FROM department;`, (err, results) => {
    if (err) throw err;
    const deptArray = [];
    for (let i = 0; i < results.length; i++) {
      const deptID = {
        name: results[i].name,
        value: results[i].dept_id,
      };
      deptArray.push(deptID);
    }
    // console.log(deptArray);
    inquirer
      .prompt([
        {
          name: "deptToDelete",
          type: "list",
          message: "Which department would you like to remove?",
          choices: deptArray,
        },
      ])
      .then((info) => {
        // console.log(info);
        connection.query(
          `DELETE FROM department
              WHERE dept_id = ?;`,
          [info.deptToDelete],
          (err, res) => {
            if (err) throw err;
            console.log("\nYou've removed a department. \n");
            begin();
          }
        );
      });
  });
}

function endConnection() {
  console.log(
    "\nThanks for building and maintaining your team.\n...your connection has been severed. \n"
  );
  connection.end();
}