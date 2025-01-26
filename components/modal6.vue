<template>
 <u-popup v-model='_show' @close="_show=false " :closeable="true" border-radius="40" mode='center' width="600rpx">
 <view class="content">
 	<view class="title">
 		解开锁定
 	</view>
	<view class="text">
		解开锁定后，奖品将可以进行操作。
	</view>
	<view class="btns">
		<view class="btn t" @click="_show=false">
			取消
		</view>
		<view class="btn t1" @click="sureUnlock">
			确认解锁
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
  props:['value'],
  methods: {
    sureUnlock(){
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
		height: 356rpx;
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
				background: #000;
				color: #fff;
			}
			
		}
	}
</style>
