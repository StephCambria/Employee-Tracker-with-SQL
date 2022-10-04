INSERT INTO department (name)
VALUES ('Sales'), 
('Engineering'), 
('Finance'), 
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Lead', '100000', 1), 
('Lead Engineer', '160000', 2),
('Web Developer', '130000', 2),
('Accountant', '120000', 3),
('Lawyer', '180000', 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Saoirse'), ('West'), (1), (null),
('Juno'), ('Lozano'), (2), (null),
('Luis'), ('Herman'), (3), (2),
('Mischa'), ('Henson'), (4), (1),
('Byron'), ('Riggs'), (5), (null);