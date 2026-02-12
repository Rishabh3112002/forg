const path = require('path');
const fs = require('fs');

async function pythonDir({name, root}) {
    const safeName = name.replace(/-/g, '_');
    const dirStruct = path.join(root, 'src', safeName);
    fs.mkdirSync(dirStruct, {recursive: true});
    await makeFile({
        dirPath: dirStruct,
        fileName: '__init__.py'
    });
    return dirStruct;
}

function makeFile({dirPath, fileName}) {
    const filePath = path.join(dirPath, fileName);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
    }
}

module.exports = {pythonDir};
