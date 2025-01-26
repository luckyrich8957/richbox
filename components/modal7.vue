<template>
 <u-popup v-model='_show' :closeable="true" border-radius="40" mode='center' width="600rpx">
 <view class="content">
 	<view class="title">
 		奖品赠送
 	</view>
	<view class="text">
		奖品可赠送给您的好友，点击确认赠送好友按
		钮、转发给您的好友。好友申请领取后，您进
		行确认赠送即可完成赠送过程。发起赠送的奖
		品在 “盒柜-已赠送” 模块查看。
	</view>
	<view class="btns">
		<view class="btn t" @click="_show=false">
			取消
		</view>
		<view class="btn t1" @click="confirm">
			确认赠送
		</view>
	</view>
	<view class="tip">
		* 温馨提示：请谨慎选择赠送对象，防止遭遇诈骗
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
  methods: {
    confirm(){
       this.$emit('submit')
    }
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
		height: 516rpx;
		padding-top: 80rpx;
		.title{
			font-size: 36rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
			line-height: 1;
			text-align: center;
			margin: 0rpx auto 40rpx;
		}
		.text{
			padding:0 55rpx;
			font-size: 24rpx;
			font-family: PingFangSC;
			font-weight: 300;
			color: #333333;
			line-height: 30rpx;
			text-align: center;
		}
		.btns{
			margin-top: 40rpx;
			padding: 0 20rpx;
			display: flex;
			justify-content: space-between;
			.btn{
				width: 270rpx;
				height: 90rpx;
				background: #EEEEEE;
				border-radius: 16rpx;
				line-height: 90rpx;
				text-align: center;
				font-size: 30rpx;
				font-family: PingFangSC;
				font-weight: 400;
				color: #333333;
			}
			.t1{
				background-color: #EB555B;
				color: #fff;
			}
		}
		.tip{
			padding:0 35rpx;
			margin-top: 41rpx;
			font-size: 22rpx;
			font-family: PingFangSC;
			font-weight: 300;
			color: #EB555B;
		}
	}
</style>
