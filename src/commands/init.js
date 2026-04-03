const fs = require('fs/promises');
const path = require('path');

const {createProject} = require('../core/python/project');
const {createPsqlDatabase, createMysqlDatabase} = require('../core/database/engine');

async function writeEnv(cwd, values) {
    const envPath = path.join(cwd, '.env');
    const content = Object.entries(values)
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');
    await fs.writeFile(envPath, content + '\n');
    console.log(`.env written to ${envPath}`);
}

module.exports = async (name, options) => {
    console.log(`Initializing ${name}...`);
    lang = 'python';
    let dbEngine = options.engine;
    if (lang.toLowerCase() === 'python') {
        try {
            await createProject({
                name,
                lang,
                cwd: process.cwd()
            });
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    } else if (lang.toLowerCase() === 'node') {
        console.log('We are building a node app');
    }

    const projectDir = name === '.' ? process.cwd() : path.join(process.cwd(), name);
    if (dbEngine && dbEngine.toLowerCase() === 'psql') {
        const creds = await createPsqlDatabase({...options});
        await writeEnv(projectDir, {
            DB_ENGINE: 'psql',
            DB_NAME: creds.dbName,
            DB_USER: creds.dbUser,
            DB_HOST: creds.dbHost,
            DB_PORT: creds.dbPort,
            DB_PASSWORD: creds.dbPassword
        });
    } else if (dbEngine && dbEngine.toLowerCase() === 'mysql') {
        const creds = await createMysqlDatabase({...options});
        await writeEnv(projectDir, {
            DB_ENGINE: 'mysql',
            DB_NAME: creds.dbName,
            DB_USER: creds.dbUser,
            DB_HOST: creds.dbHost,
            DB_PORT: creds.dbPort,
            DB_PASSWORD: creds.dbPassword
        });
    }
    console.log(`Initialized ${name}`);
};
