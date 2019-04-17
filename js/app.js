(function(window) {
	const vm = new Vue({
		el: "#app",
		data: {
			list: [
				{
					id: 2,
					name: "睡觉",
					done: true
				},
				{
					done: false,
					name: "打豆豆",
					id: 4
				},
				{
					name: "吃鸡",
					done: false,
					id: 5
				}
			]
		}
	});
})(window);
