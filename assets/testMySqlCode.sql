SELECT title FROM role;


SELECT employees.emp_id, employees.first_name, employees.last_name, role.title, role.role_id FROM employees
LEFT JOIN role ON employees.role_id=role.role_id;


UPDATE employees
SET role_id = 2
WHERE emp_id = 1;


SELECT employees.emp_id, employees.first_name, employees.last_name, role.title, role.role_id FROM employees
INNER JOIN role ON employees.role_id=role.role_id;


SELECT role_id, title, salary FROM role;

DELETE FROM employees WHERE emp_id = 8;


BEGIN;
INSERT INTO employees (first_name, last_name)
VALUES ("Raleigh", "Chesney", (select id from );
INSERT INTO role ()
VALUES ("Coder");
COMMIT;

BEGIN;
INSERT INTO users (username, password)
  VALUES('test', 'test');
INSERT INTO profiles (userid, bio, homepage) 
  VALUES(LAST_INSERT_ID(),'Hello world!', 'http://www.stackoverflow.com');
COMMIT;

SELECT employees.emp_id, employees.first_name, employees.last_name, role.title, department.name, role.salary, concat(managers.first_name , " " , managers.last_name) AS "manager"
FROM employees
LEFT JOIN employees AS managers ON employees.manager_id=managers.emp_id
INNER JOIN role ON employees.role_id=role.role_id
INNER JOIN department ON role.dept_id=department.dept_id;

SELECT employees.emp_id, employees.first_name, employees.last_name, role.title FROM employees
INNER JOIN role ON employees.role_id=role.role_id
INNER JOIN department ON role.dept_id=department.dept_id
WHERE department.name = "engineering";

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employees;