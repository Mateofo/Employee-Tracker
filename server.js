const mysql = require("mysql");
const inquirer = require("inquirer");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "grey112",
    database: "employees_db",
});

async function queryRole() {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM role", function (err, results) {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

async function queryEmployee() {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM employee", function (err, results) {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

function init() {
    inquirer
        .prompt({
            name: "initialQuestion",
            type: "list",
            message: "What do you want to do?",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role",
                "EXIT",
            ],
        })
        .then((answers) => {
            switch (answers.initialQuestion) {
                case "view all departments":
                    viewAllDepartments();
                    break;
                case "view all roles":
                    viewAllRoles();
                    break;
                case "view all employees":
                    viewAllEmployees();
                    break;
                case "add a department":
                    addDepartment();
                    break;
                case "add a role":
                    addRole();
                    break;
                case "add an employee":
                    addEmployee();
                    break;
                case "update an employee role":
                    updateEmployeeRole();
                    break;
                case "EXIT":
                    db.end();
                    break;
            }
        });
}

function viewAllDepartments() {
    db.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.log("Viewing all departments");
        console.table(res);
        init();
    });
}

function viewAllRoles() {
    db.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.log("Viewing all roles");
        console.table(res);
        init();
    });
}

function viewAllEmployees() {
    db.query("SELECT e1.first_name, e1.last_name, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM employee e1 INNER JOIN employee e2 ON e1.manager_id = e2.id", function (err, res) {
        if (err) throw err;
        console.log("Viewing all employees");
        console.table(res);
        init();
    });
}

function addDepartment() {
    // Ask the user for the department name
    inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: "What will be the department name?",
    }).then((answers) => {
        db.query("INSERT INTO department SET ?",
            {
                name: answers.departmentName,
            },
            function (err) {
                if (err) throw err;
                init();
            }
        );
    });
}

function addRole() {
    // Implement this function
}

async function addEmployee() {
    const roles = await queryRole();
    console.log(roles);
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?",
        },
        {
            name: "roleId",
            type: "list",
            message: "What is the employee's role?",
            choices: roles.map((role) => ({ name: role.title, value: role.id })),
        },
        {
            name: "managerId",
            type: "input",
            message: "What is the employee's manager id?",
        },
    ]).then((answers) => {
        db.query("INSERT INTO employee SET ?",
            {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.roleId,
                manager_id: answers.managerId,
            },
            function (err) {
                if (err) throw err;
                init();
            }
        );
    });
}

async function updateEmployeeRole() {
    const employees = await queryEmployee();
    const roles = await queryRole();
    inquirer.prompt([
        {
            name: "employeeToUpdate",
            message: "Which employee would you like to update?",
            type: "list",
            choices: employees.map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
        },
        {
            name: "roleId",
            type: "list",
            message: "What will be the updated role?",
            choices: roles.map((role) => ({ name: role.title, value: role.id })),
        },
    ]).then((answers) => {
        db.query("UPDATE employee SET ? WHERE ?",
            [
                {
                    role_id: answers.roleId,
                },
                {
                    id: answers.employeeToUpdate,
                },
            ],
            function (err) {
                if (err) throw err;
                init();
            }
        );
    });
}

init();
