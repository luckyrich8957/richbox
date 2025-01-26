<template>
	<view class="page">
		<view class="alert" >
			<view class="left" >
				{{ pageInfo.page_msg||'' }}
			</view>
			<u-icon name='arrow-right' @click='showModel=true' size='30rpx' color="#c2bfc3"></u-icon>
		</view>
		<view class="card">
			<view class="card-item u-border-right">
				<text class="name">
					今日收益
				</text>
				<view class="num">
					<image class="iconLogo" mode='widthFix' src="/static/material/crystal.png" />
					<text class="t">{{ pageInfo.today||0 }}</text>
				</view>
			</view>
			<view class="card-item">
				<text class="name">
					累计收益
				</text>
				<view class="num">
					<image class="iconLogo" mode='widthFix' src="/static/material/crystal.png" />
					<text class="t">{{ pageInfo.total||0 }}</text>
				</view>
			</view>
		</view>
		<view class="title">
			收益记录
		</view>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" bottom='135' top="480" @down="downCallback" :up="upOption"
			@up="upCallback">
			<view class="goods-box">
				<view class="goods-item u-border-bottom" v-for='(item,index) in goods' :key='index'>
					<view class="left">
						{{ item.create_time }}
					</view>
					<view class="right">
						+{{ item.total_num }}
					</view>
				</view>
				<view class="empty" v-if='empty'>
					<u-image width="144rpx" height="116rpx" src='https://manghe.jikechaowan.com/image/img_21.png'>
					</u-image>
					<text class="t">暂无记录</text>
				</view>
			</view>
		</mescroll-uni>
		<view @click='showShare=true' class="fixed  safe-area-inset-bottom">
			<view class="btn">
				邀请好友
			</view>
		</view>
		<share ref='share' v-model='showShare' />
		<model14 :showBtn='false' v-model="showModel" title="邀请规则" uid="9" />
	</view>
</template>

<script>
	import model14 from '@/components/modal14.vue'
	import shareMixin from '@/common/shareMixin.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import share from "@/components/share"
	export default {
		mixins: [MescrollMixin, shareMixin], // 使用mixin
		components: {
			share,
			model14
		},
		data() {
			return {
				one:true,
				showModel: false,
				empty: false,
				showShare: false,
				upOption: {
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						use: false,
						tip: '~ 搜索无数据 ~', // 提示
						btnText: '去看看'
					}
				},
				goods: [], //列表数据
				pageInfo: {}
			}
		},
		onReady() {
			this.$store.dispatch('user_getInvitePageInfo').then((res) => {
				this.pageInfo = res.data
			})
		},
		onShow(){
			if(this.one) return
			this.mescroll.resetUpScroll(true)
		},
		computed:{
			goodInfo(){
				return {
					share_info:this.$store.state.appConfig?this.$store.state.appConfig.share_config.share_content:'', // 默认为小程序名称
					img1:this.$store.state.appConfig?this.$store.state.appConfig.share_config.share_img:'', // 默认为当前页面的截图
				}
			}
		},
		methods: {
			upCallback(page) {
				//联网加载数据
				this.$store.dispatch('user_getInviteRecodeList', {
					page: page.num
				}).then(res => {
					// res=[]
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(res.data.list.length);
					//设置列表数据
					if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					this.goods = this.goods.concat(res.data.list); //追加新数据
					this.empty = (this.goods.length == 0)
					this.one=false
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
		}
	}
</script>

<style>
	page {
		background-color: #fafafa;
	}
</style>
<style lang="scss" scoped>
	.iconLogo {
		width: 25rpx;
		height: 35rpx;
		margin-right: 9rpx;
		white-space: normal;
	}

	.empty {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 185rpx;

		.t {
			font-size: 24rpx;
			font-family: PingFangSC;
			font-weight: 300;
			color: #B8B8BA;
			line-height: 1;
			display: block;
			margin-top: 25rpx;
			text-align: center;
		}
	}

	.fixed {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 30rpx;
		display: flex;
		padding: 0 16rpx;
		align-items: center;
		height: 100rpx;

		.btn {
			height: 90rpx;
			flex: 1;
			background: #EB555B;
			border-radius: 16rpx;
			font-size: 30rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.goods-box {
		position: relative;
		padding: 16rpx 0rpx 16rpx 56rpx;

		.goods-item {
			height: 110rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				font-size: 26rpx;
				font-family: PingFangSC;
				font-weight: 400;
				color: #333333;
			}

			.right {
				font-size: 32rpx;
				font-family: PingFangSC;
				font-weight: 400;
				color: #EB555B;
				margin-right: 56rpx;
			}
		}
	}

	.alert {
		background-color: #ffe9e9;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		height: 74rpx;

		.left {
			font-size: 22rpx;
			font-family: PingFangSC;
			font-weight: 400;
			color: #EB555B;
		}
	}

	.card {
		margin: 26rpx 16rpx;
		height: 260rpx;
		background: #FFFFFF;
		border-radius: 40rpx;
		padding: 55rpx 0;
		display: flex;

		.card-item {
			width: 50%;
			display: flex;
			flex-direction: column;
			align-items: center;

			.name {
				font-size: 24rpx;
				margin-top: 5rpx;
				font-family: PingFangSC;
				font-weight: 400;
				color: #B8B8BA;
				line-height: 1;
			}

			.num {
				line-height: 1;
				margin-top: 31rpx;
				font-size: 28rpx;
				font-family: PingFangSC;
				font-weight: 500;
				color: #0C0C0C;

				.t {
					font-size: 50rpx;
					font-family: HelveticaNeue;
					font-weight: normal;
					color: #0C0C0C;
				}
			}
		}
	}

	.title {
		height: 94rpx;
		line-height: 94rpx;
		padding-left: 55rpx;
		font-size: 34rpx;
		font-family: PingFangSC;
		font-weight: 600;
		color: #333333;
		position: relative;

		&::after {
			content: "";
			width: 30rpx;
			height: 8rpx;
			background: #EB555B;
			border-radius: 4rpx;
			left: 107rpx;
			bottom: 12rpx;
			position: absolute;
		}
	}
</style>
