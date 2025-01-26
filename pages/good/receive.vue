<template>
		<zero-loading v-if="loading" ></zero-loading>
		<view v-else>
			<view class="top">
				<u-image shape='circle' :src='orderInfo.avatar' width="160rpx" height="160rpx"></u-image>
				<view class="name">
					{{ orderInfo.nickname }}
				</view>
				<view class="code">
					{{ orderInfo.account_id }}
				</view>
				<view class="tip">
					TA赠送给您下面奖品，请查收：
				</view>
				<view :class="{btn:true,'in-active':butMsg[1],'active' : butMsg[2]}" @click="doGetGoods">
					{{ butMsg[0] }}
				</view>
			</view>
			<view class="card" :style="{minHeight:min}">
				<view class="title">
					奖品信息
				</view>
				<view class="content" v-for='item1 in orderInfo.order_list'>
					<u-image :src='item1.img' width="140rpx" height="140rpx" border-radius="16rpx">
					</u-image>
		
					<view class="content-right">
						<view class="name u-line-2">
							{{ item1.reward_name }}
						</view>
						<view class="content-tip">
							数量 x{{ item1.goods_num }}
						</view>
					</view>
				</view>
			</view>
		</view>
</template>

<script>
	import {
		mapState
	} from "vuex"

	export default {
		data() {
			return {
				loading:true,
				min: 0,
				order_id: '',
				orderInfo: {
					uid: '',
					status: '',
					give_uid: '',
				}
			}
		},

		mounted() {
			this.min = this.$u.sys().windowHeight - uni.upx2px(800) + 'px'
		},
		computed: {
			...mapState({
				userInfo: state => state.userInfo
			}),
			butMsg() {
				if(this.loading) return
				if (this.orderInfo.has_che && this.userInfo.uid === this.orderInfo.uid) return ['您已撤销赠送', true, false];
				if (this.orderInfo.has_che && this.userInfo.uid !== this.orderInfo.uid) return ['赠送人已撤销赠送', true, false];
				if (this.userInfo.uid === this.orderInfo.uid && this.orderInfo.status === 10) return ['待好友领取', true,
				false];
				if (this.userInfo.uid === this.orderInfo.uid && this.orderInfo.status === 11) return ['待好友领取', true,
				false];
				if (this.userInfo.uid === this.orderInfo.uid && this.orderInfo.status === 12) return ['好友已领取', true,
				false];
				if (this.userInfo.uid !== this.orderInfo.uid && this.orderInfo.status === 10 && this.orderInfo
					.applyStatus == undefined) return ['申请领取', false, false]; //判断有没有领取过

				if ([11].indexOf(this.orderInfo.status) > -1 && this.userInfo.uid != this.orderInfo.give_uid) return [
					'抱歉赠送人已赠送给其他好友', true, false
				];

				if (this.orderInfo.status === 10 && this.orderInfo.applyStatus === 0) return ['待赠送人确认', true, false];

				if ((this.orderInfo.status === 11 && this.userInfo.uid === this.orderInfo.give_uid) || this.orderInfo
					.applyStatus === 2) return ['领取成功',true, true];
				return ['--', true, false];
			},
		},
		onLoad(p) {
			this.order_id = p.order_id
		},
		onShow() {

			this.getGiveGoodsInfo()
		},
		methods: {
			getGiveGoodsInfo() {
				this.$store.dispatch('order_giveGoodsInfo', {
					order_id: this.order_id
				}).then((res) => {
					if(!res.data.info) return this.$t('已经领取完',()=>{
						this.$authRoute({url:'/pages/tabbar/index/index'})
					})
					this.orderInfo = res.data.info
					this.$nextTick(()=>{
						this.loading=false
					})
				})
			},
			doGetGoods() { //申请领取
			if(this.butMsg[0]==='领取成功') return
				if (this.orderInfo.status === 10) {
					this.$store.dispatch('order_applyOrder', {
						order_id: this.order_id
					}).then((res) => {
						this.$t(res.msg, () => {
							this.orderInfo.applyStatus = 0
						})
					}).catch((res) => {
						this.$toast(res.msg)
					})
				} else if (this.orderInfo.status === 11 && this.userInfo.uid === this.orderInfo.give_uid) {
					this.$store.dispatch('order_getGoods', {
						over_order_id: this.order_id
					}).then((res) => {
						this.$t(res.msg, () => {
							this.orderInfo.status === 12
						})
					}).catch((res) => {
						if(!res.msg) return
						this.$toast(res.msg)
					})
				}

			}
		}
	}
</script>

<style>
	page {
		background-color: #fafafa;
	}
</style>
<style lang="scss" scoped>
	.top {
		height: 800rpx;
		overflow: hidden;
		padding-top: 106rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.name {
			margin: 35rpx;
			font-size: 32rpx;
		}

		.code {
			margin-top: 10rpx;
			font-size: 24rpx;
			color: #B8B8BA;
		}

		.tip {
			font-size: 30rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
			margin-top: 100rpx;
		}

		.btn {
			margin-top: 59rpx;
			margin-bottom: 100rpx;
			width: 638rpx;
			height: 90rpx;
			background: #323232;
			border-radius: 16rpx;
			font-size: 30rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.in-active {
			background-color: #d7d7d7;
		}

		.active {
			background-color: #facd91;
		}
	}

	.card {
		background: #FFFFFF;
		border-radius: 40rpx 40rpx 0px 0px;
		padding: 0 56rpx 30rpx;

		.content {
			display: flex;
			justify-content: space-between;
			margin-bottom: 36rpx;
		}

		.title {
			height: 100rpx;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
		}

		.content-right {
			display: flex;
			flex-direction: column;
			padding: 6rpx 0;
			margin-left: 27rpx;
			justify-content: space-between;

			.content-tip {
				font-size: 24rpx;
				font-family: PingFangSC;
				font-weight: 400;
				color: #B8B8BA;
			}

			.name {
				font-size: 28rpx;
				font-family: PingFangSC;
				font-weight: 300;
				color: #333333;
			}
		}
	}
</style>
