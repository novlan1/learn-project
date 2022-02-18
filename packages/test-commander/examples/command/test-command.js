const { program } = require('commander')

// 声明可变参数，可变参数会以数组的形式传递给处理函数。
program.command('start <name> [options...]')
  .action((name, options) => {
    console.log(name);
    console.log(options);
  })

program.parse(process.argv);
