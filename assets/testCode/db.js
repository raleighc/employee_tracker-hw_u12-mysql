const mysql = require("mysql");
const util = require("util");

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

connection.connect();
connection.query = util.promisify(connection.query);

class DB {
  constructor(connection) {
    this.connection = connection;
  }
  viewAllEmployees() {
    console.log("");
    return this.connection.query(
      `SELECT employees.emp_id, employees.first_name, employees.last_name, role.title,
      department.name, role.salary,
      concat(managers.first_name , " " , managers.last_name) AS "manager"
      FROM employees LEFT JOIN employees AS managers ON employees.manager_id=managers.emp_id
      INNER JOIN role ON employees.role_id=role.role_id
      INNER JOIN department ON role.dept_id=department.dept_id ORDER BY employees.emp_id asc;`
    );
  }
  allDeptNames() {
      return this.connection.query(`SELECT name FROM department;`, (err, result) =>{
          if(err) throw err;
          const departmentsArray = [];
          for (let i = 0; i < result.length; i++) {
              departmentsArray.push(result[i].department);
          }
      });
  }
  viewByDept() {
    console.log("");
    return this.connection.query(
      `SELECT employees.emp_id, employees.first_name, employees.last_name, role.title
        FROM employees
        INNER JOIN role ON employees.role_id=role.role_id
        INNER JOIN department ON role.dept_id=department.dept_id
        WHERE department.name = ?;`
    );
  }
  endConnection() {
    console.log("...your connection has been severed.");
    this.connection.end();
  }
}
module.exports = new DB(connection);
