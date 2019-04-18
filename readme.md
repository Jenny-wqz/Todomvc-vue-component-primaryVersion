## 使用组件化开发，完成 TodoMVC案例

### 1. 安装 vue(引入)+配置

为了方便,我是直接把vue引到文件中的

### 2. 抽离组件

##### 2.1 在 js文件夹里 创建components文件夹,然后再创建以下三个文件

- todo-head.js
- todo-list.js
- todo-footer.js

##### 2.2 在某个.js 文件里面注册对应的组件

```js
Vue.component('todo-head',{

	template:`把对应的结构copy过来`

})
```

##### 2.3 在 index.html 引入对应的注册组件代码

```js
<script src='./... .js'></script>
```

2.4 把组件名称当成标签使用(在对应的地方引入)

```js
< todo-header ></ todo-header >
```



### 3 列表展示(父传子)

#####  3.1 通过属性将父组件里的list传给子组件

```js
<todo-list :list="list"></todo-list>
```

#####  3.2 通过子组件里的配置项props,拿到父组件传递过来的数据

```js
props: ["list"],
```
#####  3.3 遍历拿到的数据list,动态渲染页面(使用v-for,并且绑定key)

```js
<li :class="{completed:item.done}" v-for="item in list" :key='item.id'>
```


### 4. 实现删除功能(子传父)

点击删除按钮时,拿到对应的id,传递给父组件,父组件根据接收到传递过来的id,删除对应的数据

- ##### 4.1 先在子组件中注册一个点击事件,点击时,获取点击那一条的id
- ##### 4.2 先在父组件中定义一个方法 pDelTodo
- ##### 4.3 然后在插入子组件的标签中自定义一个事件,用于绑定父组件的方法 @del-todo = 'pDelTodo'

```js
<todo-list :list="list" @del-todo="pDelTodo"></todo-list>
```

- ##### 4.4 在点击事件中触发 del-todo事件,也就是父组件中的pDelTodo,同时把id传递给父组件

```js
delTodo(id) {
    // console.log("子组件", id);
    //子传父,通过vue提供的$emit 方法,直接调用自定义的del-todo事件,就相当于调用了父组件的方法;
    //调用的时候还可以传参过去,在父组件就可以接收到子组件传过去的数据
    this.$emit("del-todo", id);
}
```

- ##### 4.5 父组件拿到传过来的id后,根据id删除对应的数据

```js
pDelTodo(id) {
    // console.log("父组件", id);
    this.list = this.list.filter(item => item.id != id);
},
```


### 5. 实现添加任务功能(子传父)

- ##### 5.1 在头部组件中定义一个todoName,用于绑定文本框
- ##### 5.2 给文本框注册一个键盘码事件,当回车的时候,触发该事件,拿到todoName
- ##### 5.3 在父组件中定义一个pAddTodo方法,
- ##### 5.4 给插入子组件的标签注册一个自定义事件 @add-todo,通过该事件将父组件的pAddTodo绑定

```js
<todo-header @add-todo="pAddTodo"></todo-header>
```

- ##### 5.5 回车时,触发add-todo事件,并把拿到的todoName传递给父组件

```js
addTodo() {
    if (this.todoName.trim().length == 0) {
        return;
    }
    // console.log("我要添加数据:", this.todoName.trim());
    //回车后获取输入框的内容,调用自定义的方法,传递给父组件,
    this.$emit("add-todo", this.todoName.trim());
    //添加成功后,清空输入框的内容
    this.todoName = "";
}
```

- ##### 5.6 父组件拿到传递过来的数据,拼接成一个对象,再添加到list中去

```js
pAddTodo(name) {
    // console.log("父组件", name);
    //父组件拿到传过来的数据后,拼接成一个对象,存到list中去
    let id =
        this.list.length > 0 ? this.list[this.list.length - 1].id + 1 : 1;
    let obj = {
        id,
        name,
        done: false
    };
    //将对象添加到list的最后去
    this.list.push(obj);
}
```
### 6. 实现编辑功能(子传父)

- ##### 6.1 给列表组件添加一个editId = -1;

```js
data() {
	return {
		editId: -1
	};
},
```

- ##### 6.2 给li 注册一个双击事件,双击时 让 item.id = editId,显示编辑框

```js
//显示编辑状态
showEdit(id) {
    this.editId = id;
}
```

- ##### 6.3 显示编辑框后,修改内容
- ##### 6.4 给父组件定义一个方法,pEditList,

- ##### 6.5 给子组件所在标签注册一个自定义事件,@edit-list用于绑定父组件的pEditList.
- ##### 6.6 给编辑框注册回车事件,
- ##### 6.7 在回车事件中调用edit-list,把修改的内容和id传给父组件

```js
hideEdit(e) {
    //回车后,拿到该编辑框的内容,调用自定义事件,将数据传递给父组件
    // console.log(e.target.value);
    this.$emit("edit-list", e.target.value, this.editId);

    this.editId = -1;
}
```

- ##### 6.8 父组件根据传过去的数据修改list

```js
pEditList(newName, id) {
    // console.log("父组件", newName, id);
    //根据传递过来的数据,更改list里的任务
    this.list.find(item => item.id === id).name = newName;
    // console.log(this.list);
}
```

- 6.9 回车后,修改editId = -1,隐藏编辑框

### 7.实现数据持久化(本地存储)

##### 给 list注册一个深度监听器,一旦list有变化,就保存到本地存储

```js
watch: {
    list: {
        deep: true,
        handler(newVal) {
            //深度监听list的变化,保存到本地
            localStorage.setItem("list", JSON.stringify(newVal));
        }
    }
}
```

##### 一开始进入页面,从本地存储中获取list

```js
created() {
    //进入页面后,从本地获取数据
    this.list = JSON.parse(localStorage.getItem("list") || "[]");
},
```