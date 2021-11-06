function exitProcess() {
    stdout.write('Хорошего дня!\n');
    exit();
}

const { stdin, stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Введите текст\n')
stdin.on('data', data => {
  if(data.toString().trim() ===  'exit'){
    exitProcess();
  }
  else{
    writeStream.write(data);
  }
});

process.on('SIGINT', exitProcess);