const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const createDirectory = async () => {
    await fsPromises.rm(path.join(__dirname, 'project-dist'), {recursive: true, force: true});
    await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
    
}
createDirectory();

const templateBuilder = async () => {
    let data = await fsPromises.readFile(path.join(__dirname, 'template.html'), {encoding: 'utf8'});
    let toChange = data.match(/{{[a-zA-Z0-9]+}}/g);    
    for (let section of toChange){
        let sectionCode = await fsPromises.readFile(path.join(__dirname, 'components', `${section.slice(2,-2)}.html`), {encoding: 'utf8'});
        while (data.indexOf(section) > -1){
            data = data.replace(section, sectionCode);
        }    
    }
    await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), data);
}
templateBuilder();

const cssBundle = async () => {
    const files = await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    let result = '';
    for (let file of files){
        if (file.isFile()){
            const filePath = path.join(__dirname, 'styles', file.name);
            const fileExt = path.extname(filePath);
            const fileName = path.basename(filePath);
            if (fileExt === '.css'){
                result += await fsPromises.readFile(path.join(__dirname, 'styles', fileName));
            }
        }
    }
    await fsPromises.writeFile(path.join(__dirname, 'project-dist/style.css'), result);
}
cssBundle();

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
copyDirectory(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));