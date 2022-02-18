var styles = require('ansistyles')
  , colors = require('ansicolors');

  console.log(
    // prints hello world underlined in blue on a green background
    colors.bgGreen(colors.blue(styles.underline('hello world'))) 
  );

console.log(`\u001b[1mhaha`)
