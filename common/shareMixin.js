export default {
	onShareAppMessage(res) {
		console.log(this.$mpShare,res);
		if(res.from!='button') return this.$mpShare
		console.log(res,'我是混入的');
			return {
				title: res.target.dataset.title,
				path: res.target.dataset.path,
				imageUrl: res.target.dataset.img
			}
	},
}
