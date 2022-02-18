function sayHello1() {
  console.log('hello1');
}
 
function sayHello2() {
  console.log('hello2');
}
 
function sayHello3() {
  console.log('hello3');
}

function go (url) {
  window.location.href = url
}

export default {
  sayHello1,
  sayHello2,
  sayHello3
}

go('123')
