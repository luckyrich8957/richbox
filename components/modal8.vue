<template>
 <u-popup v-model='_show' :closeable="true" border-radius="40" mode='center' width="600rpx">
 <view class="content">
 	<view class="label">
 		收件人
 	</view>
	<view class="info">
		{{addressInfo.fullname}}（{{addressInfo.mobile ? (addressInfo.mobile.substr(0,3) + '****' + addressInfo.mobile.substr(addressInfo.mobile.length - 4)) : ''}}）
	</view>
	<view class="label u-m-t-56">
		收货地址
	</view>
	<view class="address">
    {{addressInfo.province}} {{addressInfo.city}} {{addressInfo.district}} {{addressInfo.detail}}
	</view>
	<view class="tip">
		* 工作人员正在全力发货中，发货后将展示快递单
		号等详细信息。
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
  props:{
    value:{
      type:Boolean,
      default(){
        return false
      }
    },
    addressInfo:{
      type:Object,
      default() {
        return {
          fullname:'',
          mobile:'',
        }
      }
    }

  },
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
		height: 490rpx;
		padding: 0 57rpx;
		padding-top: 80rpx;
		.label{
			line-height: 1;
			margin-bottom: 25rpx;
			font-size: 24rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
		}
		.info{
			font-size: 26rpx;
			font-family: PingFangSC;
			font-weight: 300;
			color: #333333;
			line-height: 30rpx;
		}
		.address{
			height: 80rpx;
			font-size: 26rpx;
			font-family: PingFangSC;
			font-weight: 300;
			color: #333333;
			line-height: 36rpx;
		}
		.tip{
			margin-top: 41rpx;
			font-size: 22rpx;
			font-family: PingFangSC;
			font-weight: 300;
			color: #EB555B;
		}
	}
</style>
