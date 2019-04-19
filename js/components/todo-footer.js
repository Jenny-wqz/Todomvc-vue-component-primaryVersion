//完成底部组件
//完成底部的显示与隐藏
Vue.component("todo-footer", {
	template: `<footer class="footer">
				<span class="todo-count"><strong>{{itemLeft}}</strong> item left</span>
				<button class="clear-completed" @click='clearCompleted' v-show='isClearCompletedShow'>Clear completed</button>
			   </footer>`,
	// 接收父组件传过来的数据
	props: ["itemLeft", "isClearCompletedShow"],
	methods: {
		//给clearCompleted按钮注册点击事件,点击时,告诉父组件我要删除已完成的
		clearCompleted() {
			//点击后,触发自定义事件
			console.log("我被点击了");

			this.$emit("clear-completed");
		}
	}
});
