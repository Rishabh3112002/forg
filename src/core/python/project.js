const {spawn} = require('child_process');
const path = require('path');
const fs = require('fs/promises');

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
                reject(new Error(`uv init failed with exit code ${code}`));
            }
        });
    });
}

async function ensureNotExists(dir) {
    try {
        await fs.access(dir);
        throw new Error(`Project already exists at ${dir}`);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
    }
}

async function createProject({name, lang, cwd}) {
    const root = path.resolve(cwd, name);

    await ensureNotExists(root);

    await uvInit(root);
    const dirStruct = await pythonDir({name, root});
    await fs.rename(path.join(root, 'main.py'), path.join(dirStruct, 'main.py'));
}

module.exports = {createProject};
