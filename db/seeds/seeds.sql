INSERT INTO department (name)
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

INSERT INTO employee (first_name, last_name, title, department, salary, manager_id, role_id)
VALUES 
('Lukas', 'Horner', 'CEO', 'CEO', '200000', null, 1),
('Saoirse', 'West', 'Sales Lead', 'Sales', '100000', 1, 2),
('Juno', 'Lozano', 'Lead Engineer', 'Engineering', '160000', 1, 3),
('Luis', 'Herman', 'Web Developer', 'Engineering', '130000', 2, 4),
('Mischa', 'Henson', 'Accountant', 'Finance', '120000', 2, 5),
('Byron', 'Riggs', 'Lawyer', 'Legal', '180000', 1, 6);

SELECT * FROM employee;

