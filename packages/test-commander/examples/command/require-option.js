const { program } = require('commander')

program
  .requiredOption('-a, --add <type>', 'add type must have be selected');
  
program.parse(process.argv);


