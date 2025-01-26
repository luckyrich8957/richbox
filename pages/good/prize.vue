<template>
	<view class="pages u-skeleton">
		<u-swiper :border-radius='0' :height='750' :list='list' class='u-skeleton-rect' indicator-pos='bottomRight'
			mode='number'></u-swiper>
		<view class="title u-skeleton-fillet">
			<view v-if='info.seller_type==0' class="tip">
				预售
			</view>
			{{ info.reward_name }}
		</view>
		<view class="num u-skeleton-fillet">
			<view class="num-l">
				<u-image height='35rpx' src='/static/material/crystal.png' width='26rpx'></u-image>
				<text class="num1">{{ info.price }}</text>
				<text class="num2">{{ info.origin_price }}</text>
			</view>
			<u-icon name='zhuanfa' size='45rpx' @click='showShare=true'></u-icon>
		</view>
		<view class="parse">
			<view class="parse-title u-skeleton-fillet">
				奖品详情
			</view>
			<u-parse :html="content" class="u-skeleton-fillet"></u-parse>
		</view>
		<u-skeleton :animation="true" :loading="loading" bgColor="#FFF"></u-skeleton>
		<view class="fixed safe-area-inset-bottom" @click="model2=true">
			<u-image height='35rpx' src='/static/material/crystal.png' width='26rpx'></u-image>
			<text class="num1">{{ info.price }}</text>
			<text class="num2">立即兑换</text>
		</view>
		<u-modal v-model="model" :confirm-text='confirmText' :content="modalContent" :mask-close-able='true'
			:show-cancel-button='cancel' @cancel='model=false' @confirm="confirm"></u-modal>
		<u-modal v-model="model2" confirm-text='确认兑换' content="将使用您账户中的晶石兑换该奖品" :mask-close-able='true' title='确认兑换'
			:show-cancel-button='true' @cancel='model2=false' @confirm="submit"></u-modal>
			<u-modal v-model="model3" title='兑换失败' confirm-text='知道了' content="您的品石不够哦,可以分解奖品得到晶石"  @confirm="model3=false"></u-modal>
		<share ref='share' v-model="showShare" :goodInfo='goodInfo' :page='page'></share>
		<model19 v-model="showModel"></model19>
	</view>
</template>

<script>
	import share from '@/components/share.vue'
	import {
		getCurrentPageUrlWithArgs
	} from "@/utils/util";
	import shareMixin from '@/common/shareMixin.js'
	import model19 from '@/components/modal19.vue'
	export default {
		components: {
			share,
			model19
		},
		mixins: [shareMixin],
		data() {
			return {
				model3:false,
				page: '',
				model2:false,
				showShare: false,
				showModel: false,
				model: false,
				id: 0,
				cancel: false,
				loading: true,
				modalContent: '',
				confirmText: '',
				info: {
					price: 0
				},
				type: '',
				list: [],
				content: ""
			}
		},
		onLoad(P) {
			this.page = this.$getUrl()
			if (!P.id) return this.$t('暂无此商品', () => uni.navigateBack())
			this.id = P.id
			this.init()
		},
		computed: {
			goodInfo() {
				if (!this.info.share_info) return {}
				return {
					share_info: this.info.share_info,
					img1: this.info.img
				}
			}
		},
		methods: {
			async init() {
				try {
					const {
						data: {
							info
						}
					} = await this.$store.dispatch('blind_getMallGoodsDetail', {
						id: this.id
					})
					this.loading = false
					this.list = info.imgs
					this.info = info
					this.content = info.content_info
				} catch (e) {
					this.$t(e.msg || '商品已下架', () => {
						uni.navigateBack()
					})
				}
			},
			confirm() {
				this.model = false
				if (this.type === 'login') {
					this.$cache("back_url", getCurrentPageUrlWithArgs());
					this.$authRoute({
						url: '/pages/login/login'
					})
				} else if (this.type === 'hegui') {
					this.$authRoute({
						url: '/pages/reward/reward'
					})
				}
			},
			async submit() {

				try {
					if (!this.$isLogin()) {
						this.cancel = false
						this.modalContent = '你还未登录,是否去登录？'
						this.confirmText = '去登录'
						this.type = 'login'
						return this.model = true
					}

					uni.showLoading({
						mask: true,
						title: '兑换中'
					})
					const {
						data
					} = await this.$store.dispatch('blind_exchageMallGoods', {
						id: this.id
					})
					uni.hideLoading()
					this.showModel = true
				} catch (e) {
					console.log(e);
					if(e.code===30001) return this.model3=true
					this.$u.toast(e.msg || '兑换失败')
				}
			}

		}
	}
</script>
<style lang="scss">
	page {
		padding-bottom: 100rpx;
	}
</style>
<style lang="scss" scoped>
	.fixed {
		position: fixed;
		left: 0;
		right: 0;
		height: 98rpx;
		background-color: #323232;
		display: flex;
		align-items: center;
		justify-content: center;
		bottom: 0;

		.num1 {
			font-size: 34rpx;
			font-family: HelveticaNeue;
			font-weight: normal;
			color: #FFFFFF;
			margin: 0 15rpx 0 10rpx;
		}

		.num2 {
			font-size: 30rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #FFFFFF;
		}
	}


	.num {
		margin: 0 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&-l {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.num1 {
				font-size: 40rpx;
				font-family: HelveticaNeue;
				font-weight: normal;
				color: #0C0C0C;
				line-height: 1;
				margin: 0 15rpx;
			}

			.num2 {
				line-height: 1;
				font-size: 20rpx;
				font-family: PingFangSC;
				font-weight: 400;
				text-decoration: line-through;
				color: #B8B8BA;
				align-self: flex-end;
			}
		}
	}

	.parse {
		margin-top: 50rpx;
		background-color: #fff;
		margin: 50rpx 16rpx;
		border-radius: 16rpx;
		padding: 20rpx;

		&-title {
			line-height: 50rpx;
			font-size: 28rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
			padding-left: 17rpx;
			padding-bottom: 20rpx;
		}
	}

	.title {
		margin: 40rpx 32rpx;
		font-size: 32rpx;
		font-family: PingFangSC;
		font-weight: 600;
		color: #333333;

		line-height: 52rpx;

		.tip {
			display: inline-block;
			vertical-align: middle;
			margin-right: 10rpx;
			width: 56rpx;
			height: 32rpx;
			background: #EB555B;
			border-radius: 4rpx;
			font-size: 20rpx;
			line-height: 32rpx;
			text-align: center;
			font-family: PingFangSC;
			font-weight: 300;
			color: #FFFFFF;
		}

	}

	.pages {
		/deep/ .u-swiper-wrap {
			.u-indicator-item-number {
				width: 72rpx;
				height: 36rpx;
				background: #FAFAFA;
				border-radius: 18rpx;
				font-size: 20rpx;
				display: flex;
				align-items: center;
				line-height: 1;
				justify-content: center;
				text-align: center;
				font-family: PingFangSC;
				font-weight: 400;
				color: #B8B8BA;
			}
		}
	}
</style>
