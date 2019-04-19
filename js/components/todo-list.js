//完成组件列表
Vue.component("todo-list", {
	template: `<section class="main">
				<input id="toggle-all" class="toggle-all" type="checkbox" :checked='checkAll' @input='isCheckAll' />
				<label for="toggle-all" v-show='isCheckAllShow'>Mark all as complete</label>
				<ul class="todo-list">
					<li :class="{completed:item.done, editing:item.id == editId}" v-for="item in list" :key='item.id' @dblclick='showEdit(item.id)'>
						<div class="view">
							<input class="toggle" type="checkbox" :checked='item.done'  @input='statuChange($event,item.id)'/>
							<label>{{item.name}}</label>
							<button class="destroy" @click='delTodo(item.id)'></button>
						</div>
						<input class="edit" :value='item.name' @keyup.enter='hideEdit'/>
					</li>
				</ul>
			</section>`,
	props: ["list", "checkAll", "isCheckAllShow"],
	//添加一个editId,用于显示编辑状态
	data() {
		return {
			editId: -1,
			todoName: ""
		};
	},
	methods: {
		delTodo(id) {
			// console.log("子组件", id);
			//子传父,通过vue提供的$emit 方法,直接调用自定义的del-todo事件,就相当于调用了父组件的方法;
			//调用的时候还可以传参过去,在父组件就可以接收到子组件传过去的数据
			this.$emit("del-todo", id);
		},
		//显示编辑状态
		showEdit(id) {
			this.editId = id;
		},
		//隐藏编辑状态
		hideEdit(e) {
			//回车后,拿到该编辑框的内容,调用自定义事件,将数据传递给父组件
			// console.log(e.target.value);
			//修改一个bug:子组件不应该直接修改父组件的数据,所以不能使用v-model双向绑定数据,应该使用单向绑定
			//而是应该把修改后的值传给父组件, 让父组件修改
			this.todoName = e.target.value;
			//调用自定义方法,把拿到的值传递给父组件
			this.$emit("edit-list", this.todoName, this.editId);

			this.editId = -1;
		},
		//获取多选框的状态,并发送给父组件,让父组件修改
		statuChange(e, id) {
			// console.log(e.target.checked);
			// this.checked = e.target.checked;
			//在这里触发自定义事件,发送数据给父组件
			this.$emit("list-status", e.target.checked, id);
		},
		//是否选中全选(子传父)
		isCheckAll(e) {
			console.log("选中了", e.target.checked);
			//在这里触发自定义事件,把数据发送给父组件
			this.$emit("is-check-all", e.target.checked);
		}
	}
});
