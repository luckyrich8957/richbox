<template>
 <u-popup v-model='_show' :closeable="true" border-radius="40" mode='center' width="600rpx">
 <view class="content">
 	<view class="title">
		晶石兑换K币
 	</view>
	<view class="text" @click="_show=false">
		兑换 <text style='color: red;padding: 0 .5em;'>{{num}}</text> K币成功
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
  props:['value','num'],
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
		height: 300rpx;
		padding-top: 80rpx;
		.title{
			font-size: 24rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
			line-height: 1;
			text-align: center;
			margin-bottom:25rpx;
		}
		.text{
			width: 560rpx;
			height: 100rpx;
			background: #FAFAFA;
			border-radius: 16rpx;
			margin: 0 auto;
			line-height: 100rpx;
			font-size: 36rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
			text-align: center;
		}
	}
</style>
