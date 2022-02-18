const { program } = require('commander')

function increaseFunc(value, preValue) {
  return preValue + 2;
}

program.option('-a, --add', 'add function', increaseFunc, 100);

program.parse(process.argv);

if(program.opts().add > 100) {
  console.log(`current value: ${program.opts().add}`)
}
