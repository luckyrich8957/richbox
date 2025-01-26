<template>
	<zero-loading v-if="loading" type="circle"></zero-loading>
	<mescroll-body v-else ref="mescrollRef" :down="{ use: false }" :sticky="true" :top="0" :up="upOption" @init="mescrollInit">
		<view class="pages">
			<view :class="{ shuaxing: true }"><u-image @click="getBlindGoodsInfo" height="91rpx" src="@/static/material/shuaxing.png" width="91rpx"></u-image></view>

			<view class="icon">
				<view class="icons">
					<block v-for="(item, index) in icons">
						<view v-if="index == 0" :style="{ top: down ? '100%' : index * 96 + 'rpx' }" class="item">
							<u-icon
								:label="!item.state ? '收藏' : '已收藏'"
								:name="item.state ? item.icon : item.icon1"
								label-color="#fff"
								label-pos="bottom"
								label-size="18rpx"
								margin-top="10rpx"
								size="36rpx"
								@click="iconClick(index, item)"
							></u-icon>
						</view>
						<view v-else :style="{ top: down ? '100%' : index * 96 + 'rpx' }" class="item">
							<u-icon
								:label="item.name"
								:name="item.icon"
								label-color="#fff"
								label-pos="bottom"
								label-size="18rpx"
								margin-top="10rpx"
								size="36rpx"
								@click="iconClick(index, item)"
							></u-icon>
						</view>
					</block>
				</view>
				<view :class="{ down: down, img: true }" @click="down = !down">
					<u-image height="40rpx" src="https://manghe.jikechaowan.com/image/img-18.png" width="40rpx"></u-image>
				</view>
			</view>
			<!-- #ifndef MP-ALIPAY -->
			<u-navbar :back-icon-size="40" ref="nav" :background="background" :border-bottom="false" :immersive="true" back-icon-color="#ffffff" class="nav"></u-navbar>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->
			<u-navbar :back-icon-size="40" ref="nav" :background="background" :border-bottom="false" :immersive="true" back-icon-color="transparent" class="nav"></u-navbar>
			<!-- #endif -->

			<view :style="{ top: top + 'px' }" class="alert" @click="alert">
				<view v-if="blindInfo.box_info" class="alert-left">
					当前机器：第
					<text>{{ blindInfo.box_info && blindInfo.box_info.box_num }}/{{ blindInfo.box_num }}</text>
					箱 | 剩
					<text>{{blindInfo.reward_goods_num - blindInfo.box_info.winning_num }}/{{ blindInfo.reward_goods_num }}</text>
					抽
				</view>
				<view class="alert-right">
					<u-icon name="https://manghe.jikechaowan.com/image/eggicon.png" size="28rpx"></u-icon>
					<text>换机器</text>
					<u-icon color="#FFE230" name="arrow-right" size="28rpx"></u-icon>
				</view>
			</view>
			<view class="box">
				<view class="title u-flex u-row-center">
								<u-image
									v-if="imgsList[goodCurrent]"
									:src="imgsList[goodCurrent] && imgsList[goodCurrent].reward_type_info.img"
									height="80rpx"
									mode="aspectFit"
									width="242rpx"
								></u-image>
							</view>
				<view class="nav">
					<view class="notice">
						<view :style="{ 'animation-duration': text.length > 10 ? text.length * 0.2 + 's' : '3s' }" class="text">{{ text }}</view>
						<view
							:style="{
								'animation-delay': text.length > 10 ? -text.length * 0.2 + 's' : '-3s',
								'animation-duration': text.length > 10 ? text.length * 0.2 + 's' : '3s'
							}"
							class="text"
						>
							{{ text }}
						</view>
					</view>
				</view>
			</view>
			<view class="bg-box" @click="run = !run">
				<view class="box-icon"><u-image height="66rpx" src="https://manghe.jikechaowan.com/image/box-btn.png" width="117rpx"></u-image></view>
				<view class="box-img">
					<view v-for="(box, index) in 9" :key="index" ref="box" :class="['img-' + index, 'mg', run ? 'run' + index : '']">
						<u-image height="80rpx" src="@/static/material/egg.png" width="80rpx"></u-image>
					</view>
				</view>
			</view>
			<view :style="{ top: top }" class="tabbar">
				<view v-for="(item, index) in tabbar" :key="index" :class="{ 'tabbar-item': true, on: current === index }" @click="current = index">{{ item }}</view>
			</view>
			<view v-show="current === 0">
				<scroll-view :scroll-left="left" :scroll-with-animation="true" :scroll-x="true" class="scroll">
					<view class="content">
						<view
							v-for="(item, index) in imgsList"
							:key="index"
							:class="{ item: true }"
							@click="
								goodCurrent = index;
								showDetailed();
							"
						>
							<u-image :src="item.img" height="180rpx" width="180rpx"></u-image>
							<view class="tip" v-if='item.blind_phase_action_ids'>只赠送不售卖</view>
							<view class="tip u-flex u-row-between" style='padding: 0 15rpx;' v-else>
								
								<text>{{item.reward_type_info.reward_name}}</text>
								<text>
									{{item.splus_num}}/{{item.reward_num}}
								</text>
							
							</view>
							<view class="tip1">{{ item.reward_type_info.reward_name }}</view>
						</view>
						<view style="width: 30rpx;height: 1rpx;flex-shrink: 0"></view>
					</view>
				</scroll-view>
				<block v-if="!iscomplete">
					<view :style="{ justifyContent: btn.length === 1 ? 'center' : 'space-between' }" class="egg-btn">
						<view
							v-for="(item, index) in btn"
							:key="index"
							:class="['btn-item', item.center, item.state ? '' : 'none']"
							:style="'background-image:url(' + item.bg + ')'"
							@click="goPay(item)"
						>
							<u-icon :name="icon" class="u-m-r-5" size="30rpx"></u-icon>
							<view class="t1  u-m-r-5" style="font-size: 26rpx;">{{ item.price }}</view>
							<view class="t2">{{ item.price1 }}</view>
						</view>
					</view>
				</block>

				<view v-else class="complete">本箱已售罄</view>
			</view>
			<view v-if="tabbar.length > 1">
				<view v-if="current === 1">
					<ordinary-item
						ref="mescrollItem"
						:iscomplete="iscomplete"
						:disableScroll="disableScroll"
						:swiperHeight="swiperHeight"
						:uid="id"
						:bottom="iscomplete ? '20' : '200'"
					/>
				</view>
			</view>
			<view v-if="current === 1 && bottom && !iscomplete" class="btn1-box safe-area-inset-bottom">
				<view :style="{ justifyContent: btn.length === 1 ? 'center' : 'space-between' }" class="egg-btn btns">
					<view
						v-for="(item, index) in btn"
						:key="index"
						:class="['btn-item', item.center, item.state ? '' : 'none']"
						:style="'background-image:url(' + item.bg + ')'"
						class="btn-item"
						@click="goPay(item)"
					>
						<u-icon :name="icon" size="20rpx"></u-icon>
						<view class="t1">{{ item.price }}</view>
						<view class="t2">{{ item.price1 }}</view>
					</view>
				</view>
			</view>
		</view>
		<model13 v-model="model" :blindInfo="blindInfo" :coupon_price="coupon_price" :num="num" :type="type" @submit="payBland" />
		<model15 v-model="model15" :content="content"></model15>
		<model12 v-model="model2" @submit="sureSign"></model12>
		<model11 v-model="model1" @submit="sureAuth"></model11>
		<share ref="share" v-model="showShare" :goodInfo="blindInfo" :page="page" />
		<chackstand ref="chackstand" @fail="fail" @success="success" />
		<my-mask :show="showMask" url="https://smiaoshen.oss-cn-hangzhou.aliyuncs.com/image/4.gif"></my-mask>
	</mescroll-body>
