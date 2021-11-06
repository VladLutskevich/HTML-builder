const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

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
        await fsPromises.writeFile(path.join(__dirname, 'project-dist/bundle.css'), result);
}

cssBundle();