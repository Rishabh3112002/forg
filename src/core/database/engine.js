const {Client} = require('pg');
const {Command} = require('commander');
const mysql = require('mysql2/promise');
const readline = require('readline');
const os = require('os');
const {spawnSync} = require('child_process');

const program = new Command();

function checkPsqlInstalled() {
    const result = spawnSync('psql', ['--version'], {
        stdio: 'ignore'
    });

    return result.status === 0;
}

function checkMysqlInstalled() {
    const command = process.platform === 'win32' ? 'where' : 'which';
    const result = spawnSync(command, ['mysql'], {stdio: 'ignore'});

    return result.status === 0;
}

async function checkMysqlServerRunning({host = 'localhost', port = 3306, user = 'root', password = ''} = {}) {
    let connection;

    try {
        connection = await mysql.createConnection({
            host,
            port,
            user,
            password
        });

        await connection.ping();
        await connection.end();

        return true;
    } catch (err) {
        return false;
    }
}

function promptPassword(query) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(query, (password) => {
            rl.close();
            resolve(password);
        });
    });
}

async function createPsqlDatabase({engine, dbName, dbUser, dbHost, dbPort}) {
    if (!checkPsqlInstalled) {
        program.error('PostgreSQL (psql) is not installed or not in PATH.');
    }
    const user = dbUser || process.env.PGUSER || os.userInfo().username || 'postgres';
    const host = dbHost || process.env.PGHOST || 'localhost';
    const port = dbPort || process.env.PGPORT || 5432;
    const password = process.env.PGPASSWORD || (await promptPassword(`Enter password for PostgreSQL user "${user}": `));

    const client = new Client({
        user: user,
        host: host,
        port: port,
        password,
        database: 'postgres'
    });

    try {
        await client.connect();
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database "${dbName}" created successfully.`);
        return {dbName, dbUser: user, dbHost: host, dbPort: port, dbPassword: password};
    } catch (err) {
        program.error(`Database creation failed: ${err}`);
    } finally {
        await client.end();
    }
}

async function createMysqlDatabase({engine, dbName, dbUser, dbHost, dbPort}) {
    if (!checkMysqlInstalled) {
        program.error('MySQL is not installed or not in PATH.');
    }
    const user = dbUser || process.env.MYSQL_USER || 'root';
    const host = dbHost || process.env.MYSQL_HOST || 'localhost';
    const port = dbPort || process.env.MYSQL_PORT || 3306;
    const password = process.env.MYSQL_PASSWORD || (await promptPassword(`Enter password for MySQL user "${user}": `));
    const isRunning = await checkMysqlServerRunning({
        host: host,
        prot: port,
        user: user,
        password: password
    });

    if (!isRunning) {
        program.error('MySQL server is not running or credentials are invalid.');
    }

    let connection;

    try {
        connection = await mysql.createConnection({
            host: host,
            port: port,
            user: user,
            password
        });
        await connection.query(`CREATE DATABASE \`${dbName}\``);
        console.log(`MySQL database "${dbName}" created successfully.`);
        return {dbName, dbUser: user, dbHost: host, dbPort: port, dbPassword: password};
    } catch (err) {
        program.error(`MySQL database creation failed: ${err}`);
    } finally {
        if (connection) await connection.end();
    }
}

module.exports = {createPsqlDatabase, createMysqlDatabase};
