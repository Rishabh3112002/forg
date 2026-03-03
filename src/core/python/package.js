const {spawn} = require('child_process');
const {Command} = require('commander');
const path = require('path');
const fs = require('fs/promises');

const program = new Command();

async function proxyToUv() {
    const args = process.argv.slice(2);
    return new Promise((resolve, reject) => {
        const child = spawn('uv', args, {
            stdio: 'inherit',
            shell: true
        });

        child.on('error', reject);

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`forg ${args[0]} failed with exit code ${code}`));
            }
        });
    });
}

module.exports = {proxyToUv};
