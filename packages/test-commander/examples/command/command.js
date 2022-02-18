const {program} = require('commander')


program.command('start <name> [options...]')
  .action((name, options, cmd) => {
    console.log(name);
    console.log(options);
    console.log('cmd', cmd)
  })

program.parse()
// node xxx.js start test argumrnt