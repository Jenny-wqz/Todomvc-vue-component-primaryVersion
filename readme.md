## 使用组件化开发，完成 TodoMVC 案例

### 1. 安装 vue(引入)+配置

为了方便,我是直接把 vue 引到文件中的

### 2. 抽离组件

##### 2.1 在 js 文件夹里 创建 components 文件夹,然后再创建以下三个文件

- todo-head.js
- todo-list.js
- todo-footer.js

##### 2.2 在某个.js 文件里面注册对应的组件

```js
Vue.component("todo-head", {
	template: `把对应的结构copy过来`
});
```

##### 2.3 在 index.html 引入对应的注册组件代码

```js
<script src="./... .js" />
```

2.4 把组件名称当成标签使用(在对应的地方引入)

```js
<todo-header />
```

### 3 列表展示(父传子)

##### 3.1 通过属性将父组件里的 list 传给子组件

```js
<todo-list :list="list"></todo-list>
```

##### 3.2 通过子组件里的配置项 props,拿到父组件传递过来的数据

```js
props: ["list"],
```

##### 3.3 遍历拿到的数据 list,动态渲染页面(使用 v-for,并且绑定 key)

```js
<li :class="{completed:item.done}" v-for="item in list" :key='item.id'>
```

### 4. 实现删除功能(子传父)

点击删除按钮时,拿到对应的 id,传递给父组件,父组件根据接收到传递过来的 id,删除对应的数据

- ##### 4.1 先在子组件中注册一个点击事件,点击时,获取点击那一条的 id
- ##### 4.2 先在父组件中定义一个方法 pDelTodo
- ##### 4.3 然后在插入子组件的标签中自定义一个事件,用于绑定父组件的方法 @del-todo = 'pDelTodo'

```js
<todo-list :list="list" @del-todo="pDelTodo"></todo-list>
```

- ##### 4.4 在点击事件中触发 del-todo 事件,也就是父组件中的 pDelTodo,同时把 id 传递给父组件

```js
delTodo(id) {
    // console.log("子组件", id);
    //子传父,通过vue提供的$emit 方法,直接调用自定义的del-todo事件,就相当于调用了父组件的方法;
    //调用的时候还可以传参过去,在父组件就可以接收到子组件传过去的数据
    this.$emit("del-todo", id);
}
```

- ##### 4.5 父组件拿到传过来的 id 后,根据 id 删除对应的数据

```js
pDelTodo(id) {
    // console.log("父组件", id);
    this.list = this.list.filter(item => item.id != id);
},
```

### 5. 实现添加任务功能(子传父)

- ##### 5.1 在头部组件中定义一个 todoName,用于绑定文本框
- ##### 5.2 给文本框注册一个键盘码事件,当回车的时候,触发该事件,拿到 todoName
- ##### 5.3 在父组件中定义一个 pAddTodo 方法,
- ##### 5.4 给插入子组件的标签注册一个自定义事件 @add-todo,通过该事件将父组件的 pAddTodo 绑定

```js
<todo-header @add-todo="pAddTodo"></todo-header>
```

- ##### 5.5 回车时,触发 add-todo 事件,并把拿到的 todoName 传递给父组件

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

- ##### 5.6 父组件拿到传递过来的数据,拼接成一个对象,再添加到 list 中去

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

- ##### 6.1 给列表组件添加一个 editId = -1;

```js
data() {
	return {
		editId: -1
	};
},
```

- ##### 6.2 给 li 注册一个双击事件,双击时 让 item.id = editId,显示编辑框

```js
//显示编辑状态
showEdit(id) {
    this.editId = id;
}
```

- ##### 6.3 显示编辑框后,修改内容
- ##### 6.4 给父组件定义一个方法,pEditList,

- ##### 6.5 给子组件所在标签注册一个自定义事件,@edit-list 用于绑定父组件的 pEditList.
- ##### 6.6 给编辑框注册回车事件,
- ##### 6.7 在回车事件中调用 edit-list,把修改的内容和 id 传给父组件

```js
hideEdit(e) {
    //回车后,拿到该编辑框的内容,调用自定义事件,将数据传递给父组件
    // console.log(e.target.value);
    this.$emit("edit-list", e.target.value, this.editId);

    this.editId = -1;
}
```

- ##### 6.8 父组件根据传过去的数据修改 list

```js
pEditList(newName, id) {
    // console.log("父组件", newName, id);
    //根据传递过来的数据,更改list里的任务
    this.list.find(item => item.id === id).name = newName;
    // console.log(this.list);
}
```

- 6.9 回车后,修改 editId = -1,隐藏编辑框

### 7.实现数据持久化(本地存储)

##### 给 list 注册一个深度监听器,一旦 list 有变化,就保存到本地存储

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

##### 一开始进入页面,从本地存储中获取 list

```js
created() {
    //进入页面后,从本地获取数据
    this.list = JSON.parse(localStorage.getItem("list") || "[]");
},
```



### 8. 底部功能的完善

------

#### 8.1 如果没有一条数据,就让底部隐藏

##### 8.1.1 使用计算属性监听父组件的list，然后传给子组件

```js
//底部显示与隐藏(父传子)
isFooterShow() {
    return this.list.length > 0;
},
```

##### 8.1.2 在插入子组件的标签中：

```js
<todo-footer v-show="isFooterShow"></todo-footer>
```



#### 8.2 底部未完成数据的条数（item left）

##### 8.2.1 使用计算属性监听父组件的list ，找未完成的任务的条数，然后传给子组件

```js
显示未完成任务的条数(父传子)
pItemLeft() {
    return this.list.filter(item => !item.done).length;
},
```

