<!-- 自定义导航栏演示 -->
<!--  此demo使用了uView的Navbar 自定义导航栏 https://uviewui.com/components/navbar.html -->
<template>
	<view class="content">
		<u-navbar :border-bottom='false' ref='nav' :is-back='false' class='nav'>
			<view class="slot-wrap" @click="$u.route('/pages/search/search')">
				<view class="nav-content">
					<u-icon color="#B8B8BA" label='搜搜看您感兴趣的商品' label-color='#B8B8BA' label-size='26rpx' name='search'
						size="28"></u-icon>
				</view>
			</view>
		</u-navbar>
		<mescroll-uni ref="mescrollRef" :top="top" :up="upOption" @down="downCallback" @init="mescrollInit"
			@up="upCallback">
			<view class="sw-c" v-if='appConfig&&appConfig.banner.length>0'>
				<u-swiper :height='240' mode='dot' :list="appConfig.banner" @click="swiperClick"></u-swiper>
			</view>
			<div class="row" v-if='appConfig'>
				<div v-for="(item,index) in appConfig.indexCate" :key="index" class="wrapperItem0"
					@click="selectTab(item.id)">
					<image :src="item.img" class="picture" mode="widthFix" />
					<text class="tag">{{ item.blind_type_name }}</text>
				</div>
				<div class="wrapperItem0" @click='$authRoute({url:"/pages/tabbar/goods/goods"},0)'>
					<image class="picture" mode="widthFix" src="https://oss.smiaoshen.com/image/index/more.png" />
					<text class="tag">更多</text>
				</div>
			</div>
			<view class="tabs" style="width: 500rpx; margin: 0 auto;">

				<u-tabs :active-item-style="{color:'#333'}" :bar-style="{backgroundColor:'#EB555B'}" :current="tabIndex"
					:font-size="34" :is-scroll="false" :list="navList" bg-color="#fafafa" inactive-color="#B8B8BA"
					@change="tabChange"></u-tabs>
			</view>
			<div class="wrapperItem01">
				<div v-for="(item,index) in goods" :key="index" class="itemWrapperItem0" @click="jumpInfo(item)">
					<image :src="item.img1" class="item" />
					<text class="label1 u-line-2">{{ item.blind_name }}</text>
					<div class="view">
						<image class="iconLogo" src="https://oss.smiaoshen.com/image/img_11.png" />
						<text class="num">{{ item.price }}</text>
						<text class="num1">{{ item.market_price }}</text>
					</div>
				</div>
				<view v-if="goods.length&&goods.length%2!==0"></view>
			</div>
		</mescroll-uni>
		<my-mask :show='one'></my-mask>
	</view>
</template>

