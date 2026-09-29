const express = require('express');
const mysql = require('mysql2/promise');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const app = express();
const port = 3000;

const keyVaultName = "kv-enterprise-prod-01";
const url = `https://${keyVaultName}.vault.azure.net`;

async function getDbPassword() {
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(url, credential);
    const secret = await client.getSecret("db-password");
    return secret.value;
}

app.get('/api/health', async (req, res) => {
    try {
        const dbPassword = await getDbPassword();
        
        const connection = await mysql.createConnection({
            host: '10.0.3.4', // Private IP الخاص بـ vm-db-01
            user: 'appuser',
            password: dbPassword,
            database: 'appdb'
        });

        const [rows] = await connection.query('SELECT NOW() AS currentTime');
        await connection.end();

        res.json({
            status: 'Success',
            message: 'Connected to Key Vault & MySQL successfully!',
            dbTime: rows[0].currentTime
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: error.message
        });
    }
});

app.listen(port,'0.0.0.0', () => {
    console.log(`App running on port ${port}`);
});
