<template>
	<zero-loading v-if="loading" type="circle"></zero-loading>
	<view v-else class="pages">
		<view :class="{ shuaxing: true }"><u-image height="91rpx" src="@/static/material/shuaxing.png" width="91rpx" @click="getBlindGoodsInfo"></u-image></view>
		<lff-barrage ref="lffBarrage" :fixed="false" :height="barrageHeight + 'rpx'" :hrackH="barrageHeight" :minTop="top * 2 + 50" :padding="top"></lff-barrage>
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
		<u-navbar ref="nav" :back-icon-size="40" :background="background" :immersive="true" :border-bottom="false" back-icon-color="#ffffff" class="nav"></u-navbar>
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY -->
		<u-navbar ref="nav" :back-icon-size="40" :background="background" :immersive="true" :border-bottom="false" back-icon-color="transparent" class="nav"></u-navbar>
		<!-- #endif -->
		<view class="box">
			<!-- <view class=""> {{imgsList[goodCurrent].reward_type_info.img}}</view> -->
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
						:style="{ 'animation-delay': text.length > 10 ? -text.length * 0.2 + 's' : '-3s', 'animation-duration': text.length > 10 ? text.length * 0.2 + 's' : '3s' }"
						class="text"
					>
						{{ text }}
					</view>
				</view>
			</view>
			<view class="good">
				<view class="arrow-left" @click="leftClick"><u-image height="109rpx" src="https://manghe.jikechaowan.com/image/img-6.png" width="54rpx"></u-image></view>
				<view class="arrow-right" @click="rightClick"><u-image height="109rpx" src="https://manghe.jikechaowan.com/image/img-6.png" width="54rpx"></u-image></view>
				<view :class="{ 'img-box': true, run: loading }">
					<swiper :circular="true" :current="goodCurrent" style="height: 100%; width: 100%;" @change="change">
						<swiper-item v-for="(item, index) in imgsList" :key="index">
							<view class="swiper-item u-flex u-row-center" style="position: relative;">
								<view class="goods-h">
									<view class="h-l u-flex">
										<text>￥{{ imgsList[goodCurrent] && imgsList[goodCurrent].price }}</text>
									</view>
								</view>
								<u-image :src="item.img" height="426rpx" width="426rpx" @click="showDetailed"></u-image>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<view class="tabbar" style="margin-top: 230rpx">
			<u-image class="allbtn" height="54rpx" src="/static/material/allbtn.png" width="217rpx" @click="model3 = true"></u-image>
			<u-image class="allbtn" height="54rpx" src="https://manghe.jikechaowan.com/image/img/jilu.png" width="217rpx" @click="model18 = true"></u-image>
		</view>
		<view class="page-box">
			<view class="page-l" @click="arrowClick(-1)"><u-image height="45rpx" src="/static/icon/arrow-left.png" width="25rpx"></u-image></view>
			<view class="page u-flex">
				<view
					v-for="(item, index) in imgsList"
					:id="'good-' + index"
					:class="{ item: true, on: goodCurrent === index }"
					@click="
						goodCurrent = index;
						showDetailed();
					"
				>
					<u-image :src="imgsList[index] && imgsList[index].img" height="130rpx" width="130rpx"></u-image>
					<view class="tip">只赠送不售卖</view>
				</view>
				<view v-for="(item, index) in 4 - imgsList.length" style="width: 130rpx;"></view>
			</view>
			<view class="page-r" @click="arrowClick(1)"><u-image height="45rpx" src="/static/icon/arrow-right.png" width="25rpx"></u-image></view>
		</view>
		<view class="complete">{{ iscomplete ? '本箱已售罄' : '' }}</view>
		<view v-if="!iscomplete" class="btns">
			<view v-for="(item, index) in btn" :key="index" :class="{ 'btn-item': true, no: !item.state }" :style="'background-image:url(' + item.bg + ') ;'" @click="goPay(item)">
				<view class="item-top">{{ item.name }}</view>
				<view class="item-bottom">
					<u-icon :name="icon" size="23rpx"></u-icon>
					<text class="t1">{{ item.price }}</text>
					<text v-if="item.price1" class="t2">{{ item.price1 }}</text>
				</view>
			</view>
		</view>
		<model13 v-model="model" :blindInfo="blindInfo" :coupon_price="coupon_price" :num="num" :type="type" from="one" @submit="payBland" />
		<model12 v-model="model2" @submit="sureSign"></model12>
		<model11 v-model="model1" @submit="sureAuth"></model11>
		<model15 v-model="model15" :content="content"></model15>
		<model16 v-model="model3" :total_goods="total_goods" :type="type" :uid="id" @itemClick="itemClick"></model16>
		<model18 v-model="model18" :total_goods="total_goods" :type="type" :uid="id" @itemClick="itemClick"></model18>
		<share ref="share" v-model="showShare" :goodInfo="blindInfo" :page="page" />
		<chackstand ref="chackstand" @fail="fail" @success="success" />
		<my-mask :show="showMask" url="https://smiaoshen.oss-cn-hangzhou.aliyuncs.com/image/4.gif"></my-mask>
	</view>
