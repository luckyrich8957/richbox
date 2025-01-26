<template>
	<u-my-mask :show="show" :custom-style='customStyle'>
		<view class="warp" v-if='show'>
			<view class="rect" :style='{width:"750rpx",height:"600rpx",backgroundImage:"url("+url+")"}' @tap.stop>
			</view>
		</view>
	</u-my-mask>
</template>

<script>
	export default {
		name: "myMask",
		data() {
			return {

			};
		},
		props: {
			customStyle:{
				type:Object,
				default(){
					return {background: 'rgba(0, 0, 0, 1)'}
				},
			},
			show:{
				type: Boolean,
				default: false
			},
			size:{
				type: String,
				default:'300rpx'
			},
			url:{
				type: String,
				default:'https://smiaoshen.oss-cn-hangzhou.aliyuncs.com/image/3.gif'
			},
		},
	}
</script>

<style lang="scss" scoped>
.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.rect {
		width: 300px;
		height: 300px;
		background-size: 100% 100%;
	}
</style>
