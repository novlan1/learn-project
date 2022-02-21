// 寻找最长递增子序列的下标的算法
// 详细见顶部链接：理解 vue3 diff 中的最长递增子序列算法
function getSequence(arr) {
  const p = arr.slice();
  const result = [0];
  let i; let j; let u; let v; let c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = ((u + v) / 2) | 0;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}

const insertBefore = (ele, refer, nodes) => {
  const target = nodes.findIndex(e => e === ele);
  if (~target) {
    nodes.splice(target, 1);
  }

  nodes.splice(nodes.findIndex(e => e === refer), 0, ele);
};

const insertAfter = (ele, refer, nodes) => {
  const target = nodes.findIndex(e => e === ele);
  if (~target) {
    nodes.splice(target, 1);
  }
  nodes.splice(nodes.findIndex(e => e === refer) + 1, 0, ele);
};

// 测试代码
const oldNodes = [...Array(10).keys()];
const newNodes = (() => {
  const len = 7;
  const ret = [];
  while (ret.length !== len) {
    const random = parseInt(Math.random() * 10);
    if (!ret.includes(random)) {
      ret.push(random);
    }
  }
  return ret;
})();

function vue3Diff(oldNodes, newNodes) {
  let startIndex = 0;
  let newEndIndex = newNodes.length - 1;
  let oldEndIndex = oldNodes.length - 1;
  let newStartNode = newNodes[startIndex];
  let oldStartNode = oldNodes[startIndex];
  let newEndNode = newNodes[newEndIndex];
  let oldEndNode = oldNodes[oldEndIndex];


  // 第一步：对比新老节点数组的头头和尾尾
  // 在这一步将两头两尾相同的进行 patch
  {
    while (oldStartNode === newStartNode) {
      startIndex++;
      oldStartNode = oldNodes[startIndex];
      newStartNode = newNodes[startIndex];
    }

    while (oldEndNode === newEndNode) {
      oldEndIndex--;
      newEndIndex--;
      newEndNode = newNodes[newEndIndex];
      oldEndNode = oldNodes[oldEndIndex];
    }
  }

  // 第二步：头尾 patch 结束之后，查看新老节点数组是不是有其中一方已经 patch 完了，假如是，那么就多删少补
  if (startIndex > oldEndIndex && newEndIndex >= startIndex) {
    oldNodes.splice(startIndex, 0, ...newNodes.splice(startIndex, newEndIndex - startIndex + 1));
  } else if (startIndex > newEndIndex && oldEndIndex >= startIndex) {
    oldNodes.splice(startIndex, oldEndIndex - startIndex + 1);
  } else {
    const newStartIndex = startIndex;
    const oldStartIndex = startIndex;

    // 遍历新节点生成 { a:0, b: 1 } 的结构
    const newNodesMap = new Map();
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      newNodesMap.set(newNodes[i], i);
    }

    // 老节点在新节点中已经找到了的个数
    let patched = 0;
    // 新节点准备要拿来对比的个数
    const toBePatched = newEndIndex - newStartIndex + 1;

    // 用来标识是否要被做移动的操作
    let moved = false;
    let maxNewIndexSoFar = 0;


    const newIndexToOldIndexMap = Array(toBePatched).fill(0);

    // 第三步：遍历老节点，看老节点是否在新节点里面存在，假如不存在，就删除。
    // 假如新的子节点都被遍历完了，那么就代表说老的数组之后的，都是需要被删除的
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const current = oldNodes[i];
      if (patched === toBePatched) {
        oldNodes.splice(i, oldEndIndex - i + 1);
        oldEndIndex = i - 1;
        break;
      }

      // 获取该老节点在新节点数组中的下标
      const newIndex = newNodesMap.get(current);

      // 假如不存在，那么就代表说需要删除这个节点
      if (newIndex === undefined) {
        oldNodes.splice(i, 1);
        oldEndIndex--;
        if (i !== oldNodes.length - 1) {
          i--;
        }
      } else {
        // 将老节点中存在于新节点中的元素的 index + 1 赋值给 newIndexToOldIndexMap，比如有以下新老节点
        // old：['c', 'd', 'e'];
        // new：['e', 'd', 'c', 'h'];
        // 那么经过赋值之后的 newIndexToOldIndexMap 的值就是 [3, 2, 1, 0], 3 是 老节点中的 c 对应新节点的下标是 2，然后 2 + 1（为什么需要加 +1 是因为需要跟 0（新增的元素的标记）区分开来）
        // 所以为 3，以此类推，直到遍历完老数组
        newIndexToOldIndexMap[newNodes.findIndex(n => n === current) - newStartIndex] = i + 1;

        // 判断是否老数组的元素是否有移动的必要
        // 因为遍历老数组是从前往后遍历，那么假如说在遍历的时候，就记录该节点在新节点数组中的位置，假如发生倒转，那么就是 maxNewIndexSoFar > newIndex
        // 就代表说新老节点的某节点已经发生了调换，在 diff 过程中肯定会涉及元素的移动
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex;
        } else {
          moved = true;
        }

        // 记录已经在新节点中找到了了多少个老子节点了
        patched++;
      }
    }

    //  第四步：获取最长递增子序列
    const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : [];
    // 获取当前递增子序列的下标，默认为数组的最后一个
    let sequenceIndex = increasingNewIndexSequence.length - 1;
    // 获取锚点节点，用来表明上一次移动的是哪一个节点，且根据这个锚点节点，将下一个要移动的节点移动到锚点的前面
    // 默认为老数组中的最后一位，为什么是最后一位是因为需要对应上下面的遍历是从未到首的
    let anchor = oldNodes[oldEndIndex];

    // 第五步：从末尾开始遍历新节点数组
    for (let i = newEndIndex; i >= newStartIndex; i--) {
      const current = newNodes[i];
      // 假如之前在 newIndexToOldIndexMap [3,2,1,0] 中的下标是 0，那么就是代表是新增
      if (newIndexToOldIndexMap[i - newStartIndex] === 0) {
        if (i === newEndIndex) {
          insertAfter(current, anchor, oldNodes);
        } else {
          insertBefore(current, anchor, oldNodes);
        }
        // 确认有节点需要被移动
      } else if (moved) {
        // 假如最长递增子序列已经遍历完了，那么就代表剩下的老节点都是需要被移动的
        // 假如该节点在新节点中的下标为最长递增子序列的序号做对比，假如对应上了，那么就代表该节点不需要移动
        if (sequenceIndex < 0 || i !== increasingNewIndexSequence[sequenceIndex]) {
          // 将需要被移动的节点插入到锚点之前
          if (i === newEndIndex) {
            insertAfter(current, anchor, oldNodes);
          } else {
            insertBefore(current, anchor, oldNodes);
          }
        } else {
          // 假如命中了最长子序列的当前序号，那么下一次遍历中当前序号往前移一位
          sequenceIndex--;
        }
      }
      // 每一次都将该锚点置为本次循环处理的节点
      anchor = current;
    }
  }
}

vue3Diff(oldNodes, newNodes);
console.log(`new:${newNodes}`);
console.log(`now:${oldNodes}`);
