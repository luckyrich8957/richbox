<template>
 <u-popup v-model='_show' :closeable="true" border-radius="40" mode='center' width="600rpx">
 <view class="content">
 	<view class="title">
 		分解成功
 	</view>
	<view class="text">
		获得的K币请在 “我的-K币” 模块查看
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
		height: 300rpx;
		padding-top: 100rpx;
		.title{
			font-size: 36rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
			line-height: 1;
			text-align: center;
			margin: 0rpx auto 25rpx;
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
