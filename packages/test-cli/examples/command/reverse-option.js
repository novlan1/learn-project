const { program } = require('commander')

program.option('--no-opposite', 'test --no options') // 取反

program.parse(process.argv);

if(program.opts().opposite) {
  console.log('this is a word');
} else {
  console.log('this is a other word');
}
