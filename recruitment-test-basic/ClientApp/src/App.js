import React, { useState, useEffect } from 'react';

//startup.cs when run opens
export default function App() { //creating function app
    const [employees, setemployees] = useState([]); // holds the list of the employees from server
    const [name, setname] = useState(''); // holds name for editing or adding new employee
    const [value, setval] = useState(''); // same but for value
    const [isEditing, setIsediting] = useState(false); // used if in editng mode (for add or edit)
    const [editingName, setEditingname] = useState(''); // for edit function this holds the name of the employee

    useEffect(() => { //calls getemployees function 
        getEmployees();
    }, []);

    async function getEmployees() { // this is a function which gets the employees from backend server
        try { //using a try and catch to check that the server is accessible and to find errors 
            const response = await fetch("/employees"); //fetch request to server
            if (!response.ok) {  //if there is an error then ... 
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); //Parse Json response 
            setemployees(data); // updates
        } catch (e) { // using catch block to handle any potential errors
            console.log("Unable to get the employees ", e);
        }
    }

    async function createEmployee() { // function I need to add to in order to create a new employee in DB
        await fetch("/employees", { //written for us uses POST method for creating new data
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, value: parseInt(value, 10) }) //converts string to integer
        });
        getEmployees(); //calls function in order to refresh the employee list 
    }

    async function updateEmployee() { // other function need to add to to edit the employee (similar to before)
        await fetch("/employees", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: editingName, value: parseInt(value, 10) })
        });
        getEmployees();
    }
// need to create a form in order for user to use UI and add/edit employee data
    const handleSubmit = (e) => { // function created to do this
        e.preventDefault();
        if (isEditing) { //if statement for when editing 
            updateEmployee(); //calls function if we are editing 
        } else {
            createEmployee(); //if we are not editing calls function to add employee
        }
        setname(''); //doing resets for all
        setval('');
        setIsediting(false); //as not editing now
    };

    const startEditing = (employee) => { //function created to start editing employee
        setEditingname(employee.name); //set name and number for employee to be edited 
        setval(employee.value);
        setIsediting(true);
    };
//for return statement this will be what is viewed and can be seen by user UI 
return (
    <div>
        <h1>Instructions</h1>
        <p>Run the Startup.cs script to view the employee list and add/update employee information.</p>
        <h2>Employee List</h2> {/* This is a subheading, create a mapping of each employee to list item, iterates over list and creates a list for each employee */}
        <ul>
            {employees.map(employee => (
                <li key={employee.name}>
                    {employee.name} - {employee.value} {/* Displays the employee's name and value. */}
                    <button onClick={() => startEditing(employee)}>Edit</button>  {/* When edit button clicked triggers startediting function */}
                </li>
            ))}
        </ul>
        {/* This is the form for adding/updating employees */}
        <form onSubmit={handleSubmit}>  {/* Input fields for employees name and value (use onChange so it updates name and value */}
            <input 
                type="text"
                value={name}
                onChange={(e) => setname(e.target.value)}
                placeholder="Name"
                disabled={isEditing}
            />
            <input 
                type="number"
                value={value}
                onChange={(e) => setval(e.target.value)}
                placeholder="Value"
            />
            <button type="submit">{isEditing ? 'Update Employee' : 'Add Employee'}</button>  {/* Creates the submit button to make the changes*/}
            {isEditing && <button onClick={() => setIsediting(false)}>Cancel</button>}  {/* Creates a cancel button for when the user wishes to cancel their edit */}
        </form>
    </div>
);
}

