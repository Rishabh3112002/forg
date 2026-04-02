#!/usr/bin/env node

const {Command} = require('commander');
const pkg = require('../../package.json');
const {execSync} = require('child_process');

const init = require('../commands/init');
const proxyToUv = require('../commands/proxy');

const program = new Command();

program.name('forg').description('Opinionated project setup tool').version(pkg.version);

program
    .command('init')
    .description('Initialize a new project')
    .argument('<name>', 'Project name')
    // TODO: Add functionality later for node.
    // .argument('<lang>', 'Project language. Supported languages: python, node')
    .option('-e, --engine <type>', 'SQL Framework (mysql, psql)', (value) => {
        const allowed = ['mysql', 'psql'];
        const normalized = value.toLowerCase();

        if (!allowed.includes(normalized)) {
            program.error(`Invalid database engine: "${value}". Allowed values are: mysql, psql`);
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
            program.error('Database options (--db-name, --db-user, etc.) require --database');
        }
        if (opts.engine && !opts.dbName) {
            program.error('--db-name is required when using --database');
        }
    })
    .action(init);

program.command('* [args...]', {hidden: true}).allowUnknownOption(true).action(proxyToUv);

program.addHelpText('after', () => {
    try {
        const uvHelp = execSync('uv help', {encoding: 'utf8'});
        const lines = uvHelp.split('\n');

        let inCommands = false;
        const uvCommands = [];

        for (const line of lines) {
            if (/^Commands:/i.test(line)) {
                inCommands = true;
                continue;
            }
            if (inCommands && /^[A-Z]/.test(line) && !/^\s/.test(line)) break;
            if (inCommands && /^\s+\S/.test(line) && !/^\s+(init | help)\b/.test(line)) {
                uvCommands.push(line);
            }
        }

        return uvCommands.length ? `${uvCommands.join('\n')}` : '';
    } catch {
        return '';
    }
});

if (process.argv.length <= 2) {
    program.help();
}

program.parse(process.argv);