</template>

<script>
function sleep(value = 100) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, value);
	});
}
import chackstand from '@/pages/order/checkstand.vue';
import myMask from '@/components/myMask.vue';
import share from '@/components/share.vue';
import uIcon from 'uview-ui/components/u-icon/u-icon';
import lffBarrage from '@/components/lff-barrage/lff-barrage.vue';
import model13 from '@/components/modal13.vue';
import model11 from '@/components/modal11.vue';
import model12 from '@/components/modal12.vue';
import model16 from '@/components/model16.vue';
import model15 from '@/components/model15.vue';
import model18 from '@/components/model18.vue';
import shareMixin from '@/common/shareMixin.js';
export default {
	components: {
		chackstand,
		uIcon,
		myMask,
		model13,
		model15,
		model11,
		model12,
		lffBarrage,
		share,
		model16,
		model18
	},
	mixins: [shareMixin],
	// onShareAppMessage(res) {
	// 	console.log(res);
	// 		const ref = this.$refs.share
	// 		return {
	// 			title: ref.share.title,
	// 			path: ref._page,
	// 			imageUrl: ref.share.imageUrl
	// 		}

	// 	},

	data() {
		return {
			state: 0,
			fn: null,
			pay_type: '',
			showMask: false,
			total_num: 0,
			total_goods: [],
			stop: false,
			total_page: 1,
			ii: false,
			model15: false,
			content: '',
			model3: false,
			timer: null,
			page: '',
			curPage: 1,
			curSwpier: 1,
			model2: false,
			model1: false,
			showShare: false,
			iscard: false,
			model18:false,
			// 付款中
			loading: true,
			// 付款弹框
			model: false,
			blindInfo: {},
			imgsList: [],
			swiperList: [],
			btn: [
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
			// 是否已售完
			iscomplete: false,
			// 支付方式
			type: '',
			//背面的图片
			arr: [],
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
			current: 0,
			goodCurrent: 0,
			top: 0,
			background: {
				backgroundColor: 'transparent'
			},
			id: '',
			blind_goods_id: '',
			coupon_user_id: '',
			coupon_price: 0,
			num: 0,
			jifen_id: 0,
			barrageHeight: 100,
			danmu: []
		};
	},
	onUnload() {
		uni.$off('coupon');
	},
	onHide() {
		this.$refs.lffBarrage && this.$refs.lffBarrage.clearList();
		clearInterval(this.timer);
	},
	onShow() {
		this.getdanmu();
	},
	methods: {
		change1(e) {
			this.curSwpier = e.detail.current;
		},
		change(e) {
			this.goodCurrent = e.detail.current;
		},
		showDetailed() {
			const info = this.imgsList[this.goodCurrent];
			if (info.content_info) {
				this.content = info.content_info;
				this.model15 = true;
			}
		},
		itemClick(item) {
			if (item.content_info) {
				this.$nextTick(() => {
					this.content = item.content_info;
					this.model15 = true;
				});
			}
		},
		async getdanmu() {
			try {
				let data;
				if (this.danmu.length > 0) {
					data = this.danmu;
				} else {
					const res = await this.$store.dispatch('blind_blindRewardRecord', {
						blind_goods_id: this.id,
						is_scoller: 1
					});
					data = res.data;
				}

				const len = data.length - 1;
				if (len <= -1) return;
				let a = 0;
				const add = () => {
					if (a > len) {
						a = 0;
					}
					console.log('第' + (a + 1) + '条弹幕');
					const item = data[a];
					if (!item.reward_goods_info) return;
					const obj = {
						// 1:普通 2：高级赏
						levelName: item.reward_name_info ? item.reward_name_info.reward_name : '最终赏',
						name: item.user_info ? item.user_info.nickname : '',
						img: item.user_info ? item.user_info.avatar : '',
						title: item.reward_goods_info ? item.reward_goods_info.reward_name : ''
					};
					this.$refs.lffBarrage && this.$refs.lffBarrage.add(obj);
					a += 1;
				};
				add();
				this.timer = setInterval(() => add(), 4000);
			} catch (e) {
				//TODO handle the exception
				console.log(e);
			}
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
		goOpen(type, data, index) {
			//判断开关
			
			if(this.$cache('anima') == 1)this.showMask = true;
			else{
				this.iscard = false;
				this.shareUrl();
				this.$authRoute({
					url: '/pages/good/one',
					params: {
						type,
						...data
					}
				});
				return 
			}
			setTimeout(() => {
				this.showMask = false;
				this.iscard = false;
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
		async iconClick(index, item) {
			if (this.iscard) return this.$u.toast('支付中，请稍后操作');
			// 收藏
			if (!this.$auth()) return;
			if (index == 0) {
				try {
					const obj = {
						blind_goods_id: this.id,
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
		async rightClick() {
			if (this.stop) return;
			this.stop = true;
			if (this.goodCurrent + 1 > this.imgsList.length - 1) {
				this.curPage = this.curPage + 1 > this.total_page ? 1 : this.curPage + 1;
				await this.getList();
				this.goodCurrent = 0;
			} else {
				this.goodCurrent += 1;
			}
			await sleep(500);
			this.stop = false;
		},
		async arrowClick(num) {
			if (this.stop) return;
			this.stop = true;
			const index = this.curPage + num;
			console.log(index);
			if (index > this.total_page) {
				this.curPage = 1;
			} else if (index <= 0) {
				this.curPage = this.total_page;
			} else {
				this.curPage = index;
			}
			await this.getList();

			if (num > 0) {
				this.goodCurrent = 0;
			} else {
				this.goodCurrent = this.imgsList.length - 1;
				console.log(this.goodCurrent);
			}
			await sleep(500);
			this.stop = false;
		},
		async leftClick() {
			if (this.stop) return;
			this.stop = true;
			if (this.goodCurrent - 1 < 0) {
				console.log(this.curPage);
				this.curPage = this.curPage - 1 <= 0 ? this.total_page : this.curPage - 1;
				await this.getList();

				this.goodCurrent = this.imgsList.length - 1;
			} else {
				this.goodCurrent -= 1;
			}
			await sleep(500);
			this.stop = false;
		},
		goPay(item) {
			this.shareUrl();
			if (this.iscard) return this.$u.toast('支付中，请稍后');
			this.coupon_user_id = 0;
			this.coupon_price = 0;
			this.model = true;
			this.num = item.num;
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
		async getList() {
			try {
				const { data } = await this.$store.dispatch('blind_selectRewardList', {
					page: this.curPage,
					id: this.jifen_id ? this.jifen_id : this.id, //商品ID
					type: this.type === 'integral' ? 3 : 1
				});
				this.imgsList = data.list;
				this.total_page = data.total_page;
				this.total_num = data.total_count;
			} catch (e) {
				console.log(e, 1111);
			}
		},
		pay() {
			const obj = {
				id: this.id,
				type: this.jifen_id ? 3 : 1,
				pay_type: this.type,
				num: this.num
			};
			if (this.coupon_user_id) {
				obj.coupon_user_id = this.coupon_user_id;
			}
			this.iscard = true;
			this.run = true;
			this.$store
				.dispatch('blind_buyBlindGoods', obj)
				.then(({ data }) => {
					this.pay_type = data.pay_type;
					return this.$refs.chackstand.init({
						order_id: data.order_id,
						trade_type: data.pay_type,
						order_type: 'blindOrder'
					});
				})
				.catch(err => {
					this.iscard = false;
					if (err.code === 60001) {
						return uni.showModal({
							title: '提示',
							content: '现只需要' + err.data.num + '发即可全收，是否继续支付？',
							success: res => {
								if (res.confirm) {
									this.num = err.data.num;
									this.pay();
								}
							}
						});
					}
					this.$u.toast(err.msg || '支付失败');
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
		sureAuth(params) {
			console.log(params);
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
		async getBlindGoodsInfo() {
			//无限盲盒
			this.loading = true;
			this.page = this.$getUrl();
			this.getList();
			this.$store
				.dispatch('blind_selectRewardHeaders', {
					id: this.id,
					type: this.type === 'integral' ? 3 : 1
				})
				.then(({ data }) => {
					this.total_goods = data.header;
				})
				.catch(err => {
					this.loading = false;
					this.$u.toast(err.msg || '获取信息失败');
				});
			try {
				const res = await this.$store.dispatch('blind_getBlindInfo', {
					id: this.jifen_id ? this.jifen_id : this.id, //商品ID
					type: this.type === 'integral' ? 3 : 1
				});

				this.blindInfo = res.data.info;
				this.icons[0].state = this.blindInfo.is_collect == 1;
				this.btn = this.btn.map(item => {
					item.price = item.num * this.blindInfo.price;
					item.price1 = item.num * this.blindInfo.market_price;
					item.state = this.blindInfo.reward_goods_num - this.blindInfo.box_info.winning_num >= item.num;
					return item;
				});
				this.loading = false;
				this.$nextTick(() => {
					console.log(this.$refs);
					this.top = this.$refs.nav.navHeight;
					this.barrageHeight = 288 - uni.pxtorpx(this.top);
				});
			} catch (e) {
				this.$toast(e.msg || '参数错误1111'); //TODO handle the exception
			}
		},
		submit() {
			this.model = false;
			this.loading = true;
			this.$t(
				'支付中',
				() => {
					console.log('支付完成');
					this.loading = false;
				},
				3000
			);
		}
	},
	onLoad(p) {
		uni.$on('coupon', e => {
			this.coupon_user_id = e.coupon_user_id;
			this.coupon_price = e.price;
			this.num = e.num;
			this.model = true;
		});
		this.id = p.id;
		this.type = p.type || 'coins';
		this.jifen_id = p.jifen_id || 0;
		this.blind_goods_id = p.blind_goods_id;
	},
	async onReady() {
		await this.getBlindGoodsInfo();
		//如果显示弹幕
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
		text() {
			if (this.imgsList.length == 0 || !this.imgsList[this.goodCurrent]) return '';
			return this.imgsList[this.goodCurrent].reward_name;
		}
	}
};
</script>
<style lang="scss">
.goods-h {
	display: flex;
	width: 426rpx;
	height: 36rpx;
	left: 50%;
	top: 0;
	position: absolute;
	z-index: 999;
	transform: translateX(-50%);
	background: rgba(0, 0, 0, 0.3);
	font-size: 18rpx;
	font-family: PingFangSC;
	font-weight: 400;
	color: #ffffff;
	justify-content: space-between;
	align-items: center;
	padding: 0 20rpx;
}

.page-box {
	height: 200rpx;
	display: flex;
	width: 750rpx;

	.page-l {
		width: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		flex-shrink: 0;
	}

	.page-r {
		width: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		flex-shrink: 0;
	}

	.page {
		flex: 1;
		justify-content: space-between;

		.item {
			flex-shrink: 0;
			background-size: 100%;
			border-radius: 10rpx;
			border: 4rpx solid #ffe230;
			position: relative;
			//overflow: hidden;
		}

		.on {
			&:after {
				content: '';
				position: absolute;
				background-image: url('https://manghe.jikechaowan.com/image/img-12.png');
				background-size: 100% 100%;
				top: -12rpx;
				right: -12rpx;
				bottom: -12rpx;
				left: -12rpx;
			}
		}

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
	}
}

page {
	// background-image: url("https://manghe.jikechaowan.com/image/img-1.png");
	background-image: url('https://smiaoshen.oss-cn-hangzhou.aliyuncs.com/image/bgccc.png');
	background-size: 100%;
	background-repeat: no-repeat;
	background-color: #1e216b !important;
	min-height: 100vh;
	//background-position-y: -100rpx;
	/* padding-bottom: 40rpx; */
}
</style>
<style lang="scss" scoped>
.img-box {
	height: 100%;
	width: 100%;
	margin-top: 30rpx;
}

.shuaxing {
	position: absolute;
	z-index: 9;
	left: 25rpx;
	top: 1000rpx;
}

@keyframes rotat {
	from {
		transform: rotateY(0deg);
	}

	to {
		transform: rotateY(360deg);
	}
}

.run {
	animation: rotat 2.5s linear 0s infinite;
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

	.btn-item {
		background-size: 100% 100%;

		width: 200rpx;
		height: 90rpx;
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
				margin-left: 5rpx;
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
	height: 200rpx;
	// background-color: #1e216b !important;
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

	&:after {
		content: '';
		position: absolute;
		bottom: -10rpx;
		left: 0;
		width: 100%;
		height: 91rpx;
		// background: linear-gradient(0deg, #1e2372 0%, rgba(26, 24, 76, 0.2) 100%);
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

	.allbtn {
		:active {
			transform: scale(0.95);
			opacity: 0.5;
		}
	}

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

	//&:after {
	//  content: "";
	//  position: absolute;
	//  width: 699rpx;
	//  height: 2rpx;
	//  background: #FFFFFF;
	//  opacity: 0.1;
	//  bottom: 0;
	//  left: 50%;
	//  transform: translateX(-50%);
	//}
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

.good {
	.tip-top {
		z-index: 999;
		position: absolute;
		left: 0;
		right: 0;
		top: 0rpx;
		height: 40rpx;
		background: rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 15px;
		font-size: 18rpx;
		font-family: PingFangSC;
		font-weight: 400;
		color: #ffffff;
		display: none;
	}

	.tip-bottom {
		z-index: 999;
		position: absolute;
		padding: 0 19rpx 0 30rpx;
		line-height: 48rpx;
		text-align: center;
		right: 0;
		bottom: 0rpx;
		height: 48rpx;
		background: rgba(255, 255, 255, 0.1);
		background: linear-gradient(125deg, transparent 30rpx, rgba(255, 255, 255, 0.1) 0);
		color: #ffffff;
		font-size: 33rpx;
		font-family: HelveticaNeue;
		font-weight: normal;
		color: #ffffff;
	}

	margin-top: 18rpx;
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
		// &:after {
		//   content: "";
		//   position: absolute;
		//   left: -12rpx;
		//   right: -12rpx;
		//   bottom: -12rpx;
		//   top: -12rpx;
		//   // background-image: url('~@/static/faguang.png');
		//   background-size: 100%;
		// }

		position: absolute;
		//border: 6rpx solid;
		//border-image-source: url('~@/static/faguang.png');
		//border-image-width: 16rpx;
		//border-image-slice: 20;
		box-sizing: content-box;
		// background-image: url('https://manghe.jikechaowan.com/image/tmtp.png');
		background-size: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0;
		margin: 0 auto;
		width: 426rpx;
		height: 426rpx;
		//box-shadow: 0 0 20rpx #fff;
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
	position: relative;
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
		background-image: url('https://manghe.jikechaowan.com/image/btl.png');
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
				// flex:1;
				text-align: center;
				flex-shrink: 0;
				min-width: 335rpx;
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
