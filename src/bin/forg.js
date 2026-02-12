#!/usr/bin/env node

const {Command} = require('commander');
const pkg = require('../../package.json');

const init = require('../commands/init');

const program = new Command();

program.name('forg').description('Opinionated project setup tool').version(pkg.version);

program
    .command('init')
    .description('Initialize a new project')
    .argument('<name>', 'Project name')
    .argument('<lang>', 'Project language. Supported languages: python, node')
    .option('-e, --engine <type>', 'SQL Framework (mysql, psql)', (value) => {
        const allowed = ['mysql', 'psql'];
        const normalized = value.toLowerCase();

        if (!allowed.includes(normalized)) {
            throw new Error(`Invalid database engine: "${value}". Allowed values are: mysql, psql`);
        }

        return normalized;
    })
    .option('-d, --db-name <name>', 'Database name(Required if engine specified)')
    .option('-u, --db-user <user>', 'Database user')
    .option('-H, --db-host <host>', 'Database host')
    .option('-p, --db-port <port>', 'Database port')
    .hook('preAction', (cmd) => {
        const opts = cmd.opts();
        const dbFields = ['dbName', 'dbUser', 'dbPassword', 'dbHost', 'dbPort'];
        const anyDbFieldUsed = dbFields.some((field) => opts[field]);

        if (!opts.engine && anyDbFieldUsed) {
            throw new Error('Database options (--db-name, --db-user, etc.) require --database');
        }
        if (opts.engine && !opts.dbName) {
            throw new Error('--db-name is required when using --database');
        }
    })
    .action(init);

if (process.argv.length <= 2) {
    program.help();
}

program.parse(process.argv);
