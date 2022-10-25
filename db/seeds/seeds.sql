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

INSERT INTO employee (first_name, last_name, title, department_id, salary, manager_id)
VALUES 
('Lukas', 'Horner', 'CEO', 'CEO', '200000', null),
('Saoirse', 'West', 'Sales Lead', 'Sales', '100000', 1),
('Juno', 'Lozano', 'Lead Engineer', 'Engineering', '160000', 1),
('Luis', 'Herman', 'Web Developer', 'Engineering', '130000', 2),
('Mischa', 'Henson', 'Accountant', 'Finance', '120000', 2),
('Byron', 'Riggs', 'Lawyer', 'Legal', '180000', 1);

SELECT * FROM employee;

