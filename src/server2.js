/**
 * Express server for retrieving the latest IH login code from PostgreSQL database
 * This API provides a single endpoint to fetch the most recent login code for a given email
 */

const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// IH DEV DB ENV Details
// const config = {
//     host: '10.232.64.34',
//     port: 5432,
//     database: 'invhub',
//     user: 'invhub',
//     password: 'password111111111111111'
// };

// IH QA DB ENV Details
// Database configuration with connection details
const config = {
    host: '10.232.64.41',
    port: 5432,
    database: 'ayasdi',
    user: 'ayasdi',
    password: 'DCipwR5ITnwx'
};

/**
 * Create a connection pool for PostgreSQL
 * Using a pool instead of single connections improves performance by:
 * - Reusing connections instead of creating new ones for each request
 * - Managing concurrent connections efficiently
 * - Handling connection timeouts and errors automatically
 */
const pool = new Pool(config);

// Middleware to parse JSON request bodies
app.use(express.json());

/**
 * GET /getLatestIHLoginCode
 * Endpoint to retrieve the most recent login code for a specified email
 *
 * Query Parameters:
 * - email: The email address to look up (required)
 *
 * Returns:
 * - 200: Successfully retrieved the code
 * - 400: Missing email parameter
 * - 404: No login code found for the email
 * - 500: Server error
 */
app.get('/getLatestIHLoginCode', async (req, res) => {
    try {
        // Extract and validate email parameter
        const email = req.query.email;

        // Input validation
        if (!email) {
            console.warn('Request received without email parameter');
            return res.status(400).json({
                error: 'Email parameter is required',
                message: 'Please provide an email address in the query parameters'
            });
        }

        // SQL query to get the most recent code
        // Using parameterized query to prevent SQL injection
        const query = `
            SELECT code 
            FROM public.login_codes lc
            WHERE email = $1
            ORDER BY create_date DESC 
            LIMIT 1
        `;

        // Execute the query with the email parameter
        const result = await pool.query(query, [email]);

        // Check if any results were found
        if (result.rows.length === 0) {
            console.info(`No login code found for email: ${email}`);
            return res.status(404).json({
                message: 'No login code found for this email',
                email: email
            });
        }

        // Log successful retrieval (excluding sensitive data)
        console.info(`Successfully retrieved login code for email: ${email}`);

        // Return the code in the response
        res.json({
            code: result.rows[0].code,
            message: 'Login code retrieved successfully'
        });

    } catch (err) {
        // Log the error for debugging (excluding sensitive details)
        console.error('Error executing query:', err.message);

        // Send generic error response to client
        res.status(500).json({
            error: 'Internal server error',
            message: 'An error occurred while retrieving the login code'
        });
    }
});

/**
 * Start the Express server
 * Listen on the specified port and log the server URL
 */
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Press Ctrl+C to stop the server');
});

/**
 * Handle graceful shutdown
 * Properly close database connections when the server is terminated
 */
process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT signal. Shutting down gracefully...');
    try {
        await pool.end();
        console.log('Database pool has been closed');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
});

// Handle uncaught exceptions to prevent crashes
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Attempt to gracefully shutdown
    process.exit(1);
});


// Usage
// http://localhost:3000/getLatestIHLoginCode?email=rekha.john@netreveal.ai

// Example usage:
// http://localhost:3000/getLatestIHLoginCode?email=milena.mietkiewicz@netreveal.ai

// Example usage:
// http://localhost:3000/getLatestIHLoginCode?email=andrew.redmond@netreveal.ai


// Example usage:
// http://localhost:3000/getLatestIHLoginCode?email=martin.bourke@symphonyai.com


// Example usage:
// http://localhost:3000/getLatestIHLoginCode?email=aqa@fseng.net

// Example usage:
// http://localhost:3000/getLatestIHLoginCode?email=wlm-aqa-admin@fseng.net