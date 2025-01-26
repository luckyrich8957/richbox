<template>
 <u-popup v-model='_show' z-index='10077' :closeable="true" border-radius="40" mode='bottom'>
 <view class="content">
 	<view class="title">
 		奖品详情
 	</view>
		<scroll-view scroll-y="true" style="height:850rpx; width: 700rpx; margin: 0 auto;">
				<u-parse :html="content"></u-parse>		
		</scroll-view>
 </view>
 </u-popup>
</template>

<script>
export default {
  data() {
    return {
		
	};
  },
  props:['value','content'],
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
		height: 1000rpx;
		.title{
			height: 100rpx;
			font-size: 28rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
			padding-top: 40rpx;
			text-align: center;
		}
		
	}
</style>
