<template>
 <u-popup v-model='_show' :closeable="true" border-radius="40" mode='center' width="600rpx">
 <view class="content">
 	<view class="title">
 		解锁成功
 	</view>
	<view class="text1">
		奖品解锁成功，可进行赠送、发货、分解等操作了
	</view>
	<view class="text" @click="_show=false">
		知道了
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
  props:['value'],
  methods: {},
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
		height: 386rpx;
		padding-top: 80rpx;
		.title{
			font-size: 36rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
			line-height: 1;
			text-align: center;
			margin-bottom:30rpx;
		}
		.text1{
			font-size: 24rpx;
			font-family: PingFangSC;
			font-weight: 300;
			color: #333333;
			line-height: 30rpx;
			width: 478rpx;
			margin: 0 auto;
		}
		.text{
			width: 560rpx;
			height: 90rpx;
			background: #EEEEEE;
			border-radius: 16rpx;
			margin: 35rpx auto 0;
			line-height: 90rpx;
			font-size: 30rpx;
			font-family: PingFangSC;
			font-weight: 400;
			color: #333333;
			text-align: center;
		}
	}
</style>
