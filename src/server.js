const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = 3000;

// Use CORS middleware to allow cross-origin requests
app.use(cors());


// IH DEV DB ENV Details
const config = {
    host: '10.232.65.67',
    port: 5432,
    database: 'invhub',
    user: 'invhub',
    password: 'password111111111111111'
};

// IH QA DB ENV Details
// const config= {
//     host: '10.232.66.121',
//     port: 5432,
//     database: 'ayasdi',
//     user: 'ayasdi',
//     password: 'DCipwR5ITnwx'
// };

app.get('/getLatestIHLoginCode', async (req, res) => {
    const client = new Client(config);

    try {
        await client.connect();
        const dbRes = await client.query('SELECT code FROM invhub.public.login_codes lc ORDER BY create_date DESC LIMIT 1');
        const latestCode = dbRes.rows[0].code;
        res.json({ latestCode });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'An error occurred while retrieving data' });
    } finally {
        client.end();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});