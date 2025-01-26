<template>
 <u-popup v-model='_show' :closeable="true" border-radius="40" mode='center' width="600rpx">
 <view class="content">
 	<view class="title">
 		{{title}}
 	</view>
		<scroll-view scroll-y="true" style="height:690rpx; width: 488rpx; margin: 0 auto;">
				<u-parse :html="content"></u-parse>		
		</scroll-view>
 </view>
 </u-popup>
</template>

<script>
export default {
  data() {
    return {
		title:'规则',
		content:'',
	};
  },
  props:['uid','value'],
 async mounted() {
  const {data:{info}}=await this.$store.dispatch('user_getAgrementById',{id:this.uid})
  if(info){
	  this.title=info.key
	  this.content=info.val
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
		height: 900rpx;
		.title{
			height: 150rpx;
			font-size: 36rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
			padding-top: 60rpx;
			text-align: center;
		}
		
	}
</style>
