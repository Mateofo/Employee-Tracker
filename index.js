const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection({
    host:"127.0.0.1",
    user: "root",
    password: "gray112",
    database: "employees_db",
    port: 3306,
});

async function queryRole() {
    return new Promise((resolve, reject) => {
        db.query("select * from role", function (err, results) {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

async function queryEmployee() {
    return new Promise((resolve, reject) => {
        db.query("select * from employee", function (err, results) {
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
    db.query("select * from role", function (err, res) {
        if (err) throw err;
        console.log("Viewing all roles");
        console.table(res);
        init();
    });
}

function viewAllEmployees() {
    db.query("select * from employee", function (err, res) {
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
        console.log(answers.departmentName);
        db.query("INSERT INTO department SET ? ",
        {name: answers.departmentName},
            function (err) {
                if (err) throw err;
                init();
            }
        );
    });
}

function addRole() {
    db.query("SELECT * FROM department", function (err, departments) {
        if (err) throw err;
        const departmentChoices = departments.map((department) => department.name);

        // Ask the user for role information
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the role title?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is the role salary?",
            },
            {
                type: "list",
                name: "department",
                message: "Select the department for this role:",
                choices: departmentChoices,
            },
        ]).then((answers) => {
            const selectedDepartment = departments.find((department) => department.name === answers.department);
            const departmentId = selectedDepartment.id;

            db.query(
                "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
                [answers.title, answers.salary, departmentId],
                function (err) {
                    if (err) throw err;
                    console.log(`Added role: ${answers.title}`);
                    init();
                }
            );
        });
    });
}
    

    async function addEmployee() {
        const roles = await queryRole()
        const employee = await queryEmployee()
        console.log(roles);
        console.log(employee);
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What's your first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What's your last name?"
            },
            {
                name: "roleId",
                type: "input",
                message: "What's your role?",
                choices: res.map((role) => ({
                    name: role.title, value: role.id
                }))
            },
            {
                name: "manageId",
                type: "input",
                message: "What's your manager id?"
            },
            ])
            .then((answers) => {
                db.query("INSERT INTO employee SET? ",
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
        const employee = await queryEmployee();
        const roles = await queryEmployee();
        inquirer.prompt([
            {
                name: "employeeToUpdate",
                message: " Which employee do you want to update?",
                type: "list",
                choices: employee.map((employee) => ({ name: employee.first_name + "" + employee.last_name , value: employee.id})),
    
            },
            {
                name: "roleId",
                type: "list",
                message: " What is the updated role?",
                choices: roles.map((role) => ({ name: role.title, value: role.id }))
            },
        ]).then((answers) => {
            db.query("UPDATE employee SET ? WHERE ?",
            [
                {
                role_id: answers.roleId,
                },
                {
                id: answers.employeeToUpdate
                }
                
            ],
                function (err) {
                    if (err) throw err;
                    init();
                }
            );
    
        });
    }
    

init();
