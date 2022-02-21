const noop = () => {};
const targetStack = [];

class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm;
    this.cb = cb;
    this.deps = [];

    // expOrFn:string|function
    this.getter = typeof expOrFn === 'function'
      ? expOrFn
      : function () {
        // this:vm
        return this[expOrFn];
      };
    this.lazy = false;

    if (options) {
      this.lazy = !!options.lazy;
    }

    this.dirty = this.lazy;
    this.value = this.lazy
      ? undefined
      : this.get();
  }


  // watcher 的 addDep函数
  addDep(dep) {
    // 这里做了一系列的去重操作 简化掉

    // 这里会把 count 的 dep 也存在自身的 deps 上
    this.deps.push(dep);

    // 又带着 watcher 自身作为参数
    // 回到 dep 的 addSub 函数了
    dep.addSub(this);
  }


  get() {
    pushTarget(this);
    const { vm } = this;
    const value = this.getter.call(vm, vm);
    popTarget();
    return value;
  }

  run() {
    const value = this.get();
    const oldValue = this.value;
    this.value = value;
    console.log('run', value, oldValue);
    this.cb.call(this.vm, value, oldValue);
  }

  update() {
    if (this.lazy) {
      this.dirty = true;
    } else {
      Promise.resolve().then(() => {
        this.run();
      });
    }
  }

  depend() {
    let i = this.deps.length;
    // eslint-disable-next-line no-plusplus
    while (i--) {
      this.deps[i].depend();
    }
  }

  // 惰性 watcher手动求值
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
}


class Dep {
  constructor() {
    this.subs = [];
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  addSub(sub) {
    if (!this.subs.includes(sub)) {
      this.subs.push(sub);
    }
  }

  notify() {
    this.subs.forEach((watcher) => {
      watcher.update.call(watcher);
    });
  }
}

Dep.target = null;

function pushTarget(_target) {
  targetStack.push(_target);
  Dep.target = _target;
}

function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}


class Observer {
  constructor(data, vm) {
    this.vm = vm;
    this.observer(data);
  }

  observer(data) {
    if (data && typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        this.defineReactive(data, key, data[key]);
      });
    }
  }

  defineReactive(raw, key, value) {
    this.observer(value);

    const dep = new Dep();
    Object.defineProperty(raw, key, {
      get() {
        dep.depend();
        return value;
      },
      set(val) {
        if (val === value) return;
        // console.log('set dep', dep, val, value);
        value = val;
        dep.notify();
      },
    });
  }
}


class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = typeof options.data === 'function' ? options.data() : options.data;
    this.$computed = options.computed;

    this.initState();
  }

  initState() {
    if (this.$data) this.initData(this.$data);
    if (this.$computed) this.initComputed(this.$computed);
  }

  initComputed() {
    // eslint-disable-next-line no-multi-assign, no-underscore-dangle
    const watchers = this._computedWatchers = Object.create(null);
    const computed = this.$computed;

    // eslint-disable-next-line no-restricted-syntax, no-unused-vars
    for (const key in computed) {
      const getter = computed[key];

      const computedWatcherOptions = {
        lazy: true,
      };

      // 绑定computed的key到vm上
      if (!(key in this)) {
        watchers[key] = new Watcher(
          this, // vm
          getter, // expOrFn
          noop, // cb
          computedWatcherOptions // options
        );

        this.defineComputed(key);
      } else {
        console.log(`[error]:${key}已经存在`);
      }
    }
  }

  defineComputed(key) {
    const computedGetter = {
      get() {
        const watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
          if (watcher.dirty) {
            // 更新 watcher的 value
            watcher.evaluate();
          }

          if (Dep.target) {
            watcher.depend();
          }

          return watcher.value;
        }
      },
    };

    Object.defineProperty(this, key, computedGetter);
  }


  initData(data) {
    new Observer(data, this);
    this.proxyDataToVm(data, this);
  }

  proxyDataToVm(data, vm) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(vm, key, {
        get() {
          return data[key];
        },
        set(val) {
          if (val === data[key]) return;
          data[key] = val;
        },
      });
    });
  }
}


const vm = new Vue({
  data() {
    return {
      count: 0,
    };
  },
  computed: {
    sum() {
      console.log('computed');
      return this.count + 1;
    },
  },
});

// 测试data属性
// new Watcher(vm, 'count', (value) => {
//   console.log('cb', value);
// });

// debugger;

setTimeout(() => {
  // console.log(vm.sum)
  vm.count = 3;
  // console.log(vm.sum)
}, 2000);

// 测试computed属性
new Watcher(vm, 'sum', (value) => {
  console.log('sumCb', value);
});
