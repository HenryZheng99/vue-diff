# vue-diff

实现一个简单的diff算法流程

博客:[https://blog.csdn.net/zhenghaohan1999/article/details/104476048](https://blog.csdn.net/zhenghaohan1999/article/details/104476048)

## running
```markdown
# 克隆项目
git clone https://github.com/zhenghanhao1999/vue-diff.git

# 安装依赖
npm install

# 打包编译
npm run build

# 运行
打开build目录下的index.html
```

## 详解
流程图如下：
<img src="G:\vue-diff\images\流程图.PNG" alt="流程图" style="zoom:80%;" />

#### 什么是虚拟DOM ？

所谓虚拟DOM，就是用一个`JS`对象来描述一个`DOM`节点

#### 为什么要有虚拟DOM ？ 

`Vue`是数据驱动视图的，数据发生变化视图就要随之更新，在更新视图的时候难免要操作`DOM`,而操作真实`DOM`又是非常耗费性能的，这是因为浏览器的标准就把 `DOM` 设计的非常复杂，所以一个真正的 `DOM` 元素是非常庞大的（打印一个空的div所有的key，可能有上百个），直接操作真实`DOM`就会非常消耗性能。

当数据发生变化时，我们对比变化前后的虚拟`DOM`节点，通过`DOM-Diff`算法计算出需要更新的地方，然后去更新需要更新的视图 ，这就是上述问题的解决方案。

#### VNode类

在vue中（源码），一个虚拟dom节点，具备以下属性：

```javascript
export default class VNode {
  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag                                /*当前节点的标签名*/
    this.data = data        /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
    this.children = children  /*当前节点的子节点，是一个数组*/
    this.text = text     /*当前节点的文本*/
    this.elm = elm       /*当前虚拟节点对应的真实dom节点*/
    this.ns = undefined            /*当前节点的名字空间*/
    this.context = context          /*当前组件节点对应的Vue实例*/
    this.fnContext = undefined       /*函数式组件对应的Vue实例*/
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key           /*节点的key属性，被当作节点的标志，用以优化*/
    this.componentOptions = componentOptions   /*组件的option选项*/
    this.componentInstance = undefined       /*当前节点对应的组件的实例*/
    this.parent = undefined           /*当前节点的父节点*/
    this.raw = false         /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
    this.isStatic = false         /*静态节点标志*/
    this.isRootInsert = true      /*是否作为跟节点插入*/
    this.isComment = false             /*是否为注释节点*/
    this.isCloned = false           /*是否为克隆节点*/
    this.isOnce = false                /*是否有v-once指令*/
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  get child (): Component | void {
    return this.componentInstance
  }
}
```

 通过属性之间不同的搭配，`VNode`类可以描述出各种类型的真实`DOM`节点：

- 注释节点：`isComment`为`true`
- 文本节点：只具备 `text`属性 
- 元素节点： 贴近于真实DOM节点，具备节点属性 
- 克隆节点： `isCloned`为`true` 
- 组件节点
- 函数式组件节点

#### 什么是补丁包（patch） ？

如果你有仔细看流程图（加载不出来请克隆或者调整网络）

那么你可以看到整个流程是：新的VDOM来了 --> 用diff算法生成补丁包 --> 通过打补丁更新dom

所以补丁包，就是**在重新更新视图的时候，告诉Render应该对当前节点进行何种操作**

我们在此DEMO中，仅对文本节点、元素节点做条件判断，并且补丁包类型定义为：

```javascript
// 具备属性的元素节点
// 对应操作：setAttribute、removeAttribute等
const ATTRS = 'ATTRS';
// 文本节点
// 对应操作：直接替换textContent
const TEXT = 'TEXT';
// 应该被移除的节点
// 对应操作：removeChild
const REMOVE = 'REMOVE';
// 应该被替换的节点
// 对应操作：replaceChild
const REPLACE = 'REPLACE';
```

我们重点来讨论diff算法

#### diff算法如何生成补丁包？

新旧VDOM同步逐层访问，对比，将补丁包加入patches队列

我画了一张本项目中DEMO的补丁包生成过程：

![diff](G:\vue-diff\images\diff.PNG)

- 对比两个ul，发现没有变化，但是它们都是元素节点，具备属性，所以第一个补丁包ATTRS入队，继续遍历下一层
- 对比第一个li，它们没有子节点并且都是文本节点，文本发生变化了，加入一个TEXT补丁包
- 对比第二个li，没有变化，跳过
- 对比第三个li，同第一个li，加入TEXT补丁包
- 递归结束，返回补丁包队列

#### 渲染Render

TODO
