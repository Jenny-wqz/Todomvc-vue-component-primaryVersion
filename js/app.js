(function(window) {
	const vm = new Vue({
		el: "#app",
		created() {
			//进入页面后,从本地获取数据
			this.list = JSON.parse(localStorage.getItem("list") || "[]");
		},
		data: {
			list: []
		},
		watch: {
			list: {
				deep: true,
				handler(newVal) {
					//深度监听list的变化,保存到本地
					localStorage.setItem("list", JSON.stringify(newVal));
				}
			}
		},
		methods: {
			//在父组件中先定义一个方法,通过一个自定义事件在标签中将该方法和事件绑定,调用那个事件就相当于调用了该方法
			//在调用的时候传参,这样父组件就拿到了子组件的数据了
			pDelTodo(id) {
				// console.log("父组件", id);
				this.list = this.list.filter(item => item.id != id);
			},
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
			},
			//修改数据
			pEditList(newName, id) {
				// console.log("父组件", newName, id);
				//根据传递过来的数据,更改list里的任务
				this.list.find(item => item.id === id).name = newName;
				// console.log(this.list);
			},
			// //清除已完成的任务数(子传父)
			pClearCompleted() {
				// console.log("父组件,收到要清除");
				return (this.list = this.list.filter(item => !item.done));
			},
			//修改对应id的list的状态
			pListStatus(statu, id) {
				// console.log("父组件", status, id);
				//根据传过来的数据,修改list
				this.list.find(item => item.id == id).done = statu;
			},
			//实现全选
			pIsCheckAll(statu) {
				console.log("父组件收到", statu);

				this.list.forEach(item => (item.done = statu));
			}
		},
		computed: {
			//底部显示与隐藏(父传子)
			isFooterShow() {
				return this.list.length > 0;
			},
			//显示未完成任务的条数(父传子)
			pItemLeft() {
				return this.list.filter(item => !item.done).length;
			},
			//clearCompleted按钮的显示与隐藏(父传子)
			isClearCompletedShow() {
				return this.list.some(item => item.done);
			},
			//实现全选与反选(父传子)
			checkAll() {
				return this.list.every(item => item.done);
			},
			//全选按钮的显示与隐藏
			isCheckAllShow() {
				return this.list.length > 0;
			}
		}
	});
})(window);
