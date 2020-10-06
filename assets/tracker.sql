DROP DATABASE IF EXISTS tracker_db;

CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department (
	dept_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (dept_id)
);

CREATE TABLE role (
	role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(13,2) NOT NULL,
    dept_id INT,
    PRIMARY KEY (role_id),
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
);

CREATE TABLE employees (
	emp_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
	role_id INT,
    manager_id INT,
    PRIMARY KEY (emp_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);


SELECT employees.first_name, role.title, department.name, concat(managers.first_name , " " , managers.last_name) AS "manager"
FROM employees
LEFT JOIN employees AS managers ON employees.manager_id=managers.emp_id
INNER JOIN role ON employees.role_id=role.role_id
INNER JOIN department ON role.dept_id=department.dept_id;


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;