
const sayHello1 = () => {
  console.log('hello1');
}
 
const sayHello2 = () => {
  console.log('hello2');
}
 
const sayHello3 = () => {
  console.log('hello3');
}

function go (url) {
  window.location.href = url
}

go('123')

export default {
  sayHello1,
  sayHello2,
  sayHello3
}