</template>

<script>
import chackstand from '@/pages/order/checkstand.vue';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import uIcon from 'uview-ui/components/u-icon/u-icon';
import ordinaryItem from './comopnents/ordinaryItem.vue';
import model13 from '@/components/modal13.vue';
import myMask from '@/components/myMask.vue';
import model11 from '@/components/modal11.vue';
import model12 from '@/components/modal12.vue';
import UImage from '../../uview-ui/components/u-image/u-image';
import lffBarrage from '@/components/lff-barrage/lff-barrage.vue';
import share from '@/components/share.vue';
import model15 from '@/components/model15.vue';
export default {
	mixins: [MescrollMixin], // 使用mixin
	components: {
		myMask,
		chackstand,
		UImage,
		uIcon,
		ordinaryItem,
		model13,
		model15,
		model11,
		model12,
		lffBarrage,
		share
	},
	onShareAppMessage(res) {
		if ((res.from = 'menu')) {
			const ref = this.$refs.share;
			return {
				title: ref.share.title,
				path: ref._page,
				imageUrl: ref.share.imageUrl
			};
		} else {
			return {
				title: res.target.dataset.title,
				path: res.target.dataset.path,
				imageUrl: res.target.dataset.img
			};
		}
	},
	data() {
		return {
			showMask: false,
			loading: true,
			page: '',
			model15: false,
			content: '',
			type: '',
			model2: false,
			model1: false,
			showShare: false,
			// 箱子的信息
			blindInfo: {},
			imgsList: [],
			coupon_price: 0,
			// 商品id
			id: '',
			// 箱子id
			blind_goods_id: '',
			//扭蛋机是否开启
			run: false,
			// 是否有弹幕
			isbarrage: false,
			boxList: [],
			tabbar: ['全部奖品'],
			// 付款弹框
			model: false,
			// btn有4个的情况
			btn: [
				{
					center: 'four',
					state: true,
					price: '????',
					price1: '',
					bg: 'https://manghe.jikechaowan.com/image/egg1.png',
					num: 0
				},
				{
					center: 'four',
					state: true,
					price: 88,
					price1: 128,
					num: 1,
					bg: 'https://manghe.jikechaowan.com/image/egg2.png'
				},
				{
					center: 'four',
					state: true,
					price: 440,
					num: 5,
					price1: 510,
					bg: 'https://manghe.jikechaowan.com/image/egg3.png'
				},
				{
					center: 'four',
					state: true,
					price: 888,
					num: 10,
					price1: 1020,
					bg: 'https://manghe.jikechaowan.com/image/egg4.png'
				}
			],
			// btn有3个的情况
			// btn: [{
			// 		center: 'three none',
			// 		state: true,
			// 		price: 88,
			// 		price1: 128,

			// 		bg: https://manghe.jikechaowan.com/image/egg5.png')
			// 	},
			// 	{
			// 		center: 'three',
			// 		state: true,
			// 		price: 440,
			// 		price1: 510,
			// 		bg: https://manghe.jikechaowan.com/image/egg6.png')
			// 	},
			// 	{
			// 		center: 'three',
			// 		state: true,
			// 		price: 88,
			// 		price1: 128,
			// 		bg: https://manghe.jikechaowan.com/image/egg7.png')
			// 	},
			// ],
			// 是否是单抽

			// 是否已售完
			iscomplete: false,
			// 底部按钮是否显示
			bottom: false,
			timer: null,
			upOption: {
				use: false // 主体框架只启用下拉刷新
			},
			topHeight: uni.upx2px(600), // 顶部内容的高度 (单位px)
			swiperHeight: 0,
			disableScroll: true, // swiper列表是否禁止滚
			//icon是否收起
			down: false,
			icons: [
				{
					name: '已收藏',
					state: false,
					icon: 'https://manghe.jikechaowan.com/image/img-14.png',
					icon1: 'https://manghe.jikechaowan.com/image/img-14-1.png'
				},
				{
					name: 'k币',
					page: '/pages/money/Kcode',
					icon: 'https://manghe.jikechaowan.com/image/img-15.png'
				},
				{
					name: '盒柜',
					page: '/pages/reward/reward',
					icon: 'https://manghe.jikechaowan.com/image/img-16.png'
				},
				{
					name: '分享',
					icon: 'https://manghe.jikechaowan.com/image/img-17.png'
				}
			],
			//左边的距离
			left: 0,
			step: 0,
			iscard: false,
			//当前tabbar的下标
			current: 0,
			//当前商品的下标
			goodCurrent: 0,
			coupon_user_id: 0,
			num: '',
			//状态栏高度
			top: 0,
			//状态栏高度
			background: {
				backgroundImage: 'url(https://manghe.jikechaowan.com/image/bg-egg.png)',
				backgroundSize: 'cover'
			},
			jifen_id: 0
		};
	},
	onUnload() {
		clearInterval(this.timer);
	},
	methods: {
		showDetailed() {
			const info = this.imgsList[this.goodCurrent];
			// this.content=info.
			if (info.content_info) {
				this.content = info.content_info;
				this.model15 = true;
			}
		},
		alert(index) {
			const params = {
				show: true,
				id: this.blind_goods_id,
				type: this.type
			};
			if (this.jifen_id) {
				params.jifen_id = this.jifen_id;
			}
			this.$authRoute({
				// id=72&jifen_id=2&type=integral
				url: '/pages/list/egg',
				params
			});
		},
		// 获取弹幕
		async getdanmu() {
			return;
			try {
				const { data } = await this.$store.dispatch('blind_blindRewardRecord', {
					id: this.id,
					is_scoller: 1
				});
				const len = data.length - 1;
				if (len <= 0) return;
				this.timer = setInterval(() => {
					const item = data[this.$u.random(0, len)];
					const obj = {
						// 1:普通 2：高级赏
						levelName: item.reward_name_info?.reward_name,
						name: item.user_info?.nickname,
						img: item.user_info?.avatar,
						title: item.reward_goods_info?.reward_name
					};
					this.$refs.lffBarrage && this.$refs.lffBarrage.add(obj);
				}, 3000);
			} catch (e) {
				//TODO handle the exception
				console.log(e);
			}
		},
		async iconClick(index, item) {
			// 收藏
			if (!this.$auth()) return;
			if (index == 0) {
				try {
					const obj = {
						box_id: this.id, //箱子ID
						jifen_id: this.jifen_id, //箱子ID
						do: item.state ? 'on' : 'off'
					};
					const res = await this.$store.dispatch('blind_collect', obj);
					item.state = !item.state;
					this.$u.toast(item.state ? '收藏成功' : '取消收藏');
				} catch (e) {
					this.$u.toast(e.msg || '收藏失败');
				}
			} else if (index < 3) {
				console.log(item.page);
				this.$authRoute({
					url: item.page
				});
			} else {
				this.showShare = true;
			}
		},
		// 获取指定下标的mescroll对象
		getMescroll(i) {
			let mescrollItems = this.$refs.mescrollItem;
			if (mescrollItems) {
				let item = mescrollItems;
				return item.mescroll;
			}
			return null;
		},
		// 页面数据
		async getBlindGoodsInfo(falg = true) {
			try {
				if (falg !== false) {
					this.loading = true;
				}
				this.coupon_user_id = 0;
				this.coupon_price = 0;
				this.current = 0;
				const res = await this.$store.dispatch('blind_getBlindInfo', {
					id: this.jifen_id ? this.jifen_id : this.id,
					type: this.type === 'integral' ? 3 : 0,
					box_id: this.id
				});
				this.blindInfo = res.data.info;
				this.iscomplete = this.blindInfo.box_info.winning_num == this.blindInfo.reward_goods_num;
				this.btn[0].num = this.blindInfo.recycel_splus_num;
				this.icons[0].state = this.blindInfo.is_collect == 1;
				if (this.blindInfo.extract_type == 1) {
					this.btn = [
						{
							//价格是否居中
							center: 'one',
							state: true,
							price: 88,
							num: 1,
							price1: 128,
							bg: 'https://manghe.jikechaowan.com/image/egg-ong.png'
						}
					];
				}
				this.imgsList = [...this.blindInfo.select_giving_list, ...this.blindInfo.select_reward_list].sort((a,b)=>{
					return b.blind_phase_action_ids+"".length-a.blind_phase_action_ids+"".length
				})
				if (this.imgsList.length === 0) {
					return this.$t('商品已售完，请选择其他商品', () => {
						uni.navigateBack();
					});
				}
				this.btn = this.btn.map((item, index) => {
					item.price = item.num * this.blindInfo.price;
					item.price1 = item.num * this.blindInfo.market_price;
					if (index == 0&&this.btn.length!==1) {
						item.state = this.blindInfo.reward_goods_num - this.blindInfo.box_info.winning_num <= item.num;
						return item;
					}
					item.state = this.blindInfo.reward_goods_num - this.blindInfo.box_info.winning_num >= item.num;
					this.tabbar = this.blindInfo.record_display ? ['全部奖品', '中奖记录'] : ['全部奖品'];
					return item;
				});
				this.loading = false;
				this.$nextTick(() => {
					const res = (this.top = this.$refs.nav.navHeight);
					// #ifdef MP-ALIPAY
					uni.createSelectorQuery(this)
						.select('.tabbar')
						.boundingClientRect()
						.exec(([res1]) => {
							this.topHeight = res1.top - res;
							console.log(res1.top, this.topHeight);
						});
					// #endif
					// #ifndef MP-ALIPAY
					this.$u
						.getRect('.tabbar')
						.then(res1 => {
							//    顶部的高度
							this.topHeight = res1.top - res;
						})
						.catch(err => {});
					// #endif
					this.swiperHeight = uni.getSystemInfoSync().windowHeight - res - uni.upx2px(60) + 'px';
					//状态栏高度
				});
			} catch (e) {
				this.$toast(e.msg || '参数错误'); //TODO handle the exception
			}
		},
		goPay(item) {
			console.log(item);
			if (this.iscard) return this.$u.toast('支付中，请稍后');
			if (!item.state) return;
			this.coupon_user_id = 0;
			this.coupon_price = 0;
			this.model = true;
			this.num = item.num;
		},
		payBland() {
			if (this.iscard) return;
			if (!this.$auth()) return;
			this.model = false;
			const step = this.blindInfo.real_auth_step;
			// real_auth_step 0 未实名 1未签名 2 已签名
			if (step == 0) {
				return (this.model1 = true);
			} else if (step == 1) {
				return (this.model2 = true);
			}
			if(step==2){
				this.iscard =true
			}
			this.pay();
		},
		// 支付后,跳转
		shareUrl() {
			let ruleOut = ['coupon_user_id', 'coupon_price', 'num', 'state', 'blind_type', 'reward_goods_num', 'box_num', 'winning_num'];
			let url = this.page.split('?')[1];
			let params = url.split('&');
			let obj = {};
			params.forEach(item => {
				let arr = item.split('=');
				if (ruleOut.includes(arr[0])) return;
				obj[arr[0]] = arr[1];
			});
			//还原成url
			let str = '';
			for (let key in obj) {
				str += `${key}=${obj[key]}&`;
			}
			str = str.slice(0, -1);
			let page = this.page.split('?')[0] + '?' + str;
			// 把当前的地址保存下来
			this.$cache('back_goods', page);
		},
		goOpen(type, data) {
			if(this.$cache('anima') == 1)this.showMask = true;
			else{
				this.iscard = false;
				this.getBlindGoodsInfo(false);
				this.shareUrl();
				this.$authRoute({
					url: '/pages/good/one',
					params: {
						type,
						...data
					}
				});
				return;
			}
			setTimeout(() => {
				this.showMask = false;
				this.iscard = false;
				this.getBlindGoodsInfo(false);
				this.shareUrl();
				this.$authRoute({
					url: '/pages/good/one',
					params: {
						type,
						...data
					}
				});
			}, 2000);
		},
		// 支付
		pay() {
			const obj = {
				id: this.jifen_id ? this.jifen_id : this.id,
				pay_type: this.type,
				type: this.jifen_id ? 3 : 0,
				num: this.num,
				box_id: this.id
			};
			if (this.coupon_user_id) {
				obj.coupon_user_id = this.coupon_user_id;
			}
			// TODO 去支付
			uni.showLoading({
				title: '支付中'
			});
			this.iscard = true;
			this.run = true;
			this.$store
				.dispatch('blind_buyBlindGoods', obj)
				.then(({ data }) => {
					return this.$refs.chackstand.init({
						order_id: data.order_id,
						trade_type: data.pay_type,
						order_type: 'blindOrder'
					});
				})
				.catch(err => {
					if (err.code === 60001) {
						return uni.showModal({
							title: '提示',
							content: '现只需要' + err.data.num + '发即可全收，是否继续支付？',
							success: res => {
								if (res.confirm) {
									this.num = err.data.num;
									this.pay();
								} else {
									this.run = false;
									this.iscard = false;
								}
							}
						});
					} else {
						this.run = false;
						this.iscard = false;
						this.$u.toast(err.msg || '支付失败');
					}
				});
		},
		success(res) {
			this.$t(res.msg || '支付成功', () => {
				this.iscard = false;
				this.run = false;
				this.goOpen('egg', res);
			});
		},
		fail(res) {
			this.$t(res.msg || '支付失败', () => {
				this.iscard = false;
				this.run = false;
			});
		},
		sureSign(params) {
			this.blindInfo.real_auth_step = 2;
			this.pay();
		},
		sureAuth(params) {
			uni.showLoading({
				title: '提交中',
				icon: 'none'
			});
			this.$store
				.dispatch('user_userAuth', params)
				.then(res => {
					this.$store.commit('setUserInfo', {
						...this.$store.state.userInfo,
						real_auth_step: 1
					});
					this.blindInfo.real_auth_step = 1;
					this.model1 = false;
					this.model2 = true;
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
					return this.$toast('身份验证失败,请核对!');
				});
		}
	},
	onPageScroll(e) {
		if (this.tabbar.length === 1) return;
		this.disableScroll = Math.ceil(e.scrollTop) < this.topHeight - 5;
		if (e.scrollTop >= 100) {
			this.bottom = true;
		} else {
			this.bottom = false;
		}
	},

	watch: {
		current(i) {
			if (this.tabbar.length === 1) return;
			// 当列表禁止滚动时,需把列表滚动条置顶 (解决问题: "全部"tab翻到第二页,切换到其他tab,滚动到顶部,再切回"全部"tab,此时的列表数据应该重头开始)
			if (this.disableScroll) {
				this.disableScroll = false; // 当disableScroll=true时,scroll-view的scrollTo会失效,需先开启,再置顶
				this.$nextTick(() => {
					let mescroll = this.getMescroll();
					mescroll && mescroll.scrollTo(0, 0);
					setTimeout(() => {
						// 经测试android真机需延时300ms才能恢复禁止滚动,否则scrollTo有可能无效
						this.disableScroll = true;
					}, 300);
				});
			}
		},
		goodCurrent(val, oldVal) {
			const px = uni.upx2px(200);
			this.left = val * px;
		}
	},
	onLoad(p) {
		this.id = p.id;
		this.type = p.type || 'coins';
		this.jifen_id = p.jifen_id || 0;
		this.blind_goods_id = p.blind_goods_id;
		uni.$on('coupon', e => {
			this.coupon_user_id = e.coupon_user_id;
			this.coupon_price = e.price;
			this.num = e.num;
			this.model = true;
		});
	},
	async onReady() {
		this.page = this.$getUrl();
		console.log(this.page);
		await this.getBlindGoodsInfo();

		//如果显示弹幕
		if (this.isbarrage) {
			this.getdanmu();
		}
		// #ifdef H5
		await uni.pageScrollTo({
			scrollTop: 0,
			duration: 0
		});
		// #endif
	},
	computed: {
		icon() {
			switch (this.type) {
				case 'coins':
					return 'https://manghe.jikechaowan.com/image/img_11.png';
				case 'integral':
					return 'https://manghe.jikechaowan.com/image/img_24.png';
				default:
					return 'https://manghe.jikechaowan.com/image/img_11.png';
			}
		},
		width() {
			return this.text.length * 27 * 2 + 30 + 'rpx';
		},
		text() {
			if (this.imgsList.length == 0 || !this.imgsList[this.goodCurrent]) return '';
			return this.imgsList[this.goodCurrent].reward_name;
		}
	}
};
</script>
<style>
page {
	background-image: url('https://manghe.jikechaowan.com/image/bg-egg.png');
	background-size: 100%;
	background-repeat: no-repeat;
	background-color: #1a1747 !important;
	min-height: 100vh;
	background-color: #1e2067;
	/* padding-bottom: 40rpx; */
}
</style>
<style lang="scss" scoped>
.shuaxing {
	position: absolute;
	z-index: 99;
	left: 25rpx;
	top: 1000rpx;
}

