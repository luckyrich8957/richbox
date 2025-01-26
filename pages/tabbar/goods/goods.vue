<template>
	<view :style='{height:height}' class="u-wrap page-warp">
		<!-- #ifndef H5 -->
		<!-- <lff-barrage ref="lffBarrage" :maxTop="0" :minTop="0"></lff-barrage> -->
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<!-- <lff-barrage ref="lffBarrage"></lff-barrage> -->
		<!-- #endif -->
		<!-- <view class="top-warp">

		</view> -->
		<view class="center-warp">
			<scroll-view class="u-tab-view menu-scroll-view" scroll-with-animation scroll-y>
				<view v-for="(item,index) in tabbar" :key="index"
					:class="[current == item.id ? 'u-tab-item-active' : '']" class="u-tab-item"
					@tap.stop="swichMenu(index)">
					<text class="u-line-1">{{ item.blind_type_name }}</text>
				</view>
			</scroll-view>
			<wyb-slide-listener @slideUp="onSlide">
				<view class="right">
					<mescroll-uni ref="mescrollRef" :down="downOption" :fixed="false" :up="upOption"
						@down="downCallback"  @init="mescrollInit" @up="upCallback">
						<!-- 大海报 -->
						<view class="wrapperItem01">
							<div v-for="(item,index) in goods" :key="index" class="itemWrapperItem0"
								@click="jumpInfo(item)">
								<image :src="item.img1" class="item111" />
								<view class="label1 u-line-2">{{ item.blind_name }}</view>
								<div class="view">
									<image class="iconLogo" mode='widthFix'
										src="https://manghe.jikechaowan.com/image/img_11.png" />
									<text class="num">{{ item.price }}</text>
									<text class="num1">{{ item.market_price }}</text>
								</div>
							</div>
						</view>
					</mescroll-uni>
				</view>
			</wyb-slide-listener>
		</view>

	</view>
</template>

<script>
	import lffBarrage from '@/components/lff-barrage/lff-barrage.vue'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		apiGoods
	} from '@/common/mock.js'
	import {
		masState
	} from "vuex"
	import wybSlideListener from '@/components/wyb-slide-listener/wyb-slide-listener.vue'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			lffBarrage,
			wybSlideListener
		},
		data() {
			return {
				arr: {},
				next: true,
				upOption: {
					noMoreSize: 2, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						tip: '~ 暂无商品数据,上拉加载下一分类 ~', // 提示
					},
				},
				downOption: {
					auto: false
				},
				timer: null,
				height: '555px',
				goods: [],
				current: 0,
				tabbar: []
			}
		},
		computed: {},
		onShow() {
			let current = this.$cache("cate_id")
			if (current) {
				this.current = current
				this.$cache("cate_id", null)
				this.upCallback({
					num: 1
				})
			}
		},
		onLoad(p) {

		},
		mounted() {
			this.height = this.$u.sys().windowHeight + 'px'
			this.getdanmu()
			// setInterval(()=>this.$refs.lffBarrage.add({item:'你好呀小伙子'}),1500)
			this.$store.dispatch('init').then((res) => {
				this.tabbar = res.mallCate
				this.current = this.tabbar[0].id
				this.mescroll.resetUpScroll()
			})
		},
		watch:{
			current(value){
				let str;
				let a=this.tabbar.findIndex(item=>item.id===this.current)
				if(a==this.tabbar.length-1){ a=0}else{
					a+=1
				}
				str=this.tabbar[a].blind_type_name
				this.mescroll&&(this.mescroll.optUp.textNoMore='上滑继续浏览 '+str)	
			}
		},
		methods: {
			onSlide(e) {
				console.log(e);
				let height;
				height=this.mescroll.optUp.offset

				height=180
				console.log(this.mescroll.getScrollBottom(),180);
				if(this.next&&this.mescroll.getScrollBottom() <= height){
					// 获取下一个的index
					let a=this.tabbar.findIndex(item=>item.id===this.current)
					if(a==this.tabbar.length-1){ a=0}else{
						a+=1
					}
					this.swichMenu(a)
				}
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
				},0);
			},
			// 获取弹幕
			async getdanmu() {
				try {
					const {
						data
					} = await this.$store.dispatch('blind_blindRewardRecord', {
						is_scoller: 1
					})
					const len = data.length - 1
					let a=0
					if (len <= 0) return
					this.timer = setInterval(() => {
						if(a>len){
							a=0
						}
						const item = data[a]
						const obj = {
							// 1:普通 2：高级赏
							levelName: item.reward_name_info?.reward_name??'',
							name: item.user_info?.nickname??'',
							img: item.user_info?.avatar??'',
							title: item.reward_goods_info?.reward_name??'A赏'
						}
						this.$refs.lffBarrage && this.$refs.lffBarrage.add(obj)
						a+=1
					}, 3000)
					
				} catch (e) {
					//TODO handle the exception
					console.log(e, 'cuowu');
				}

			},
			selectTab(id) {
				this.current = id
			},
			swichMenu(index) {
				this.next=false
				this.current = this.tabbar[index].id
				this.goods = [] // 先置空列表,显示加载进度
				this.mescroll.resetUpScroll()
			},
			upCallback(page) {
				//联网加载数据

				if (!this.tabbar.length) return false

				this.$store.dispatch('blind_getBlindList', {
					page: page.num,
					id: this.current
				}).then((res) => {
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					// this.mescroll.endSuccess(res.data.list.length, true)
					this.mescroll.endSuccess(res.data.list.length);
					if(res.data.list.length<10) this.next=true
					//设置列表数据
					if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					uni.hideLoading()
					this.goods = this.goods.concat(res.data.list); //追加新数据
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
					uni.hideLoading()
				})
			},
		},
		onUnload() {
			clearInterval(this.timer)
		}
	}
