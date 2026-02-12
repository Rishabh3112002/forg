const {createProject} = require('../core/python/project');
const {createPsqlDatabase, createMysqlDatabase} = require('../core/database/psql');

module.exports = async (name, lang, options) => {
    console.log(`Initializing ${name}...`);
    const dbEngine = options.engine;
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

    if (dbEngine && dbEngine.toLowerCase() === 'psql') {
        await createPsqlDatabase({...options});
    } else if (dbEngine && dbEngine.toLowerCase() === 'mysql') {
        await createMysqlDatabase({...options});
    }
    console.log(`Initialized ${name}`);
};
