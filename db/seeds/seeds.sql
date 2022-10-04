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

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Lukas', 'Horner', 1, null),
('Saoirse', 'West', 2, 1),
('Juno', 'Lozano', 3, 1),
('Luis', 'Herman', 4, 2),
('Mischa', 'Henson', 5, 2),
('Byron', 'Riggs', 6, 1);