</script>
<style>
</style>
<style lang="scss" scoped>
	page {
		height: 100%;
		// 支付宝小程序,钉钉小程序需添加绝对定位,否则height:100%失效: https://opendocs.alipay.com/mini/framework/acss#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98
		/* #ifdef MP-ALIPAY || MP-DINGTALK*/
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		/* #endif */
		display: flex;

		/*需给父元素设置height:100%*/
		.page-warp {
			display: flex;
			flex-direction: column;

			/* 顶部区域 */
			.top-warp {
				font-size: 28rpx;
				padding: 50rpx;
				text-align: center;
				// background-color: #CFE0DA;
			}

			/* 中间 */
			.center-warp {
				flex: 1;
				min-width: 0;
				min-height: 0;
				/* 需给flex:1的元素加上最小高,否则内容超过会溢出容器 (如:小程序Android真机) */
				display: flex;
			}

		}
	}

	.wrapperItem01 {
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 0 16rpx;
		background-color: #fafafa;
	}

	.itemWrapperItem0 {
		margin-bottom: 15rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		overflow: hidden;
		width: 260rpx;
		height: 416rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
	}

	.item111 {
		position: relative;
		align-self: center;
		width: 180rpx;
		height: 200rpx;
		margin-top: 26rpx;
	}

	.label1 {
		position: relative;
		max-width: 298rpx;
		margin-top: 45rpx;
		margin-left: 13rpx;
		height:60rpx;
		margin-right: 13rpx;
		font-size: 24rpx;
		font-family: PingFangSC;
		font-weight: 300;
		color: #333333;
		line-height: 30rpx;
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
		margin-top: 20rpx;
		margin-left: 20rpx;
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
		font-size: 30rpx;
		font-family: HelveticaNeue;
		font-weight: normal;
		color: #0C0C0C;
		text-decoration: none;
		letter-spacing: 0;
		line-height: 1;
	}

	.num1 {
		font-size: 20rpx;
		line-height: 1;
		font-family: PingFangSC;
		font-weight: 400;
		text-decoration: line-through;
		color: #B8B8BA;
		
		text-decoration: line-through;
		letter-spacing: 0;
	}

	.menu-scroll-view {
		width: 200rpx;
		height: 100%;

		.u-tab-item {
			height: 110rpx;
			width: 180rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: #444;
			color: #B8B8BA;
			line-height: 1;

		}
	}

	.u-tab-item-active {
		background: #f6f6f6;
		position: relative;
		position: relative;
		color: #333 !important;
		font-size: 30rpx;
		font-weight: 600 !important;
		background: #fff;
	}

	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid #EB555B;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.right {
		flex:1;
		height: 100%;

		/deep/ .mescroll-uni-fixed {
			width: 550rpx;
			position: absolute;
			left: unset;
			top: 100rpx !important;
		}
	}

	.item {
		position: absolute;
		top: 0;
		width: 412rpx;
		height: 60rpx;
		background: #000000;
		opacity: 0.5;
		border-radius: 30px;
	}
</style>
