<template><view class="yzm_body">
	<view class="zhuti">
		<view :class="['msg', msgColor]">{{msg}}</view>
		<view class="title">拖動下方滑塊完成拼圖</view>
		<movable-area>
			<view class="msg1" v-if="zhutuPic.length==0">{{msgText}}</view>
			<view class="pic" v-else :style="{'background-image': 'url('+zhutuPic+')'}"></view>
			<view class="line"></view>
			<movable-view 
			class="movable"
				:style="{'background-image': 'url('+futuPic+')'}" :x="x" :damping="100" direction="horizontal"
				@change="onChange" @touchend="touchEnd">
				<view class="blue"></view>
			</movable-view>
		</movable-area>
		<view class="close iconfont icon-guanbi1" @click="$emit('close')"></view>
	</view>
</view></template>
<script>
export default{
	props:{
		mobile:{
			type:[String,Number]
		}
	},
	data(){
		return {
			key:'',
			zhutuPic: '',//主图
			futuPic: '',//缺口图
			x: 10,//当前的位置
			msg: '安全驗證',//提示信息
			msgColor: '',
			msgText: '加載中',
			
			huadong: false,//是否已经滑动
		};
	},
	mounted(){//该组件被挂载到实例上去之后调用
		this.shuaxin()
		//#ifdef H5
			if(this.$isPc === true){//PC端
				document.body.addEventListener('mouseup', this.touchEnd);//鼠标抬起事件
			}
		//#endif
	},
	beforeUnmount(){//实例销毁之前调用。在这一步，实例仍然完全可用
		//#ifdef H5
			if(this.$isPc === true){//PC端
				document.body.removeEventListener('mouseup', this.touchEnd);//鼠标抬起事件
			}
		//#endif
	},
	methods: {
	async shuaxin(){
		try{
			const {data}=await this.$store.dispatch('createCode',{
				phone:this.mobile
			})
			const {key}=data
			this.key=key
			const [{data:{url:url1}},{data:{url:url2}}]=await Promise.all([this.$store.dispatch('createMainImg',{key}),this.$store.dispatch('createMinor',{key})])
			this.zhutuPic =url1+'?v='+(+new Date())
			this.futuPic=url2+'?v='+(+new Date())
			console.log(url2,url1);
			
		}catch(e){
			this.$u.toast(e.msg||'图片生成失败请重新生成')
		}
		
			// uni.request({method: 'get',dataType: 'json',timeout: 7000,
			// 	url: this.$config.HTTP_REQUEST_URL+'',
			// 	data: {
			// 		session_id: this.session_id
			// 	},
			// 	success: (res) => {
			// 		if(res.data.code === 1){//生成验证码成功
			// 			//time参数作用是让刷新后图片会重新获取
			// 			this.zhutuPic = 'http://192.168.31.2/ajax/yzm_pic.php?type=zhutu&session_id='+this.session_id+'&time='+(new Date()*1)
			// 			this.futuPic = 'http://192.168.31.2/ajax/yzm_pic.php?type=futu&session_id='+this.session_id+'&time='+(new Date()*1)
			// 		}
			// 	},
			// 	complete: (res) => {
			// 		//错误的提示
			// 			setTimeout(() => {
			// 				if(res.data.code === 2){
			// 					this.msgText = res.data.msg;
			// 				}
			// 			}, 300);
			// 	}
			// });
		},
		onChange(e){//拖动过程中触发、
			if(e.detail.source === 'touch'){//只有是手动触发的，才执行
				this.huadong = true
				this.x = e.detail.x
			}
		},
		doudong(){//抖动 【总耗时 500ms】
			setTimeout(() => {if(this.huadong){return}//如果在拖动中，就不执行了
				this.x -= 15;
				setTimeout(() => {if(this.huadong){return}
					this.x += 30
					setTimeout(() => {if(this.huadong){return}
						this.x -= 30
						setTimeout(() => {if(this.huadong){return}
							this.x += 30
							setTimeout(() => {if(this.huadong){return}
								this.x = 10
							},100);
						},100);
					},100);
				},100);
			},100);
		},
	async touchEnd(){//手指离开了
			if(!this.huadong) return
			console.log(parseInt(this.x * (679 / uni.upx2px(550))));
			try{
				this.msg = '驗證中...'
				this.msgColor = ''
				const {data}=await this.$store.dispatch('vervifyCode',{key:this.key,x: parseInt(this.x * (679 / uni.upx2px(550)))})
				this.$emit('success', {x: parseInt(this.x * (679 / uni.upx2px(550)))})
				this.msg = '驗證成功'
				this.msgColor = 'green'
				setTimeout(() => {
					this.$emit('close')
				}, 300);
			}catch(res){
				this.huadong = false;//没有在拖动中了
				this.doudong()//抖动
				this.msg = res.msg
				this.msgColor = 'red'
				if(res.msg === '验证码错误次数过多，请重新获取'){
				this.msg = '驗證失敗次數過多，已重新獲取'
					setTimeout(() => {
						this.shuaxin()
					},500);
				}
				setTimeout(() => {
					this.msg = '安全驗證'
					this.msgColor = ''
				}, 3500);
			}
				// this.msg = '验证中...'
				// this.msgColor = ''
				// uni.request({method: 'get',dataType: 'json',timeout: 7000,
				// 	url: this.$config.HTTP_REQUEST_URL+'',
				// 	data: {
				// 		session_id: this.session_id,
				// 		x: parseInt(this.x * (679 / uni.upx2px(550)))//因为x是相对于movable-area容器宽度的，所以需要算出图片实际宽度相 对于 容器宽度的比例
				// 	},
				// 	success: (res) => {
				// 		if(res.data.code === 1){
				// 			this.$emit('success', {x: parseInt(this.x * (679 / uni.upx2px(550)))})
				// 			this.msg = '验证成功'
				// 			this.msgColor = 'green'
				// 			setTimeout(() => {
				// 				this.$emit('close')
				// 			}, 300);
				// 		}
				// 	},
				// 	complete: (res) => {
				// 		this.huadong = false;//没有在拖动中了
				// 		if(res.data.code === 2){
				// 			this.doudong()//抖动
				// 			this.msg = res.data.msg
				// 			this.msgColor = 'red'
				// 			if(res.data.msg === '验证码错误次数过多，请重新获取'){
				// 				this.msg = '验证失败次数过多，已重新获取'
				// 				setTimeout(() => {
				// 					this.shuaxin()
				// 				},500);
				// 			}
				// 			setTimeout(() => {
				// 				this.msg = '安全验证'
				// 				this.msgColor = ''
				// 			}, 3500);
				// 		}
				// 	}
				// });
			
		},
	},
}
</script>
<style lang="scss">
@font-face {
  font-family: "iconfont"; /* Project id 2455983 */
  src: 
       url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAALEAAsAAAAABngAAAJ5AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACCcApweQE2AiQDCAsGAAQgBYRnBzEbtgUR1ZMhZH8r7lgI/uPREFlgoVBNm5PkuTjzBokvYm9bLZ7Q8ql1k55Aj4zHA0PJeeB/P9x9MjPtolU0rW5JQ58nSAudRqXRCFGs4ZnI+eCEm0caBUARHIiSJ0Je/uBN7D5M8JMncnEcb597Vhpwgr8zfqrALG7aKReheBK7c9X1PWkpfRCyJ+xa5EeKSpKryiT9ZEEApKX5fpaTvxt1KX8DeuAFkS/0PYVK65ROBxbA6AOlV0sohJmgx6MguyNQSw7DMwIqzVsWN3eXu6g9l5xFp8wZDuT14dw7KcrliCzTfLmgFN2bhZdKiE/xxIv48+FvAqKSxGnaPdsa8bZnd0ECRaUvXa6DPhZRgoRpZMJhf2ZbEtr4pNKTDdLWLPBD8aFbOLRD+Ouc2mrQTcVnknz5UWsjyOloL0YmjSXW1/YPW4yJ8wNQ0CBGoTk8cxF1ZFyBX8NkS3/87kgP5pT/K75uD9c2/dWjVVAsXYoFBF57v7LKf5TB1zsOFctgPsp36An8HfUEJGYzRszXKBEQVWlSKqLSjVPgBBp9m2o03UUhKNd0L74yXTmScoNU5iZRosoiSpVbQqUpW4erNLmWhFyBUTcEQb1XiGq9QVLvHZW59yjR6idK1fuPSsfBOK/KaBD0mlAyGlA/8Lpk6+kc272ie0VJTckn0uJpHNqqqeb3mJHm2LC8XcdswVJJsBMfwxgLTFRG1FwNzFNf17btLZUuSawJJaMB9QOvS7Yhmcvfd0X3ipJA6pmhxVP70FYNQO2VDPU8yCvL23XMFiyVBDt5FsZYYGqfNaLmapiQmvraJVlUqbbX0t8TBnDMuHKnJpJ7yax8KwQA') format('woff2');
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-guanbi1:before {
  content: "\e696";
}
.yzm_body{
	background: rgba(0,0,0,0.3);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999999;
	width: 750rpx;
	height: 100vh;
	.zhuti{
		background: #FFF;
		width: 600rpx;
		position: absolute;
		top: 50%;left: 50%;
		transform: translate(-50%,-50%);
		padding: 20rpx 25rpx 30rpx 25rpx;
		border-radius: 15rpx;
		.msg{
			color: #999;
			font-size: 24rpx;
			&.red{color: red;}
			&.green{color: green;}
		}
		.close{
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			color: #A6A6A6;
			font-size: 36rpx;
			padding: 10rpx;
		}
		.title{
			font-size: 28rpx;
			line-height: 38rpx;
			color: #333;
			margin: 0 0 7rpx 0;
		}
		movable-area{
			width: 100%;
			height: auto;
			.msg1{
				width: 100%;
				line-height: 310rpx;
				text-align: center;
				font-size: 30rpx;
				color: #999;
				background: #F8F8F8;
			}
			.pic{
				width: 100%;
				height: 310rpx;
				background-color: #F8F8F8;
				background-size: 100% 310rpx;
			}
			.line{
				background: #e4e4e4;
				width: 100%;
				height: 20rpx;
				margin: 42rpx 0 15rpx 0;
				border-radius: 50rpx;
				display: inline-block;
			}
			movable-view{
				width: 72rpx;
				height: 310rpx;
				background-size: 100% 310rpx;
				background-position: center center;
				.blue{
					box-shadow: rgba(26, 101, 255, 0.52) 0px 0px 10px 1px;
					width: 100rpx;
					height: 50rpx;
					border-radius: 50rpx;
					position: absolute;
					top: 100%;left: 0;
					background: rgb(26, 101, 255) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAcAgMAAABuexVFAAAACVBMVEUAAADCwsL9/f1P0DqbAAAAAXRSTlMAQObYZgAAAB1JREFUGNNjCGVgYGANABKhyMwoEHMBkIgaZWIwAdyJJQnaJRg5AAAAAElFTkSuQmCC) no-repeat;
					background-size: auto 20rpx;
					background-position: 50% 50%;
					margin: 25rpx 0 0 -14rpx;
				}
			}
		}
	}
}
</style>
