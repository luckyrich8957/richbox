<template>
	<view @click='click'>
		<u-popup v-model='_show' @click='click' :closeable="isclose" :mask-close-able='isclose' border-radius="16" mode='center' width="650rpx">
		<view class="content">
			<view class="title">
				分解成功
			</view>
			<view class="text">
				获得的K币请在 “我的-晶石” 模块查看
			</view>
			<view class="btns">
				<view class="t1" @click="()=>{$emit('del');$authRoute({url:'/pages/money/list',type:'reLaunch'})}">
					查看晶石
				</view>
				<view class="t2" @click='btnClick'>
					继续玩盲盒
				</view>
			</view>
		</view>
		</u-popup>
	</view>

</template>

<script>
export default {
  data() {
    return {

	};
  },
  
  props:['value','isclose'],
  methods: {
	  btnClick() {
		this.$emit('del')
	  	const a=this.$cache('back_goods')
	    let url=a?a:'/pages/tabbar/index/index'
	    this.$authRoute({
	      url: url,
		  type:'reLaunch'
	    });
	  },
  },
  computed:{
	  _show:{
		  get(){
			  return this.value
		  },
		  set(val){
			  this.$emit('input',val)
		  }
	  }
  },
};
</script>

<style lang="scss" scoped>
	.content{
		padding: 40rpx 40rpx 30rpx;
		.title{
			font-size: 36rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
			line-height: 1;
			text-align: center;
			margin: 0rpx auto 25rpx;
		}
		.btns{
			height: 100rpx;
			display: flex;
			margin-top: 50rpx;
			justify-content: space-between;
			align-items: center;
			view{
				width: 45%;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 10rpx;
				height: 80rpx;
			}
			.t1{
				background-color: red;	
				color: #fff;
			}
			.t2{
				border: 1px solid #aaa;
			}
		}
		.text{
			line-height: 1;
			font-size: 24rpx;
			font-family: PingFangSC;
			font-weight: 300;
			color: #333333;
			text-align: center;
		}
	}
</style>
