// 函数声明
// function add(x: number, y: number, z: number = 10): number {
//   if (typeof z === 'number') {
//     return x + y + z
//   } else {
//     return x + y
//   }
// }

// let result = add(2, 3, 5)

const add = function(x: number, y: number, z: number = 10): number {
  if (typeof z === 'number') {
    return x + y + z
  } else {
    return x + y
  }
}

const add2: (x: number, y: number, z?: number) => number = add

// 函数也是有类型的
const add3: (x: number, y: number) => number = function(x: number, y: number): number {
  return x + y
}

// 剩余参数
function add4(x: string, ...restName: string[]) {
  return x + restName.join(' ')
}