<template>
 <u-popup v-model='_show' :closeable="isclose" :mask-close-able='isclose' border-radius="16" mode='center' width="600rpx">
 <view class="content">
 	<view class="title">
 		兑换成功
 	</view>
	<view class="text">
		您可以在“我的-盒柜”模块查看兑
		换的奖品
	</view>
	<view class="btns">
		<view class="t2" @click='_show=false'>
			继续兑换
		</view>
		<view class="t1" @click="$authRoute({url:'/pages/reward/reward'})">
		去查看
		</view>
		
	</view>
 </view>
 </u-popup>
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
	  	const a=this.$cache('back_goods')
	    let url=a?a:'/pages/tabbar/index/index'
	    this.$authRoute({
	      url: url,
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
		padding: 40rpx 60rpx 30rpx;
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
