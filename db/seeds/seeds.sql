INSERT INTO department (department_name)
VALUES 
('CEO'),
('Sales'), 
('Engineering'), 
('Finance'), 
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES 
('CEO', "200000", 1),
('Sales Lead', '100000', 2), 
('Lead Engineer', '160000', 3),
('Web Developer', '130000', 3),
('Accountant', '120000', 4),
('Lawyer', '180000', 5);

INSERT INTO employee (first_name, last_name, role_id, title, manager_id)
VALUES 
('Lukas', 'Horner', 1, "CEO", null),
('Saoirse', 'West', 2, "Sales Lead", 1),
('Juno', 'Lozano', 3, "Lead Engineer", 1),
('Luis', 'Herman', 4, "Web Developer", 2),
('Mischa', 'Henson', 5, "Accountant", 2),
('Byron', 'Riggs', 6, "Lawyer", 1);


SELECT * FROM employee;

DELETE FROM employee
WHERE employee_id = 7;