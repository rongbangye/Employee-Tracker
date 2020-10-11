const mysql = require("mysql2");
const inquirer = require("inquirer");

/**
 * Creates the connection to database
 */
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Supreme123",
  database: "employee_DB",
});

/**
 * connect to the mysql server and sql database
 */
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  // run the start function after the connection is made to prompt the user
  mainPrompt();
});

/**
 * Function of view all departments
 */
function viewAllDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    mainPrompt();
  });
}

/**
 * Function of view all roles
 */
function viewAllRoles() {
  connection.query(`SELECT * FROM role`, function (err, res) {
    if (err) throw err;
    console.table(res);
    mainPrompt();
  });
}

/**
 * Function to view all Employees
 * READ all, SELECT * FROM
 */
function viewAllEmployee() {
  connection.query(
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON d.id = r.department_id
    LEFT JOIN employee m ON m.id = e.manager_id`,
    function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      mainPrompt();
    }
  );
}

/**
 * Add an Role Function
 */
function addRole() {
  inquirer
    .prompt([
      {
        message: "Add a new Role, enter title:",
        type: "input",
        name: "title",
      },
      {
        message: "enter salary",
        type: "number",
        name: "salary",
      },
      {
        message: "enter department ID:",
        type: "number",
        name: "department_id",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO role (title, salary, department_id) values (?, ?, ?)",
        [answer.title, answer.salary, answer.department_id],
        function (err, data) {
          if (err) throw err;
          console.log("Great!! You have successfully inserted a new Role");
          mainPrompt();
        }
      );
    });
}

/**
 * Add Employee Function
 */
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      {
        type: "number",
        name: "role_id",
        message: "What is the employee's role ID?",
      },
      {
        type: "number",
        name: "manager_id",
        message: "What is the employee's manager ID",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [
          answer.first_name,
          answer.last_name,
          answer.role_id,
          answer.manager_id,
        ],
        function (err, data) {
          if (err) throw err;
          console.table("Successfully Inserted");
          mainPrompt();
        }
      );
    });
}

/**
 * update an employee role
 */
function updateEmployeeRole() {
  console.log("Updating a employee's Role...\n");
  inquirer
    .prompt([
      {
        message: "which employee would you like to update?",
        type: "input",
        name: "name",
      },
      {
        message: "enter the new role id:",
        type: "number",
        name: "role_id",
      },
    ])
    .then(function (answer) {
      connection.query(
        "UPDATE employee SET role_id = ? WHERE first_name",
        [answer.role_id, answer.name],
        function (err, data) {
          if (err) throw err;
          console.table(data);
          mainPrompt();
        }
      );
    });
}

function mainPrompt() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "start",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a role",
        "add an employee",
        "update an employee role",
        "Exit",
      ],
    })
    .then(function (res) {
      switch (res.start) {
        case "view all departments":
          viewAllDepartments();
          break;

        case "view all roles":
          viewAllRoles();
          break;

        case "view all employees":
          viewAllEmployee();
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

        case "Exit":
          console.log("end");
          connection.end();
          break;
      }
    });
}
