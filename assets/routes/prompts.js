const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const fs = require("fs");

const questions = [
    {
      type: "list",
      message: "Pick an item.",
      choices: "POST, BID, EXIT",
      name: "auctionItems",
    },
  ];

  Questions I need to include in my prompts

  What would you like to do?
    -view all employees
    -view all employees by department
        -sales
        -engineering
        -finance
        -legal
    -view all employees by manager
        -list of all managers
    -add employee
        -employee first name
        -last name
        -role
        -manager
    -update employee role
    -update employee manager
    -view all roles
    -add role
    -remove role


    