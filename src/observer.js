/**
 * 监听者
 */
// comment : Observer类传入的是obj
class Observer {
  constructor(data) {
    this.data = data
    this.walk(data)
  }
// comment : 给data的每个key加defineReactive修饰 
  walk(data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
// comment的参数是：源对象，key，key对应的value
  defineReactive(data, key, val) {
    console.log(data)
    console.log(key)
    console.log(val)
    const dep = new Dep()
    observe(val)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 如果当前有缓存订阅者，就添加一个新订阅者
        if (Dep.target) {
          // 添加一个订阅者
          console.log(Dep.target)
          dep.addSub(Dep.target)
        }
        return val
      },
      set(newVal) {
        if (newVal === val) {
          return
        }
        val = newVal
        // 如果数据有变化，通知所有订阅者
        dep.notify()
      }
    })
  }
}

// 消息订阅器
// comment : 收集依赖（addSub），通知依赖更新（notify）
export class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }
  // comment : 遍历依赖收集器 subs下的所有watcher，进行视图更新
  notify() {
    this.subs.forEach(sub => {
      // 调用订阅者的 update 方法
      sub.update()
    })
  }
}
Dep.target = null

export const observe = value => {
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)
}
/* 这里输出的observe的是Observe实例 */
