const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = 3000;

// Use CORS middleware to allow cross-origin requests
app.use(cors());


// IH DEV DB ENV Details
// const config = {
//     host: '10.232.65.67',
//     port: 5432,
//     database: 'invhub',
//     user: 'invhub',
//     password: 'password111111111111111'
// };

// IH QA DB ENV Details
const config= {
    host: '10.232.66.121',
    port: 5432,
    database: 'ayasdi',
    user: 'ayasdi',
    password: 'DCipwR5ITnwx'
};

app.get('/getLatestIHLoginCode', async (req, res) => {
    // Create a new PostgreSQL client instance with the provided configuration
    const client = new Client(config);
    // Define the schema as a string variable
    const schema = 'ayasdi';  // QA DB
    const useremail = 'ciaran.finnegan@netreveal.ai';  // QA DB
    //const schema = 'invhub';  // DEV DB

    try {
        // Connect to the PostgreSQL database
        await client.connect();
        // Execute the SQL query to fetch the latest login code from the specified schema
        const queryText = `SELECT code FROM ${schema}.public.login_codes lc
                           WHERE email = $1
                           ORDER BY create_date DESC LIMIT 1`;
        const dbRes = await client.query(queryText, [useremail]);
        // Extract the latest code from the query result
        const latestCode = dbRes.rows.length > 0 ? dbRes.rows[0].code : null;
        // Send the latest code as a JSON response
        res.json({ latestCode });
    } catch (error) {
        // Log any errors that occur during the query execution
        console.error('Error executing query', error.stack);
        // Send a 500 status code and error message as a JSON response
        res.status(500).json({ error: 'An error occurred while retrieving data' });
    } finally {
        // Ensure the database connection is closed
        client.end();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});