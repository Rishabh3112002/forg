const {spawn} = require('child_process');
const {Command} = require('commander');
const path = require('path');
const fs = require('fs/promises');

const program = new Command();

const {pythonDir} = require('./directory');

function uvInit(projectRoot) {
    return new Promise((resolve, reject) => {
        const child = spawn('uv', ['init', projectRoot], {
            stdio: 'inherit',
            shell: true
        });

        child.on('error', reject);

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`forg init failed with exit code ${code}`));
            }
        });
    });
}

async function ensureNotExists(dir) {
    try {
        await fs.access(dir);
        program.error(`Project already exists at ${dir}`);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
    }
}

async function createProject({name, lang, cwd}) {
    const root = path.resolve(cwd, name);
    const projectName = name === '.' ? path.basename(root) : name;

    if (name != '.') {
        await ensureNotExists(root);
    }

    await uvInit(root);
    const dirStruct = await pythonDir({name: projectName, root});
    await fs.rename(path.join(root, 'main.py'), path.join(dirStruct, 'main.py'));
}

module.exports = {createProject};
