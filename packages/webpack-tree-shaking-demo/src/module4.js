const exportObj = {}

exportObj.sayHello1 = () => {
  console.log('hello1');
}
 
exportObj.sayHello2 = () => {
  console.log('hello2');
}
 
exportObj.sayHello3 = () => {
  console.log('hello3');
}

function go (url) {
  window.location.href = url
}

go('123')

export default exportObj;