.box-icon {
	position: absolute;
	top: 440rpx;
	left: 340rpx;
}

.egg-btn {
	//渐变色
	// background: linear-gradient(to bottom, #1d1a4b, #1e2169);
	display: flex;
	align-items: center;
	padding: 25rpx;
	box-shadow: 0px 5px 55px 55px #1d1a4b;

	.four {
		width: 167rpx;
		height: 91rpx;
		background-size: 100% 100%;
		display: flex;
		align-items: flex-start;
		padding: 10rpx;

		.t1 {
			font-size: 30rpx;
		}
	}

	//废弃
	.none {
		filter: grayscale(100%);
	}

	.one {
		//filter: grayscale(100%);
		width: 280rpx;
		height: 120rpx;
		background-size: 100% 100%;
		padding-top: 30rpx;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.three {
		width: 230rpx;
		height: 119rpx;
		background-size: 100% 100%;
		padding-top: 30rpx;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-left: 70rpx;
	}

	.t1 {
		font-size: 33rpx;
		font-family: HelveticaNeue;
		font-weight: normal;
		color: #ffe230;
		line-height: 1;
		//padding-left: 0rpx;
		padding-right: 3rpx;
	}

	.t2 {
		padding-top: 5rpx;
		line-height: 1;
		font-size: 18rpx;
		font-family: PingFangSC;
		font-weight: 400;
		text-decoration: line-through;
		color: #ffffff;
		opacity: 0.6;
	}
}

@mixin cm-mixin($left: 0, $top: 0, $o: 100, $z: 1, $index: 0) {
	left: #{$left}rpx;
	top: #{$top}rpx;
	opacity: #{$o/100};
	transform: scale(#{(random(10) + 90) / 100}) rotate(#{random(100)}deg);
	z-index: $z;
	$a: 0;

	@if ($index%3==0) {
		$a: 0.4s;
	} @else if ($index%2==0) {
		$a: 0.2s;
	} @else {
		$a: 0s;
	}

	animation: run 1s ease-in-out infinite alternate $a;
}

@for $i from 0 through 9 {
	.run#{$i} {
		$a: 0;
		$b: 0;

		@if ($i%3==0) {
			$a: 0.6s;
			$b: 0.1s;
		} @else if ($i%2==0) {
			$a: 0.5s;
			$b: 0.2s;
		} @else {
			$a: 0.4s;
			$b: 0.05s;
		}

		animation: move#{$i} ease-in-out infinite alternate $a $b !important;
	}
}

@mixin move-mixin($x1, $y1, $x2, $y2) {
	$a: 0;

	@if (random(10) > 5) {
		$a: -180deg;
	} @else {
		$a: 180deg;
	}

	0% {
		transform: rotate(random(180deg)-$a);
	}

	33% {
		transform: rotate(random(180deg)-$a);
		left: #{$x1}rpx;
		top: #{$y1}rpx;
	}

	66% {
		transform: rotate(random(180deg) + $a);
		left: #{$x2}rpx;
		top: #{$y2}rpx;
	}

	100% {
		transform: rotate(random(180deg)-$a);
	}
}

@keyframes move0 {
	@include move-mixin(-100, -100, 100, -100);
}

@keyframes move1 {
	@include move-mixin(-90, 0, -100, -100);
}

@keyframes move2 {
	@include move-mixin(-90, 0, 100, -100);
}

@keyframes move3 {
	@include move-mixin(-90, 90, 0, -100);
}

@keyframes move4 {
	@include move-mixin(90, 90, 50, -100);
}

@keyframes move5 {
	@include move-mixin(90, -90, 0, -110);
}

@keyframes move6 {
	@include move-mixin(-90, -90, 0, -110);
}

@keyframes move7 {
	@include move-mixin(-90, 90, -50, 0);
}

@keyframes move8 {
	@include move-mixin(-90, 90, -100, -110);
}

@keyframes run {
	$i: 0;

	@if (round(random(100)) <50) {
		$i: 10rpx;
	} @else {
		$i: -10rpx;
	}

	50% {
		transform: translate($i, -20rpx);
	}

	100% {
		transform: translateX(0);
	}
}

.img-0 {
	//$top:0, $left:0,$zoom:100,$rotate:0,$o:100,$z:1
	@include cm-mixin(80, 85, 90, 1, 0);
}

.img-1 {
	//$top:0, $left:0,$zoom:100,$rotate:0,$o:100,$z:1
	@include cm-mixin(30, 110, 80, 2, 2);
}

.img-2 {
	//$top:0, $left:0,$zoom:100,$rotate:0,$o:100,$z:1
	@include cm-mixin(-40, 115, 80, 2, 2);
}

.img-3 {
	//$top:0, $left:0,$zoom:100,$rotate:0,$o:100,$z:1
	@include cm-mixin(-90, 85, 90, 2, 3);
}

.img-4 {
	//$top:0, $left:0,$zoom:100,$rotate:0,$o:100,$z:1
	@include cm-mixin(-120, 26, 100, 2, 4);
}

.img-5 {
	//$top:0, $left:0,$zoom:100,$rotate:0,$o:100,$z:1
	@include cm-mixin(-50, 45, 90, 1, 5);
}

.img-6 {
	//$top:0, $left:0,$zoom:100,$rotate:0,$o:100,$z:1
	@include cm-mixin(20, 50, 80, 1, 6);
}

.img-7 {
	//$top:0, $left:0,$zoom:100,$rotate:0,$o:100,$z:1
	@include cm-mixin(106, 34, 90, 2, 7);
}

.img-8 {
	//$top:0, $left:0,$zoom:100,$rotate:0,$o:100,$z:1
	@include cm-mixin(70, 0, 100, 1, 8);
}

.bg-box {
	background-image: url('https://manghe.jikechaowan.com/image/big-box.png');
	background-size: 100% 100%;
	width: 410rpx;
	height: 440rpx;
	margin: 80rpx auto 190rpx;
	position: relative;

	.box-img {
		display: flex;
		position: absolute;
		left: 50%;
		top: 50%;
		width: 80rpx;
		height: 80rpx;
		transform: translate(-50%, -50%);
	}

	.mg {
		//定位元素居中
		position: absolute;
		display: inline-block;
	}
}

.btns {
	width: 750rpx;
	padding: 25rpx;
	box-shadow: 0rpx 10rpx 30rpx 30rpx #1d1a4b;
	background: #1d1a4b !important;
}

.complete {
	height: 100rpx;

	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	font-family: PingFangSC;
	font-weight: 500;
	color: #b8b8ba;
}

.icon {
	position: absolute;
	top: 735rpx;
	right: 22rpx;
	z-index: 99;

	// background-image: url(https://manghe.jikechaowan.com/image/IMG_3576.png);
	.down {
		transform: rotate(180deg) !important;
	}

	.img {
		transition: all 0.3s;
		transform: rotate(0deg);
		margin: 0 auto;
		display: flex;
		justify-content: center;
		position: relative;

		&::after {
			position: absolute;
			content: '';
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 120%;
			height: 120%;
		}
	}

	.icons {
		width: 65rpx;
		height: 384rpx;
		position: relative;
		overflow: hidden;

		.item {
			position: absolute;
			transition: all 0.5s ease-in-out;
			left: 50%;
			display: flex;
			justify-content: center;
			width: 65rpx;
			transform: translateX(-50%);
		}
	}
}

.btn {
	width: 699rpx;
	height: 110rpx;
	margin: 31rpx auto 0;
	//background: #D0F0FF;
	background-image: url('https://manghe.jikechaowan.com/image/img-13.png');
	background-size: 100% 100%;
	display: flex;
	flex-direction: column;
	align-items: center;

	.btn-top {
		margin-top: 14rpx;
		font-size: 36rpx;
		font-family: YouSheBiaoTiHei;
		font-weight: 400;
		color: #ffffff;
		line-height: 1;
	}

	.btn-bottom {
		display: flex;
		align-items: flex-end;

		.t1 {
			font-size: 33rpx;
			font-family: HelveticaNeue;
			font-weight: normal;
			color: #ffe230;
			line-height: 1;
			margin-left: 10rpx;
			margin-right: 20rpx;
		}

		.t2 {
			font-size: 20rpx;
			line-height: 1;
			font-family: PingFangSC;
			font-weight: 400;
			text-decoration: line-through;
			color: #ffffff;
			opacity: 0.6;
		}
	}
}

.btn1-box {
	position: fixed;
	padding-bottom: 30rpx;
	bottom: 0rpx;
	left: 50%;
	background-color: #1d1a4b;
	transform: translateX(-50%);
	box-shadow: 0rpx 10rpx 100rpx 100rpx #1d1a4b;
}

.btn1 {
	@extend .btn;
}

.scroll {
	//margin-top: 30rpx;
	//padding-left:30rpx;
	padding-right: 30rpx;
	position: relative;

	.content {
		padding: 30rpx 30rpx 30rpx 30rpx;
		display: flex;

		.tip1 {
			position: absolute;
			top: 0rpx;
			left: 0rpx;
			padding: 0 10rpx 0 5rpx;
			height: 29rpx;
			background: #dda822;
			border-bottom-right-radius: 5rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			//margin-left: -2rpx;
			font-size: 20rpx;
			line-height: 1;
			font-family: PingFangSC;
			font-weight: 500;
			font-style: italic;
			color: #ffffff;
		}

		.tip {
			height: 35rpx;
			background: rgba(0, 0, 0, 0.8);
			position: absolute;
			bottom: 0rpx;
			line-height: 35rpx;
			left: 0;
			right: 0;
			text-align: center;
			font-size: 18rpx;
			font-family: PingFangSC;
			font-weight: 400;
			color: #ffffff;
		}

		.item {
			flex-shrink: 0;
			background-size: 100%;
			width: 181rpx;
			position: relative;
			height: 181rpx;
			border-radius: 5rpx 18rpx 5rpx 18rpx;
			margin-right: 25rpx;
			overflow: hidden;
			border: 4rpx solid #fff;
		}
	}
}

.tabbar {
	z-index: 90;
	position: sticky;
	top: 0;
	display: flex;
	height: 60rpx;
	justify-content: space-evenly;
	align-items: center;

	.tabbar-item {
		font-size: 31rpx;
		font-family: PingFangSC;
		font-weight: 600;
		color: #ffffff;
		opacity: 0.4;
	}

	.on {
		opacity: 1;
		text-shadow: 0px 2px 4px #150e2e;
		position: relative;

		&:after {
			content: '';
			position: absolute;
			width: 322rpx;
			height: 163rpx;
			bottom: -10rpx;
			left: 50%;
			// background-color: #1e2067;
			transform: translateX(-50%);
			background-image: url('https://manghe.jikechaowan.com/image/img-7.png');
			background-size: 100%;
		}
	}

	&:after {
		content: '';
		position: absolute;
		width: 699rpx;
		height: 2rpx;
		background: #ffffff;
		opacity: 0.1;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
}

.tip {
	margin-top: 19rpx;
	font-size: 18rpx;
	font-family: PingFangSC;
	font-weight: 400;
	text-align: center;
	color: #ffffff;
	opacity: 0.6;
}

.pages {
	padding-top: 220rpx;
	position: relative;

	// padding-bottom: 43rpx;
}

.alert {
	position: absolute;
	left: 0;
	right: 0;
	height: 72rpx;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: space-between;
	padding: 0 25rpx;
	align-items: center;

	.alert-left {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		font-family: PingFangSC;
		vertical-align: middle;
		font-weight: 400;
		color: #ffffff;

		text {
			font-size: 28rpx;
			font-family: PingFangSC;
			font-weight: 400;
			color: #ffe230;
			padding: 0 5rpx;
		}
	}

	.alert-right {
		display: flex;
		align-items: center;

		text {
			font-size: 24rpx;
			font-family: PingFangSC;
			font-weight: 600;
			font-style: italic;
			color: #ffe230;
			padding: 0 5rpx;
		}
	}
}

.box {
	.title {
		font-size: 43rpx;
		font-family: YouSheBiaoTiHei;
		text-align: center;
		font-weight: 400;
		text-shadow: 0px 0px 10px rgba(255, 255, 255, 1);
		color: #fffbf4;
		line-height: 1;
	}

	//文字滚动动画
	@keyframes text-scroll {
		0% {
			transform: translateX(0);
		}

		100% {
			transform: translateX(-100%);
		}
	}

	.nav {
		margin: -5rpx auto 0;
		width: 743rpx;
		height: 112rpx;
		background-image: url('https://manghe.jikechaowan.com/image/img-2.png');
		background-size: 100%;

		.notice {
			width: 355rpx;
			padding-top: 54rpx;
			margin: 0 auto;
			overflow: hidden;
			display: flex;

			.margin {
				width: 80rpx;
				flex-shrink: 0;
				animation: text-scroll 3s linear infinite;
			}

			.text {
				//文字不换行
				animation: text-scroll 3s linear infinite;
				white-space: nowrap;
				font-size: 32rpx;
				font-family: YouSheBiaoTiHei;
				width: auto;
				font-weight: 400;
				text-shadow: 0px 0px 10px rgba(255, 255, 255, 1);
				color: #fffbf4;
				line-height: 1;
			}
		}
	}
}
</style>
