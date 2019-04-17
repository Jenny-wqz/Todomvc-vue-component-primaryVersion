##使用组件化完成 TodoMVC

### 1. 安装 vue(引入)+配置

### 2. 抽离组件

    2.1 在js里 创建components文件夹,然后再创建以下三个文件

    - todo-head.js
    - todo-list.js
    - todo-footer.js

    2.2 在某个.js 文件里面注册对应的组件

    Vue.component('todo-head',{
    template:`把对应的结构copy过来`
    })

    2.3 在 index.html 引入对应的注册组件代码

    2.4 把组件名称当成标签使用
    < todo-header ></ todo-header >

### 3 列表展示

     拿到父组件里的list,再传递给子组件
     3.1 通过属性将父组件里的list传给子组件
     3.2 通过子组件里的配置项props,拿到父组件传递过来的数据
