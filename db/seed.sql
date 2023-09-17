USE employees_DB;

INSERT INTO department (name)
VALUES 
("Sales"), 
("Engineering"), 
("Human-Resources"), 
("Finance");

INSERT INTO role (title, salary, department_id)
VALUES 
("Sales Lead", 200000, 1), 
("Sales-Representative", 120000, 1), 
("Lead Engineer", 250000, 2), 
("Software Engineer", 210000, 2), 
("Accountant", 130000, 3), 
("Human-Resources-Manager", 1650000, 4), 
("Finance-Manager", 220000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Kyle", "Beck", 1,3), 
("Jack", "Reed", 1, 3), 
("Steph", "Lisbon", 3, 3),
("Kyle", "Lowry", 4, 2), 
("Tim", "Horton", 5, 3), 
("Sean", "Combs", 6, 4), 
("Json", "Bourne", 7, 2), 
("Austin", "Frit", 8, 2), 
("Leo", "Messi", 9, 2);