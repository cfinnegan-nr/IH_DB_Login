// Import the pg library to handle PostgreSQL connections
const { Client } = require('pg');

// Define the PostgreSQL database connection details
const dbConfig = {
    host: '10.232.65.27',
    port: 5432,
    database: 'invhub',
    user: 'invhub',
    password: 'password111111111111111',
};

// Create a new PostgreSQL client instance
const client = new Client(dbConfig);

// Function to execute the SQL query
async function fetchLatestCode() {
    try {
        // Connect to the PostgreSQL database
        await client.connect();
        console.log('Connected to the database successfully.');

        // Define the SQL query
        const query = 'SELECT code FROM invhub.public.login_codes lc ORDER BY create_date DESC LIMIT 1';

        // Execute the SQL query
        const res = await client.query(query);

        // Check if the query returned any results
        if (res.rows.length === 0) {
            console.log('No results found.');
            return;
        }

        // Assign the returned value to a variable
        const latestCode = res.rows[0].code;

        // Display the value in the console
        console.log('Latest Code:', latestCode);
    } catch (err) {
        // Handle and log any errors
        console.error('Error fetching data:', err);
    } finally {
        // Ensure the database connection is closed
        await client.end();
        console.log('Database connection closed.');
    }
}

// Run the function
fetchLatestCode();