DROP DATABASE IF EXISTS team_db;
CREATE DATABASE team_db;

USE team_db;

CREATE TABLE department (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30)
);

CREATE TABLE role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    title VARCHAR(30),
	manager_id INT,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(role_id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(employee_id)
);

DROP TABLE employee;

DROP TABLE role;

DROP TABLE department;




















