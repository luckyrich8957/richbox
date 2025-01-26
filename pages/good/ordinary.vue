<template>
	<zero-loading v-if="loading" type="circle"></zero-loading>
	<mescroll-body v-else ref="mescrollRef" :down="{ use: false }" :sticky="true" :up="upOption" @init="mescrollInit">
		<view class="pages" :style="{ paddingBottom: iscomplete||current == 1 ? '0' : '150rpx' }">
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
				<view class="alert-left">
					当前箱：第
					<text>{{ blindInfo.box_info.box_num }}/{{ blindInfo.box_num }}</text>
					箱 | 剩
					<text>{{ blindInfo.reward_goods_num-blindInfo.box_info.winning_num }}/{{ blindInfo.reward_goods_num }}</text>
					抽
				</view>
				<view class="alert-right">
					<u-icon name="https://manghe.jikechaowan.com/image/img-5.png" size="28rpx"></u-icon>
					<text>换箱子</text>
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
				<view class="good">
					<view class="arrow-left" @click="leftClick"><u-image height="109rpx" src="https://manghe.jikechaowan.com/image/img-6.png" width="54rpx"></u-image></view>
					<view class="arrow-right" @click="rightClick"><u-image height="109rpx" src="https://manghe.jikechaowan.com/image/img-6.png" width="54rpx"></u-image></view>
					<view class="img-box" style="flex: 1; position: relative;overflow: hidden;">
						<view :style="{ transform: 'rotateY(' + -face + 'deg)' }" class="img img-face">
							<view class="tip-top">
								<view class="left">只赠送不售卖</view>
								<view class="right">{{ goodCurrent + 1 }}/{{ imgsList.length }}</view>
							</view>
							<u-image :src="arr[0]" height="410rpx" mode="aspectFill" width="410rpx" @click="showDetailed"></u-image>
							<view class="tip-bottom">
								<text style="font-size: 24rpx">￥</text>
								<text>{{ imgsList[goodCurrent].price }}</text>
							</view>
						</view>
						<view :style="{ transform: 'rotateY(' + -back + 'deg)', zIndex: '2' }" class="img img-back">
							<view class="tip-top">
								<view class="left">只赠送不售卖</view>
								<view class="right">{{ goodCurrent }}/{{ imgsList.length }}</view>
							</view>
							<u-image :src="arr[1]" height="410rpx" mode="aspectFill" width="410rpx"></u-image>
							<view class="tip-bottom">
								<text style="font-size: 24rpx">￥</text>
								<text>{{ imgsList[goodCurrent].price }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="tip" style="margin-bottom: 168rpx; height: 24rpx" @click="showDetailed">点击查看商品详情</view>
			</view>
			<view :style="{ top: top }" class="tabbar">
				<view :class="{ 'tabbar-item': true, on: current === 0 }" @click="current = 0">全部奖品</view>
				<view v-if="blindInfo.record_display === 1" :class="{ 'tabbar-item': true, on: current === 1 }" @click="current = 1">中奖记录</view>
			</view>
			<view v-show="current === 0">
				<scroll-view :scroll-left="left" :scroll-with-animation="true" :scroll-x="true" class="scroll">
					<view class="content">
						<view v-for="(item, index) in imgsList" :id="'good-' + index" :class="{ item: true, on: goodCurrent === index }" @click="itemClick(index)">
							<u-image :src="imgsList[index].img" height="180rpx" width="180rpx"></u-image>
							<view class="tip" v-if='item.blind_phase_action_ids'>只赠送不售卖</view>
							<view class="tip u-flex u-row-between" style='padding: 0 15rpx;' v-else>
								
								<text>{{item.reward_type_info.reward_name}}</text>
								<text>
									{{item.splus_num}}/{{item.reward_num}}
								</text>
							
							</view>
						</view>
						<view style="width: 30rpx; height: 1rpx; flex-shrink: 0"></view>
					</view>
				</scroll-view>
				<block v-if="!iscomplete">
					<view @click="goPay({ num: 1 })" v-if="blindInfo.extract_type === 1" class="btn">
						<view class="btn-top" >来一发</view>
						<view class="btn-bottom">
							<u-icon :name="icon" size="23rpx"></u-icon>
							<text class="t1">{{ blindInfo.price }}</text>
							<text class="t2">{{ blindInfo.market_price }}</text>
						</view>
					</view>
					<view v-else class="btns">
						<view
							v-for="(item, index) in btn"
							:key="index"
							:class="{ 'btn-item': true, no: !item.state }"
							:style="'background-image:url(' + item.bg + ') ;'"
							@click="goPay(item)"
						>
							<view class="item-top">{{ item.name }}</view>
							<view v-if="item.state" class="item-bottom">
								<u-icon :name="icon" size="23rpx"></u-icon>
								<text class="t1">{{ parseFloat(blindInfo.price * item.num) }}</text>
								<text v-if="item.market_price" class="t2">{{ parseFloat(blindInfo.market_price * item.num) }}</text>
							</view>
						</view>
					</view>
				</block>
				<view v-else class="complete">本箱已售罄</view>
				<view style="height: 50rpx"></view>
			</view>
			<view v-if="current === 1">
				<ordinary-item
					v-if="swiperHeight.length"
					:bottom="iscomplete ? '20' : '200'"
					ref="mescrollItem"
					:disableScroll="disableScroll"
					:swiperHeight="swiperHeight"
					:uid="id"
				/>
			</view>
			<view v-if="current === 1 && bottom && !iscomplete" class="btn1-box safe-area-inset-bottom">
				<view v-if="isOne" class="btn1"  @click="goPay({ num: 1 })">
					<view class="btn-top">来一发</view>
					<view class="btn-bottom">
						<u-icon :name="icon" size="23rpx"></u-icon>
						<text class="t1">{{ parseFloat(blindInfo.price) }}</text>
						<text class="t2">{{ parseFloat(blindInfo.market_price) }}</text>
					</view>
				</view>
				<view v-else class="btns">
					<view
						v-for="(item, index) in btn"
						:key="index"
						:class="{ 'btn-item': true, no: !item.state }"
						:style="'background-image:url(' + item.bg + ') ;'"
						@click="goPay(item)"
					>
						<view class="item-top">{{ item.name }}</view>
						<view v-if="item.state" class="item-bottom">
							<u-icon :name="icon" size="23rpx"></u-icon>
							<text class="t1">{{ parseFloat(blindInfo.price * item.num) }}</text>
							<text v-if="item.market_price" class="t2">{{ parseFloat(blindInfo.market_price * item.num) }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<model13 v-model="model" :blindInfo="blindInfo" :coupon_price="coupon_price" :num="num" :type="type" @submit="payBland" />
		<model12 v-model="model2" @submit="sureSign"></model12>
		<model11 v-model="model1" @submit="sureAuth"></model11>
		<model15 v-model="model15" :content="content"></model15>
		<share ref="share" v-model="showShare" :goodInfo="blindInfo" :page="page" />
		<chackstand ref="chackstand" @fail="fail" @success="success" />
		<my-mask :show="showMask" url="https://smiaoshen.oss-cn-hangzhou.aliyuncs.com/image/4.gif"></my-mask>
	</mescroll-body>
</template>

<script>
import chackstand from '@/pages/order/checkstand.vue';
import share from '@/components/share.vue';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import uIcon from 'uview-ui/components/u-icon/u-icon';
import ordinaryItem from './comopnents/ordinaryItem.vue';
import model13 from '@/components/modal13.vue';
import model11 from '@/components/modal11.vue';
import model12 from '@/components/modal12.vue';
import UImage from '../../uview-ui/components/u-image/u-image';
import model15 from '@/components/model15.vue';
import myMask from '@/components/myMask.vue';
export default {
	mixins: [MescrollMixin], // 使用mixin
	components: {
		chackstand,
		UImage,
		uIcon,
		ordinaryItem,
		model13,
		model12,
		model15,
		share,
		model11,
		myMask
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
			model15: false,
			isshuaxing: false,
			loading: true,
			content: '',
			page: '',
			type: '',
			model2: false,
			model1: false,
			showShare: false,
			// 付款弹框
			model: false,
			coupon_price: 0,
			btn: [
				{
					name: '全收',
					state: true,
					price: 18888,
					num: 0,
					market_price: false,
					bg: 'https://manghe.jikechaowan.com/image/index/1_03.png'
				},
				{
					name: '来一发',
					state: true,
					price: 440,
					market_price: 510,
					num: 1,
					bg: 'https://manghe.jikechaowan.com/image/index/1_05.png'
				},
				{
					name: '来五发',
					state: true,
					price: 440,
					num: 5,
					market_price: 510,
					bg: 'https://manghe.jikechaowan.com/image/index/1_07.png'
				},
				{
					name: '来十发',
					state: true,
					price: 440,
					num: 10,
					market_price: 1020,
					bg: 'https://manghe.jikechaowan.com/image/index/1_09.png'
				}
			],
			// 是否是单抽
			isOne: false,
			// 是否已售完
			bottom: false,
			upOption: {
				use: false // 主体框架只启用下拉刷新
			},
			topHeight: uni.upx2px(600), // 顶部内容的高度 (单位px)
			swiperHeight: 0,
			disableScroll: true, // swiper列表是否禁止滚动
			back_img: '',
			currentImg: 0,
			show: false,
			face: 0,
			back: 180,
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
					page: 'pages/reward/reward',
					icon: 'https://manghe.jikechaowan.com/image/img-16.png'
				},
				{
					name: '分享',
					icon: 'https://manghe.jikechaowan.com/image/img-17.png'
				}
			],
			left: 0,
			current: 0, //
			iscard: false,
			goodCurrent: 0,
			coupon_user_id: 0,
			top: 0,
			background: {
				backgroundImage: `url(https://manghe.jikechaowan.com/image/new/new-bg.png)`,
				backgroundSize: 'cover'
			},
			id: '',
			blindInfo: {
				num: 0,
				box_info: {
					winning_num: 0
				},
				reward_goods_num: 0
			},
			imgsList: [
				{
					img: '',
					price: 0,
					reward_name: ''
				}
			],
			blind_goods_id: 0,
			num: '',
			jifen_id: 0
		};
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

	methods: {
		itemClick(index) {
			this.goodCurrent = index;
			this.$nextTick(() => {
				this.showDetailed();
			});
		},
		showDetailed() {
			const info = this.imgsList[this.goodCurrent];
			// this.content=info.
			if (info.content_info) {
				this.content = info.content_info;
				this.model15 = true;
			}
		},
		alert(index) {
			if (index) {
				const params = {
					id: this.blind_goods_id,
					type: this.type,
					show: true
				};
				if (this.jifen_id) {
					params.jifen_id = this.jifen_id;
				}
				return this.$authRoute({
					url: '/pages/list/box',
					params
				});
			}
			const params = {
				show: true,
				id: this.blind_goods_id,
				type: this.type
			};
			if (this.jifen_id) {
				params.jifen_id = this.jifen_id;
			}
			this.$authRoute({
				url: '/pages/list/box',
				params
			});
		},
		shuanxingClick() {
			this.getBlindGoodsInfo();
		},
		payBland() {
			if(this.iscard) return
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
		pay() {
			this.iscard = true;
			const obj = {
				id: this.jifen_id ? this.jifen_id : this.id,
				pay_type: this.type,
				num: this.num,
				box_id: this.id,
				type: this.jifen_id ? 3 : 0
			};
			if (this.isOne) {
				obj.num = 1;
			}
			if (this.coupon_user_id) {
				obj.coupon_user_id = this.coupon_user_id;
			}
			// TODO 去支付
			uni.showLoading({
				title: '支付中',
				mask: true
			});
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
									this.iscard = false;
								}
							}
						});
					}else {
						this.iscard = false;
						this.$u.toast(err.msg || '支付失败');
					}
				});
		},
		success(res) {
			this.coupon_user_id = 0;
			this.coupon_price = 0;
			this.goOpen('box', res);
		},
		fail(res) {
			this.$t(res.msg || '支付失败', () => {
				this.iscard = false;
			});
		},
		sureSign(params) {
			this.blindInfo.real_auth_step = 2;
			this.pay();
		},
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
			return;
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
				return ;
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
		changeBox() {
			this.$authRoute({
				url: '/pages/list/box',
				params: {
					id: this.blind_goods_id,
					show: true
				}
			});
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
		async getBlindGoodsInfo(item) {
			this.coupon_user_id = 0;
			this.coupon_price = 0;
			if (item !== false) {
				this.loading = true;
			}
			// console.log(this.$refs.);
			this.current = 0;
			this.page = this.$getUrl();
			this.$store
				.dispatch('blind_getBlindInfo', {
					id: this.jifen_id ? this.jifen_id : this.id,
					type: this.type === 'integral' ? 3 : 0,
					box_id: this.id
				})
				.then(res => {
					this.blindInfo = res.data.info;
					if (this.blindInfo.extract_type == 1) {
						this.isOne = true;
					} else {
						this.isOne = false;
					}
					this.imgsList = [...this.blindInfo.select_giving_list, ...this.blindInfo.select_reward_list].sort((a,b)=>{
					return b.blind_phase_action_ids+"".length-a.blind_phase_action_ids+"".length
				})
					if (this.imgsList.length === 0) {
						return this.$t('商品已售完，请选择其他商品', () => {
							this.alert(1);
						});
					}

					this.btn[0].num = this.blindInfo.recycel_splus_num; //5
					this.btn = this.btn.map((item, index) => {
						if (index == 0) {
							item.state = this.blindInfo.reward_goods_num - this.blindInfo.box_info.winning_num <= item.num;
							return item;
						}
						item.state = this.blindInfo.reward_goods_num - this.blindInfo.box_info.winning_num >= item.num;
						console.log(this.blindInfo.reward_goods_num, this.blindInfo.box_info.winning_num, item.num);
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
								console.log(res1, this.topHeight);
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
						console.log(this.swiperHeight,res,uni.getSystemInfoSync().windowHeight);
						//状态栏高度
					});
				})
				.catch(res => this.$toast(res.msg));
		},
		rightClick() {
			if (this.goodCurrent + 1 >= this.imgsList.length) {
				//超
				this.goodCurrent = 0;
			} else {
				this.goodCurrent++;
			}
		},
		leftClick() {
			if (this.goodCurrent - 1 >= 0) {
				//超
				this.goodCurrent--;
			} else {
				this.goodCurrent = this.imgsList.length - 1;
			}
		},
		goPay(item) {
			
			if (this.iscard) return this.$u.toast('支付中，请稍后');
			if('state' in item){
				if (!item.state) return;
			}	
			this.coupon_user_id = 0;
			this.coupon_price = 0;
			console.log(item);
			this.model = true;
			this.num = item.num;
		}
	},
	// 页面的滚动事件
	onPageScroll(e) {
		this.disableScroll = Math.ceil(e.scrollTop) < this.topHeight - 5;
		if (e.scrollTop >= 100) {
			this.bottom = true;
		} else {
			this.bottom = false;
		}
	},
	watch: {
		current(i) {
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
			val = val + 1;
			this.good_id = 'good-' + val;
			if (val > this.imgsList.length) val = 1;
			this.currentImg = this.currentImg === 0 ? 1 : 0;
			this.arr[this.currentImg] = this.imgsList[val - 1].img;
			this.$nextTick(() => {
				this.back = this.back ? 0 : 180;
				this.face = this.face ? 0 : 180;
			});
			const px = uni.upx2px(210);
			this.left = (val - 1) * px;
		}
	},
	async onReady() {
		await this.getBlindGoodsInfo();
		// #ifdef H5
		await uni.pageScrollTo({
			scrollTop: 0,
			duration: 0
		});
		// #endif
	},
	computed: {
		width() {
			return this.text.length * 27 * 2 + 30 + 'rpx';
		},
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
		blindInfoImgs() {
			let ret = [];
			console.log('res', ret);
			return ret;
		},
		arr() {
			return [this.imgsList[0].img, this.imgsList[0].img];
		},
		text() {
			if (this.imgsList.length == 0 || !this.imgsList[this.goodCurrent]) return '';
			return this.imgsList[this.goodCurrent].reward_name;
		},
		textDelay() {
			console.log(this.text);
			return this.text.length * 0.2;
		},
		iscomplete() {
			return this.blindInfo.box_info.winning_num >= this.blindInfo.reward_goods_num;
		}
	}
};
</script>
<style>
page {
	background-image: url('https://manghe.jikechaowan.com/image/new/new-bg.png');
	background-size: 100%;
	background-repeat: no-repeat;
	background-color: #1a1749 !important;
	min-height: 100vh;
	/* padding-bottom: 40rpx; */
}
</style>
<style lang="scss" scoped>
.shuaxing {
	position: absolute;
	z-index: 100;
	left: 25rpx;
	top: 1000rpx;
}