<script>
	import myMask from '@/components/myMask.vue'
	import {
		apiGoods
	} from '@/common/mock.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		mapState,
		mapGetters
	} from "vuex"

	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			myMask
		},
		data() {
			return {
				top: 0,
				arr: [],
				upOption: {
					// page: {
					// 	size: 10 // 每页数据的数量
					// },
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						tip: '~ 搜索无数据 ~', // 提示
						btnText: '去看看'
					}
				},
				goods: [],
				navList: [{
					name: '热门'
				}, {
					name: '最新'
				}],
				tabIndex: 0,
				appConfig: {
					banner: [],
					indexCate: []
				}
			}

		},
		computed: {
			...mapState(['one'])
		},
		onLoad() {
			if(!this.one) return
			uni.hideTabBar({
				animation: false
			})
			console.log(this.$store.state.option, '这里');
			setTimeout(() => {
				this.$store.commit('setOne',false)
				this.$nextTick(() => {
					uni.showTabBar({
						animation: true
					})
				})

			}, 2500)
		},
		mounted() {

			this.$store.dispatch('init').then((appConfig) => {
				console.log(appConfig);
				this.appConfig = appConfig
				// #ifndef MP-ALIPAY
				this.$u.getRect('.nav').then(res => {
					this.top = (res.top + res.height) / (uni.upx2px(100) / 100);
				})
				// #endif
				// #ifdef MP-ALIPAY
				const a = uni.getSystemInfoSync()
				this.top = (a.statusBarHeight + a.titleBarHeight) / (uni.upx2px(100) / 100)
				// #endif
			})

			this.getBlindList()
		},

		methods: {
			swiperClick(index) {
				const item = this.appConfig.banner[index]
				if (item.content && item.content.length > 0) {
					this.$u.route('/pages/activity/detail?id=' + item.id)
				} else {
					this.$authRoute({
						url: item.link_page
					}, 0)
				}
			},
			selectTab(id) {
				this.$cache("cate_id", id)
				this.$authRoute({
					url: '/pages/tabbar/goods/goods',
					params: {
						id: id
					}
				}, 0);
			},
			jumpInfo(item) {
				this.$cache('BlindInfo', item)
				let url = '/pages/list/box'
				let id = item.id
				if (item.blind_type === 1) {
					url = '/pages/good/wireless'
				}
				if (item.blind_type === 2) { //扭蛋机
					url = '/pages/list/egg'
				}

				this.$authRoute({
					url: url,
					params: {
						id,
					}
				}, 0);
			},
			getBlindList() {

			},
			upCallback(page) {
				//联网加载数据
				let id = this.tabIndex === 0 ? 'hot' : 'news'
				this.$store.dispatch('blind_getBlindList', {
					id: id,
					page: page.num
				}).then((res) => {
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(res.data.list);
					//设置列表数据
					if (page.num === 1) this.goods = []; //如果是第一页需手动制空列表
					uni.hideLoading()
					this.goods = this.goods.concat(res.data.list); //追加新数据
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
					uni.hideLoading()
				})
			},
			tabChange(index) {
				this.tabIndex = index;
				uni.showLoading()
				this.goods = []
				this.mescroll.resetUpScroll()
			},
			itemClick(item) {
				console.log('点击了', item.title);
			},
			backClick() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabs {
		/deep/ .u-tab-bar {
			background-color: #EB555B;
			background-color: #fff;
		}
	}

	.content {
		padding-top: 0 16rpx;
	}

	page {
		background: #fafafa;
	}

	.sw-c {
		margin: 26rpx 16rpx;
	}

	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		/* #ifdef MP-ALIPAY */
		margin-right: 270rpx;

		/* #endif */
		.nav-content {
			padding: 20rpx 36rpx;
			flex: 1;
			margin: 0 20rpx;
			font-size: 26rpx;
			background-color: #eee;
			height: 64rpx;
			display: flex;
			align-items: center;
			border-radius: 16rpx;
			/* #ifdef Mp */
			margin-right: 66rpx;
			/* #endif */
		}
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		margin: 10rpx 0 30rpx;

		.wrapperItem0 {
			display: flex;
			font-size: 24rpx;
			width: 20%;
			flex-direction: column;
			align-items: center;

			.picture {
				width: 100rpx;
				height: 100rpx !important;
				margin-bottom: 10rpx;
			}
		}
	}

	.wrapperItem01 {
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 0 16rpx;
		//min-height: 100vh;
	}

	.itemWrapperItem0 {
		margin-bottom: 15rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		overflow: hidden;
		width: 350rpx;
		height: 516rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
	}

	.item {
		position: relative;
		align-self: center;
		width: 346rpx;
		height: 346rpx;
		margin-top: 26rpx;
	}

	.label1 {
		position: relative;
		max-width: 298rpx;
		margin-top: 45rpx;
		margin-left: 26rpx;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #333333;
		text-align: left;
		text-decoration: none;
	}

	.info {
		position: relative;
		overflow: hidden;
		height: 24rpx;
		max-width: 300rpx;
		margin-top: 7rpx;
		margin-left: 25rpx;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #333333;
		text-align: left;
		text-decoration: none;
		letter-spacing: 0;
		white-space: pre;
		text-overflow: ellipsis;
	}

	.view {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		margin-top: 32rpx;
		margin-left: 24rpx;
		white-space: nowrap;
	}

	.iconLogo {
		width: 26rpx;
		height: 26rpx;
		margin-right: 9rpx;
		white-space: normal;
	}

	.num {
		margin-right: 15rpx;
		font-size: 34rpx;
		line-height: 34rpx;
		color: #0c0c0c;
		text-align: left;
		text-decoration: none;
		letter-spacing: 0;
	}

	.num1 {
		font-size: 24rpx;
		line-height: 24rpx;
		color: #b8b8ba;
		text-align: left;
		text-decoration: line-through;
		letter-spacing: 0;
	}
</style>