##### 8.2.2 在插入子组件的标签中：

```js
<todo-footer :item-left="pItemLeft"></todo-footer>
```

##### 8.2.3 在子组件中接收传过来的数据

```js
props: ["itemLeft"],
//这样就拿到了父组件传过来的数据，直接在对应的地方使用即可    
```



#### 8.3 clearCompleted按钮的显示与隐藏

##### 8.3.1 使用计算属性，监听父组件中是否有已完成的任务，返回结果给子组件。

```js
//clearCompleted按钮的显示与隐藏(父传子)
isClearCompletedShow() {
    return this.list.some(item => item.done);
},
```

##### 8.3.2 在插入子组件的标签中：

```js
<todo-footer :is-clear-completed-show="isClearCompletedShow"></todo-footer>
```

##### 8.3.3 在子组件中接收传过来的数据

```js
props: ["isClearCompletedShow"],
//这样就拿到了父组件传过来的数据，直接在对应的地方使用即可    
```



#### 8.4 点击clearCompleted按钮清除已完成的任务

##### 8.4.1 给clearCompleted按钮注册点击事件

```js
<button @click='clearCompleted' >Clear completed</button>
```

##### 8.4.2 注册一个自定义事件，用于绑定父组件的方法

```js
<todo-footer
@clear-completed="pClearCompleted"
></todo-footer>
```

##### 8.4.3 然后在点击事件中触发自定义事件

```js
methods: {
    //给clearCompleted按钮注册点击事件,点击时,告诉父组件我要删除已完成的
    clearCompleted() {
        //console.log("我被点击了");
        //点击后,触发自定义事件 ，告诉父组件我要删除
        this.$emit("clear-completed");
    }
}
```

##### 8.4.4 在父组件中注册一个事件，当该事件被子组件触发后，就清除list中已经完成的任务

```js
//清除已完成的任务数(子传父)
pClearCompleted() {
    // console.log("父组件,收到要清除");
    return (this.list = this.list.filter(item => !item.done));
},
```



### 9.全选和反选

#### 9.1修改每一条数据的选中状态(子传父)

​	每一个多选框都不应该使用v-model 双向绑定list中的数据,而是要单向绑定 v-bind.   

##### 9.1.1 给每个多选框注册一个input事件,通过该事件拿到要修改的状态和id,修改点击的那一条的done

```js
<input class="toggle" type="checkbox" :checked='item.done'  @input='statuChange($event,item.id)'/>
```

##### 9.1.2 给子组件注册一个自定义事件,通过自定义事件绑定父组件的事件

```js
<todo-list @list-status="pListStatus"></todo-list>
```

##### 9.1.3 在input事件中,获取多选框的状态,并发送给父组件,让父组件修改

```js
//获取多选框的状态,并发送给父组件,让父组件修改
statuChange(e, id) {
    // console.log(e.target.checked);
    // this.checked = e.target.checked;
    //在这里触发自定义事件,发送数据给父组件
    this.$emit("list-status", e.target.checked, id);
},
```

##### 9.1.4 给父组件注册一个事件,用于接收子组件传过来的数据,修改对应id的list的状态

```js
//修改对应id的list的状态
pListStatus(statu, id) {
    // console.log("父组件", status, id);
    //根据传过来的数据,修改对应list的状态
    this.list.find(item => item.id == id).done = statu;
},
```



#### 9.2 实现反选(父传子)

##### 9.2.1 通过计算属性,监听list的所有done,如果都为true,返回给子组件

```js
//实现反选(父传子)
checkAll() {
    return this.list.every(item => item.done);
},
```

##### 9.2.2 在插入子组件中的标签中绑定父组件的checkAll

```html
<todo-list :check-all="checkAll"></todo-list>
```

##### 9.2.3 然后在子组件中,接收传过来的数据

```js
props:['checkAll']
```

##### 9.2.4 给全选框绑定该值(如果传过来的值为true,则表示全选被选中)

```js
<input id="toggle-all" class="toggle-all" type="checkbox" :checked='checkAll' />
```



#### 9.3 实现全选(子传父)

##### 9.3.1 给全选框注册input事件 isCheckAll

```js
<input id="toggle-all" class="toggle-all" type="checkbox" :checked='checkAll' @input='isCheckAll' />
```

##### 9.3.2 给子组件所在标签注册自定义事件,用于绑定父组件的事件pIsCheckAll

```html
<todo-list @is-check-all="pIsCheckAll"></todo-list>
```

##### 9.3.3 在input事件中,触发自定义事件,把全选框的选中状态发送给父组件

```js
//是否选中全选(子传父)
isCheckAll(e) {
    //console.log("选中了", e.target.checked);
    //在这里触发自定义事件,把数据发送给父组件
    this.$emit("is-check-all", e.target.checked);
}
```

##### 9.3.4 在父组件的方法中,拿到全选框的选中状态,然后让list中所有任务done = true

```js
//实现全选
pIsCheckAll(statu) {
    //console.log("父组件收到", statu);
    this.list.forEach(item => (item.done = statu));
}
```



#### 10. 全选按钮的显示与隐藏

##### 10.1 通过计算属性,判断list的长度

```js
//全选按钮的显示与隐藏
isCheckAllShow() {
    return this.list.length > 0;
}
```

##### 10.2  在子组件所在标签通过属性绑定父组件的isCheckAllShow

```html
<todo-list  :is-check-all-show="isCheckAllShow" ></todo-list>   
```

##### 10.3  在子组件中获取父组件传过来的数据,然后通过v-bind绑定全选框就可以了

```js
props: ["isCheckAllShow"]
```