.btns {
	width: 750rpx;
	padding: 25rpx 50rpx;
	position: fixed;
	left: 0;
	box-shadow: 0 -16rpx 16rpx rgba(10, 16, 20, 0.24), 0 0 16rpx rgba(10, 16, 20, 0.12), 0 16rpx 16rpx rgba(10, 16, 20, 0.24);
	background-color: rgba(0, 0, 0, 0.3);
	right: 0;
	bottom: 40rpx;
	z-index: 999;
	display: flex;
	justify-content: space-between;
	width: 750rpx;
	padding: 25rpx;
	.no {
		background: rgba(0, 0, 0, 0.4);
		opacity: 0.3;
	}

	.btn-item {
		background-size: 100% 100%;
		// background-position: 20rpx 20rpx;
		width: 167rpx;
		height: 91rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.item-top {
			font-size: 28rpx;
			font-family: YouSheBiaoTiHei;
			font-weight: 400;
			color: #ffffff;
			text-align: center;
			line-height: 1;
			margin-bottom: 10rpx;
		}

		.item-bottom {
			display: flex;
			align-items: flex-end;
			justify-content: center;

			.t1 {
				font-size: 28rpx;
				font-family: HelveticaNeue;
				font-weight: normal;
				color: #ffe230;
				line-height: 1;
				margin-left: 10rpx;
				margin-right: 10rpx;
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
	position: fixed;
	width: 699rpx;
	height: 110rpx;
	left: 50%;
	transform: translateX(-50%);
	bottom: 40rpx;
	background-image: url('https://manghe.jikechaowan.com/image/img-13.png');
	background-size: 100% 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 -16rpx 16rpx rgba(10, 16, 20, 0.24), 0 0 16rpx rgba(10, 16, 20, 0.12), 0 16rpx 16rpx rgba(10, 16, 20, 0.24);
	background-color: rgba(0, 0, 0, 0.3);
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

	box-shadow: 0rpx 10rpx 100rpx 100rpx #1d1a4b;
	.btns {
		width: 750rpx;
		padding: 25rpx;
		// box-shadow: 0rpx 10rpx 100rpx 100rpx #1d1a4b;
		display: flex;

		justify-content: space-between;
	}
}

.btn1 {
	@extend .btn;
}

.scroll {
	//margin-top: 30rpx;
	//padding-left:30rpx;
	padding-right: 30rpx;
	position: relative;

	&:after {
		content: '';
		position: absolute;
		bottom: -10rpx;
		left: 0;
		width: 100%;
		height: 91rpx;
		background: linear-gradient(0deg, #1e2372 0%, rgba(26, 24, 76, 0.2) 100%);
	}

	.content {
		padding: 30rpx 30rpx 30rpx 30rpx;
		display: flex;

		.tip {
			height: 29rpx;
			background: rgba(0, 0, 0, 0.4);
			position: absolute;
			bottom: 20rpx;
			line-height: 29rpx;
			left: 0;
			right: 0;
			text-align: center;
			font-size: 18rpx;
			font-family: PingFangSC;
			font-weight: 400;
			color: #ffffff;
		}

		.on {
			&:after {
				content: '';
				position: absolute;
				background-image: url('https://manghe.jikechaowan.com/image/img-12.png');
				background-size: 100% 100%;
				width: 210rpx;
				height: 210rpx;
				top: -15rpx;
				left: -15rpx;
			}
		}

		.item {
			flex-shrink: 0;
			background-size: 100%;
			margin-right: 25rpx;
			border-radius: 10rpx;
			border: 4rpx solid #ffe230;
			position: relative;
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
	margin-top: 50rpx;
	font-size: 22rpx;
	font-family: PingFangSC;
	font-weight: 400;
	text-align: center;
	color: #ffffff;
	opacity: 0.6;
}

.good {
	.tip-top {
		z-index: 999;
		position: absolute;
		left: 0;
		right: 0;
		top: 0rpx;
		height: 40rpx;
		// background: rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 15px;
		font-size: 18rpx;
		font-family: PingFangSC;
		font-weight: 400;
		color: #ffffff;
	}

	.tip-bottom {
		z-index: 999;
		position: absolute;

		line-height: 48rpx;
		text-align: center;
		right: 0;
		left: 0;
		bottom: 0;
		text-align: center;
		height: 48rpx;
		color: #ffffff;
		font-size: 33rpx;
		font-family: HelveticaNeue;
		font-weight: normal;
		color: #ffffff;
	}

	margin-top: 32rpx;
	display: flex;
	justify-content: center;
	position: relative;
	height: 423rpx;

	.arrow-left {
		top: 50%;
		left: 72rpx;
		z-index: 99;
		position: absolute;
		transform: translateY(-50%) rotate(180deg);
	}

	.arrow-right {
		z-index: 99;
		top: 50%;
		right: 72rpx;
		position: absolute;
		transform: translateY(-50%);
	}

	.img {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0;
		margin: 0 auto;
		width: 426rpx;
		height: 426rpx;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		backface-visibility: hidden;
		transition: transform 2s;
		z-index: 99;
	}
}

.pages {
	padding-top: 248rpx;
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
