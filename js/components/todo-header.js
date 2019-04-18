//注册组件头部
//实现添加数据(子传父)

Vue.component("todo-header", {
	template: `<header class="header">
                    <h1>todos</h1>
                    <input class="new-todo" placeholder="What needs to be done?" autofocus v-model='todoName' @keyup.enter='addTodo' />
               </header>`,
	data() {
		return {
			todoName: ""
		};
	},
	methods: {
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
	}
});
