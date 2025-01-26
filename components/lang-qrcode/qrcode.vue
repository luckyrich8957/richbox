<template>
	<view class="content">
		<view class="qr-box">
			<canvas canvas-id="qrcode" v-show="qrShow" style="width: 300rpx;margin: 0 auto;"/>
		</view>
	</view>

</template>

<script>
	import uQRCode from '@/common/uqrcode.js'
	export default {
		props: [],
		data() {
			return {
				qrShow: false
			}
		},
		onLoad() {

		},
		methods: {



			qrFun: function(text) {

				this.qrShow = true
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: text,
					size: 150,
					margin: 0,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H,
					success: res => {}
				})
			}

		}
	}
</script>

<style>

	.qr-box {
		width: 400rpx;
		height: 460rpx;
		margin: 0 auto;
	}
</style>
