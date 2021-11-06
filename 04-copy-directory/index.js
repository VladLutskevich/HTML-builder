const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const copyDirectory = async (currentDirPath, currentDirPathToCopy) => {
    await fsPromises.rm(currentDirPathToCopy, {recursive: true, force: true});
    await fsPromises.mkdir(currentDirPathToCopy, {recursive: true});
    await fsPromises
    .readdir(currentDirPath, {withFileTypes: true})
    .then(files => {
        files.forEach(file => {
            if (file.isFile()) {
                fsPromises.copyFile(path.join(currentDirPath, file.name), path.join(currentDirPathToCopy, file.name));
            }
            if (file.isDirectory()){
                copyDirectory(path.join(currentDirPath, file.name), path.join(currentDirPathToCopy, file.name));
            }
        });
    });
}
copyDirectory(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));