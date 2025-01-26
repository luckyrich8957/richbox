<template>
	<view>
		<alipay-popup v-model="showAli" :img="qrcode" />
	</view>
</template>

<script>
	import alipayPopup from "../../components/alipay";

	export default {
		components: {
			alipayPopup
		},
		data() {
			return {
				//阿里支付弹窗
				showAli: false,
				isComment: false,
				// 支付键盘
				show: false,
				totalPrice: 100,
				qrcode: '',
				params: {},
				// 支付状态 0 支付成功 1支付失败 2支付成功
				state: 0,
				tip: '支付键盘',
				redirect_url: '',
				is_redirect: false,
				password: "",
				timer: null,
				default_redirect: '/pages/tabbar/user/user'
			};
		},
		onLoad(P) {
			this.isComment = false
			if (P.order_id && P.trade_type && P.order_type) {
				this.params = {
					order_id: P.order_id,
					trade_type: P.trade_type,
					order_type: P.order_type
				}
				if (P.code) this.params.code = P.code
				if (P.ic_code) this.params.ic_code = P.ic_code
				this.redirect_url = decodeURIComponent(P.redirect_url) || this.default_redirect
				this.fail_url = decodeURIComponent(P.fail_url) || this.default_redirect
				if (P.redirect_url) {
					this.is_redirect = true
				}
				this.init()
			} else {
				this.$t('订单号错误', () => {
					uni.navigateBack({
						fail() {
							uni.switchTab({
								url: '/pages/tabbar/index/index'
							});
						}
					});
				})
			}
		},
		mounted() {
			// #ifdef MP-ALIPAY
			this.$nextTick(() => {
				this.$emit('throwFn', this.init.bind(this))
			})
			// #endif

		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		methods: {
			success() {
				this.$store.dispatch('updatePaymentStatus', 'paid')
			
				this.state === 0
				clearInterval(this.timer)
				let start_time = (new Date()).getTime();
				let end_time = 0;
				let flat = false
				let time = this.showAli ? 3 * 60 : 60 * 1;
				const setTimer = () => {
					let timer;
					this.$store.dispatch('order_queryOrderCommon', this.params)
						.then(res => {
							flat = true
							this.state = 2
							clearInterval(this.timer)
							this.showAli = false
							if (this.isComment) return this.$emit('success', {
								msg: '支付成功',
								...this.params
							})
							this.$authRoute({
								url: this.redirect_url,
								auth: 1,
								type: 'redirectTo',
								params: this.params
							})
						})
						.catch(err=> {
							end_time = (new Date()).getTime()
							if (end_time - start_time >= time * 1000) {
								if (this.isComment) return this.$emit('fail', {
									msg: '订单查询超时'
								})
							} else {
								setTimeout(()=>{
									setTimer()
								},500)		
							}
						});
				}
				setTimer()
			},
			fail(res) {
				this.state = 1
				uni.hideLoading();
				if (this.isComment) return this.$emit('fail', {
					msg: '支付失败'
				})
				return this.$u.toast("支付失败");
			},
			init(payParams) {
				if (typeof payParams === 'object') {
					this.isComment = true
					this.params = payParams
					this.params = {
						order_id: payParams.order_id,
						trade_type: payParams.trade_type,
						order_type: payParams.order_type
					}
					if (payParams.code) this.params.code = payParams.code
					if (payParams.ic_code) this.params.ic_code = payParams.ic_code
				}

				let that = this
				this.$store.dispatch('order_createPayConfigCommon', this.params).then((res) => {
					let {
						data
					} = res
					console.log("data", data)
					if (['yue', 'coins', 'integral', 'qrcode'].includes(this.params.trade_type)) {
						console.log(this.params.trade_type);
						this.success()
					} else {
						if (this.isComment) return this.$emit('fail', {
							msg: '未知支付'
						})
						this.$t('未知支付', () => {
							uni.navigateBack({
								fail() {
									if (!this.$is_debug) that.$authRoute({
										url: this.fail_url,
										params: this.params
									})
								}
							});
						})
					}
				}).catch((res) => {
					if (this.isComment) return this.$emit('fail', res)
					this.$t(res.msg, () => {
						if (!this.$is_debug) this.$authRoute({
							url: this.fail_url,
							params: this.params
						})
					})
				})


			}
		}
	}
</script>

<style lang="scss">
	.money {
		font-size: 80rpx;
		color: $u-type-warning;
		position: relative;

		.close {
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			line-height: 28rpx;
			font-size: 28rpx;
		}
	}

	.tips {
		color: $u-tips-color;
	}
</style>
