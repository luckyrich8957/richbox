<template>
	<view>
		<!-- #ifdef H5 -->
		<view class="link-tip">为您转至新链接{{url}}</view>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<web-view :src="url"></web-view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data(){
			return{
				url:"",
			}
		},
		onLoad(e) {
			console.log(e);
			let url = decodeURIComponent(e.link);
			this.url = url;
			
			// #ifdef H5
			setTimeout(()=>{
			location.href=url	
			},500)
			// #endif
		},
		mounted() {
			console.log('aaaa');
		}
	}
</script>

<style>
	.link-tip {
		min-height: 500rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
	}
</style>
