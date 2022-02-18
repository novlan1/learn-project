// 一、yes
// import { sayHello1 } from './module';
// sayHello1()

// 二、no
import * as obj from './module'
const { sayHello1 } = obj;
sayHello1();

// 三、yes
// import * as obj from './module2'
// obj.sayHello1();

//  四、no
// import obj from  './module3'
// const { sayHello1 } = obj;
// sayHello1()

//  五、no
// import obj from  './module4'
// const { sayHello1 } = obj;
// sayHello1();

// 六、yes
// import * as obj from './module'
// obj.sayHello1();

// 七、yes
// import * as obj from './module2'
// obj.sayHello1();

// 八、yes
// import obj from  './module3'
// obj.sayHello1()

//  九、
// 5.11 => 无副作用代码时yes，有副作用代码时no
// 4.28.3 => no
// import obj from  './module4'
// obj.sayHello1();