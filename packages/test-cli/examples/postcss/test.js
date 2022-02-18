let postcss = require('postcss')

// postcss(plugins).process(css, { from, to }).then(result => {
//   console.log(result.css)
// })

const root = postcss.parse('a { color: black } b { font-size: 35px}')

console.log('root', root)
root.nodes.length           //=> 1
root.nodes[0].selector      //=> 'a'
root.nodes[0].nodes[0].prop //=> 'color'