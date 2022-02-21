

/**
 * 看两个节点是否相同节点， 对比tag和key是否一样
 * @param {*} newVnode
 * @param {*} oldVnode
 */
 function isSameVnode(newVnode, oldVnode) {
  return newVnode.tag === oldVnode.tag && newVnode.key == oldVnode.key;
}

/**
 *
 * @param {*} el 真实dom节点
 * @param {*} oldChildren 老虚拟dom
 * @param {*} newChildren 新虚拟dom
 */
function domDiff(el, oldChildren, newChildren) {
  // 老的开始索引
  let oldStartIndex = 0;
  // 老的开始节点
  let oldStartVnode = oldChildren[0];
  // 老的结束索引
  let oldEndIndex = oldChildren.length - 1;
  // 老的结束节点
  let oldEndVnode = oldChildren[oldEndIndex];

  // 新的开始索引
  let newStartIndex = 0;
  // 新的开始节点
  let newStartVnode = newChildren[0];
  // 新的结束索引
  let newEndIndex = newChildren.length - 1;
  // 新的结束节点
  let newEndVnode = newChildren[newEndIndex];

  // 根据老的节点，构造一个map
  const oldNodeMap = oldChildren.reduce((acc, item, index) => {
    // A: 0  记录位置
    acc[item.key] = index;
    return acc;
  }, {});

  // 双指针对比，从两端向中间遍历，当指针交叉的时候，就是对比完成了
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 指针移动的时候，可能元素已经被移走了，那就跳过这一项
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
      console.log('1. oldStartVnode 为空');
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
      console.log('2. oldEndVnode 为空');
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      console.log('3. 头头相同', newStartVnode.key);
      // 头头比较，如果相同就移动头指针
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      console.log('4. 尾尾相同', newEndVnode.key);
      // 尾尾比较，如果相同，移动尾指针
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      /**
       * a b
       * b a
       *
       * 将旧的头节点(a) 插入到旧的尾节点(b)的下一个节点之前
       */
      console.log(`5. 头尾相同 移动 ${oldStartVnode.key} 到 ${oldEndVnode.key}的下一节点之前`);
      // 头尾比较
      // 将oldStartVnode.el 老节点的真实dom，移动到老的节点的最后
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      /**
       * a b c d
       * d b a c
       *
       * 将旧的尾节点(d) 插入到 旧的头节点(a)的前面
       */

      // 尾头比较
      console.log(`6. 尾头相同 移动${oldEndVnode.key} 到${oldStartVnode.key}之前`);
      el.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else {
      // 上面都是特殊情况
      // 头头、尾尾、头尾、尾头都对比完了
      // 对比乱序的
      const moveIndex = oldNodeMap[newStartVnode.key];
      if (moveIndex === undefined) {
        /**
         * a b c
         * d
         *
         * 直接在旧的头节点前面插入创建的节点
         *
         */
        // 找不到索引， 是新的节点，要创建一下
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        console.log(`7. 创建新节点${newStartVnode.key} 插入到 ${oldStartVnode.key}之前`);
      } else {
        /**
         * a b c d
         * b d a c
         *
         * 将找到的节点(b) 移动到旧的头节点(a)之前，同时将找到的位置置空
         */
        // 找到了
        const moveVnode = oldChildren[moveIndex];
        el.insertBefore(moveVnode.el, oldStartVnode.el);
        // 将已经移动的节点标记为undefine
        oldChildren[moveIndex] = undefined;
        console.log(`8. 移动乱序节点${moveVnode.key} 到 ${oldStartVnode.key} 之前`);
      }
      newStartVnode = newChildren[++newStartIndex];
    }
  }

  // 新的多，那么就将多的插入进去即可
  if (oldStartIndex > oldEndIndex) {
    /**
     * a b c
     * d e f a b c
     *
     * 一直是尾尾相同，尾节点都一直减1，直到 oldStartIndex=0，oldEndIndex=-1，newStartIndex=0，newEndIndex=2
     * 将多出的节点def(下标0-2)，不断添加到旧节点的前面
     */
    // if (newStartIndex <= newEndIndex) {
    // 参照物
    const anchor =      newChildren[newEndIndex + 1] === null
      ? null
      : newChildren[newEndIndex + 1].el;

    for (let i = newStartIndex; i <= newEndIndex; i++) {
      console.log('插入', newChildren[i].key);
      el.insertBefore(createElm(newChildren[i]), anchor);
    }
  }

  // 老的多余，需要清理掉，删除即可
  // if (oldStartIndex <= oldEndIndex) {
  if (newStartIndex > newEndIndex) {
    /**
     * a b c d e f
     * d e f
     *
     * 一直都是尾尾相同，直到 newStartIndex=0，newEndIndex=-1, oldStartIndex=0, oldEndIndex=2
     * 将多出的节点abc(下标0-2)删除
     */
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const child = oldChildren[i];
      console.log('删除', child && child.key);
      child && el.removeChild(child.el);
    }
  }
}


/**
 * 根据虚拟dom创建真实dom
 * @param {*} vnode
 * @returns
 */
function createElm(vnode) {
  const { tag, text, key } = vnode;

  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    vnode.el.innerText = key;
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

// const oldNodeKeys = ['A']
// const oldNodeKeys = ['A', 'B', 'C', 'D']
// const oldNodeKeys = ['A', 'B', 'C', 'D', 'E', 'F']
const oldNodeKeys = ['A', 'B', 'C', 'D', 'E', 'F'];

// const newNodeKeys = ['B']
// const newNodeKeys = ['C', 'A', 'F', 'G', 'B']
// const newNodeKeys = ['A', 'B', 'C']
const newNodeKeys = ['D', 'E', 'F'];


window.onload = function () {
  let oldNodes = [];
  let newNodes = [];

  oldNodeKeys.map((key) => {
    const li = document.createElement('li');
    li.innerHTML = key;
    li.id = `dom${key}`;
    container.appendChild(li);
  });

  oldNodes = oldNodeKeys.map(key => ({
    key,
    el: document.getElementById(`dom${key}`),
    tag: 'li',
  }));


  newNodes = newNodeKeys.map(key => ({
    key,
    tag: 'li',
  }));


  setTimeout(() => {
    domDiff(container, oldNodes, newNodes);
  }, 2000);
};
