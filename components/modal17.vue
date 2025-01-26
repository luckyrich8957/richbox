
<template>
	<u-mask :show="_show" @click="_show = false">
		<view class="warp" @tap.stop>
			
			<view class="rect" >
				<swiper class="swiper" :autoplay="false" :circular='true' :current="uCurrent" @change="change">
					<swiper-item style='height: 100%;'  v-for='item in goods'>
						<view class="swiper-item" style='height: 100%;'>
							<text class="rect-title">
								恭喜你在当前盒子中抽中<text style='color: #DF5358;font-weight: 600;'>隐藏奖励</text>
							</text>
							<text class='num'>
								<text style='font-weight: 600;padding-right: 10rpx;'>{{item.blind_reward_name}} </text> X{{item.goods_num}}
							</text>
							<u-image width='280rpx' height='280rpx' :src='item.img'></u-image>
							<view class="name">
								{{item.reward_name}}
							</view>
							<view class="tip">
								（所得奖励在 盒柜 可查）
							</view>
						</view>
					</swiper-item>
				</swiper>
					<view  class="u-swiper-indicator" v-if='!one'>
					<view class="u-indicator-item-dot" :class="{ 'u-indicator-item-dot-active': index == uCurrent }" v-for="(item, index) in 5"
						 :key="index"></view>
					</view>	
				</view>
				
			<view class="del" @click='_show=false'>
				
			</view>
		</view>
	</u-mask>
</template>

<script>
export default {
  data() {
    return {
		uCurrent:0,
	};
  },
  props:{
	  value:{
		  type:Boolean,
		  default:false,
	  },
	  one:{
		  type:Boolean,
		  default:true
	  },
	  goods:{
		  type:Array,
		  default:()=>([])
	  },
  },
  methods: {
	  change(e){
		 this.uCurrent= e.detail.current
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
	.u-indicator-item-dot {
		width: 14rpx;
		height: 14rpx;
		margin: 0 6rpx;
		border-radius: 20rpx;
		transition: all 0.5s;
		background-color: rgba(0, 0, 0, 0.3);
	}
	
	.u-indicator-item-dot-active {
		background-color: rgba(255, 255, 255, 0.8);
	}
	.u-swiper-indicator{
		display: flex;
		justify-content: center;
	}
	.swiper{
		height: 500rpx;
		width: 450rpx;
		margin-top:180rpx;
	}
	.swiper-item{
				display: flex;
				flex-direction: column;
				align-items: center;
	}
	.warp {
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 100%;
		}
	
		.rect {
			margin-top: 258rpx;
			width: 651rpx;
			height: 724rpx;
			background-size: 100% 100%;
			background-image:url('https://manghe.jikechaowan.com/image/new/model-new.png');
			display: flex;
			flex-direction: column;
			align-items: center;
			.rect-title{
			
				font-size: 26rpx;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #333333;
				line-height: 38rpx;
			}
			.num{
				font-size: 28rpx;
				font-family: Microsoft YaHei;
				color: #DF5358;
				line-height: 40rpx;
			}
			.name{
				margin-top: 20rpx;
				width: 320rpx;
				font-size: 26rpx;
				font-family: Microsoft YaHei;
				font-weight: 400;
				text-align: center;
				color: #333333;
				line-height: 36rpx;
			}
			.tip{
				font-size: 16rpx;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #DF5358;
				line-height: 34rpx;
			}
		}
		.del{
			width: 60rpx;
			height: 60rpx;
			margin-top: 43rpx;
			background-size: 100% 100%;
			background-image:url('https://manghe.jikechaowan.com/image/new/del-new.png'); 
		}
</style>