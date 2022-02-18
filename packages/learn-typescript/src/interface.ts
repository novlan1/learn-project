// 1.
interface Person {
  readonly id: number;
  name: string;
  age?: number;
}
let viking: Person = {
  id: 1234,
  name: 'viking',
}


function echoName(arg: Person) {
  console.log(arg.name)
}

echoName(viking)

// 2. 还会带有任意数量的其它属性
interface Person2 {
  readonly id: number;
  name: string;
  [propName: string]: any;
}

let testName: Person2 = {
  id: 123,
  name: 'hehe',
  child: 'yang',
  qing: 'dfa'
}

// 3.

interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  // ...
  return { color: '', area: 1 }
}

// 报错 “colour”中不存在类型“SquareConfig”。是否要写入 color?
// let mySquare = createSquare({ colour: "red", width: 100 });

// 解决：1. 类型断言
let mySquare = createSquare({ colour: "red", width: 100 } as SquareConfig);

// 2. 带有任意数量的其它属性
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any;
}

// 3. 将这个对象赋值给一个另一个变量
let squareOptions = { colour: "red", width: 100 };
let mySquare2 = createSquare(squareOptions);


// 函数类型

interface SearchFunc{
  (source: string, subString: string): boolean 
}

let mySearch: SearchFunc

mySearch = function(src, sub) {
  let result = src.search(sub);
  return result > -1;
}

// 类类型

interface ClockInterface{
  currentTime: Date;
  setTime(d: Date)
}

class Clock implements ClockInterface{
  currentTime: Date
  setTime(d) {
    this.currentTime = d
  }
}


interface ClockConstructor {
  new (hour: number, minute: number);
}
interface ClockInterface2 {
  tick();
}

// 报错，当一个类实现了一个接口时，只对其实例部分进行类型检查。 constructor存在于类的静态部分，所以不在检查的范围内
// class Clock2 implements ClockConstructor {
//   currentTime: Date;
//   constructor(h: number, m: number) { }
// }


// 解决
function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface2 {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface2 {
  constructor(h: number, m: number) { }
  tick() {
      console.log("beep beep");
  }
}
class AnalogClock implements ClockInterface2 {
  constructor(h: number, m: number) { }
  tick() {
      console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);