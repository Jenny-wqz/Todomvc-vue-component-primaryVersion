//完成组件列表
Vue.component("todo-list", {
	template: `<section class="main">
				<input id="toggle-all" class="toggle-all" type="checkbox" />
				<label for="toggle-all">Mark all as complete</label>
				<ul class="todo-list">
					<li :class="{completed:item.done, editing:item.id == editId}" v-for="item in list" :key='item.id' @dblclick='showEdit(item.id)'>
						<div class="view">
							<input class="toggle" type="checkbox" v-model='item.done' />
							<label>{{item.name}}</label>
							<button class="destroy" @click='delTodo(item.id)'></button>
						</div>
						<input class="edit" v-model='item.name' @keyup.enter='hideEdit'/>
					</li>
				</ul>
			</section>`,
	props: ["list"],
	//添加一个editId,用于显示编辑状态
	data() {
		return {
			editId: -1
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
			this.$emit("edit-list", e.target.value, this.editId);

			this.editId = -1;
		}
	}
});
