function reactDiff(parent, prevChildren, nextChildren) {
  let lastIndex = 0;
  for (let i = 0; i < nextChildren.length; i++) {
    const nextChild = nextChildren[i];
    let find = false;
    for (let j = 0; j < prevChildren.length; j++) {
      const prevChild = prevChildren[j];
      if (nextChild.key === prevChild.key) {
        find = true;
        // patch(prevChild, nextChild, parent)
        if (j < lastIndex) {
          // 移动到前一个节点的后面
          const refNode = nextChildren[i - 1].el.nextSibling;
          parent.insertBefore(nextChild.el, refNode);
        } else {
          // 不需要移动节点，记录当前位置，与之后的节点进行对比
          lastIndex = j;
        }
        break;
      }
    }
    if (!find) {
      /**
           * 遍历过程中，如果无法复用，插入新节点
           *
           * a b d
           * a b c d
           */
      const refNode = i <= 0
        ? prevChildren[0].el
        : nextChildren[i - 1].el.nextSibling;

      parent.insertBefore(createElm(nextChild), refNode);
      // mount(nextChild, parent, refNode);
    }
  }
  for (let i = 0; i < prevChildren.length; i++) {
    const prevChild = prevChildren[i];
    const { key } = prevChild;
    const has = nextChildren.find(item => item.key === key);
    /**
       * a b c d
       * a b d
       *
       * 第一轮遍历结束后，对于多余的节点，直接删除
       */
    if (!has) parent.removeChild(prevChild.el);
  }
}


function createElm(vnode) {
  vnode.tag = 'li'; // mock
  const { tag, text, key } = vnode;

  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    vnode.el.innerText = key;
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

const oldNodeKeys = ['A', 'E', 'F'];
const newNodeKeys = ['D', 'G', 'E', 'F'];

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
    reactDiff(container, oldNodes, newNodes);
  }, 2000);
};
