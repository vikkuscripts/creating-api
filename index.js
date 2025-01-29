const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json()); // Parse JSON requests
app.use(cors()); // Enable CORS (optional)

// In-memory database (array for storing users)
let users = [];

// Routes

// Get all users
app.get('/users', (req, res) => {
    res.json(users);
});

// Get a single user by ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === parseInt(id));
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.json(user);
});

// Create a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const newUser = {
        id: users.length + 1,
        name,
        email,
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = users.find(u => u.id === parseInt(id));
    if (!user) {
        return res.status(404).send('User not found');
    }
    user.name = name || user.name;
    user.email = email || user.email;
    res.json(user);
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) {
        return res.status(404).send('User not found');
    }
    users.splice(index, 1);
    res.status(204).send(); // No content
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
///// database////
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost:3306',  // Replace with your database host
  user: 'root',       // Replace with your database username
  password: 'Vikr@m00',       // Replace with your database password
  database: 'test_db' // Replace with your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the database.');

  // Create the "users" table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      age INT NOT NULL,
      nationality VARCHAR(50) NOT NULL
    );
  `;

  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating table:', err.message);
      return;
    }
    console.log('Users table created or already exists.');

    // Insert sample data into the table
    const insertQuery = `
      INSERT INTO users (name, age, nationality) 
      VALUES 
        ('John Doe', 25, 'American'),
        ('Jane Smith', 30, 'Canadian'),
        ('Ravi Sharma', 28, 'Pakistani');
        ('Rossogulla Sondal', 28, 'Bangladesh');
    `;

    connection.query(insertQuery, (err, results) => {
      if (err) {
        console.error('Error inserting data:', err.message);
        return;
      }
      console.log('Sample data inserted into users table.');

      // Retrieve data from the table
      const selectQuery = 'SELECT * FROM users;';
      connection.query(selectQuery, (err, results) => {
        if (err) {
          console.error('Error retrieving data:', err.message);
          return;
        }
        console.log('Users data:', results);

        // Close the connection
        connection.end();
      });
    });
  });
});
