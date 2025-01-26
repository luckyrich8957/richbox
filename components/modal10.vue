<template>
 <u-popup v-model='_show' :closeable="true" border-radius="40" mode='center' width="600rpx">
 <view class="content">
 	<u-image src='https://manghe.jikechaowan.com/image/logo.png' width="112rpx" height="112rpx"></u-image>
	<view class="text">
		提现功能仅在“极客潮玩”APP渠道支持
	</view>
	<view class="tip">
		请下载APP操作提现
	</view>
	<view class="btn">
		下载极客潮玩APP
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
		height: 478rpx;
		padding-top: 80rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		.text{
			margin-top: 36rpx;
			line-height: 1;
			font-size: 28rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
		}
		.tip{
			line-height: 1;
			font-size: 28rpx;
			margin-top: 16rpx;
			font-size: 24rpx;
			font-family: PingFangSC;
			font-weight: 400;
			color: #B8B8BA;
		}
		.btn{
			margin-top: 42rpx;
			width: 560rpx;
			height: 90rpx;
			background: #323232;
			border-radius: 16rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #FFFFFF;
		}
	}
</style>
