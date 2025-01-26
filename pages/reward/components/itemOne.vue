<template>
	<view class="">
		<view class="top">
			<view class="subsection">
				<u-subsection v-if='index===0' :bold='false' :current="current" :list="list" font-size='24rpx'
					height='64' @change="sectionChange"></u-subsection>
			</view>
			<view class="btns">
				<block v-if='isEdit'>
					<view class="btn t1" @click="checkAll">
						{{ isAll ? '反选' : '全选' }}
					</view>
					<view class="btn" @click="isEdit= !isEdit">
						取消
					</view>
				</block>
				<block v-else>
					<view class="btn t1" @click="isEdit= !isEdit;$refs.uDropdown.close()">
						管理
					</view>
				</block>

			</view>
		</view>
<!-- 		<view class="box">
			<view class="title">
				<view class="title-left">
					奖品共{{ goods_num[current] }}个
				</view>
				<view class="title-right">
					<u-icon label='排序' label-size='28rpx' margin-left='8rpx'
						name='https://manghe.jikechaowan.com/image/img_1.png' size='30rpx'></u-icon>
					<u-icon label='规则' @click='showModal17=true' label-size='28rpx' margin-left='8rpx'
						name='question-circle' size='30rpx'>
					</u-icon>
				</view>
			</view>
		</view> -->
		<my-dropdown ref='uDropdown' :num='goods_num[current]' @itemClick='meumClick'>
			<my-dropdown-item v-model="value1" :options="options1"></my-dropdown-item>
		</my-dropdown>	
		<mescroll-uni ref="mescrollRef" :up="upOption" top="300rpx" @down="downCallback" @emptyclick="emptyClick"
			@init="mescrollInit" @up="upCallback">
			<view class="goods-box">
				<view v-for="(item,index) in goods" v-if='current==1' class="goods1">
					<view class="image" @click="imgClick(item)">
						<u-image :src='item.img' border-radius="16rpx" height="335rpx" width="335rpx">
						</u-image>
						<view v-if='item.seller_type===0' class="tip">
							预售
						</view>
						<!-- #ifdef MP -->
						<u-image v-if='item.status=== 30' class="img" height="72rpx"
							src='https://manghe.jikechaowan.com/image/img_16.png' width="72rpx"
							@tap.stop="unLock(item)"></u-image>
							<!-- #endif -->
							<!-- #ifndef MP-->
							<view @click.stop="unLock(item)" class="img">
								<u-image v-if='item.status=== 30'  height="72rpx"
									src='https://manghe.jikechaowan.com/image/img_16.png' width="72rpx"
									></u-image>
							</view>
							
								<!-- #endif -->
					</view>

					<view class="name u-line-1">
						{{ item.reward_name }}
					</view>
					<view class="price">
						<view class="price-left">
							<view class="u-font-22 u-type-info u-p-r-10">参考价</view>
							<u-icon name='https://manghe.jikechaowan.com/image/img_11.png' size="26rpx">
							</u-icon>
							<view class="text">
								{{ money(item.rececle_price) }}
							</view>
						</view>

						<view class="price-right">
							数量
							<text>X{{ item.goods_num }}</text>
						</view>
					</view>
					<view v-if='isEdit && item.status !== 30' class="model">
						<view :class='{on:item.checked}' class="checkbox" @click="checkClick(index)">
							<u-icon v-if='item.checked && item.status !== 30' color="#000" name="checkbox-mark"
								size="30rpx"></u-icon>
						</view>
					</view>
				</view>
				<view v-if='current===1&&goods.length%2!==0'></view>
				<view v-for="(item,index) in goods" v-if='current==0' class="goods2">
					<view v-if='isEdit && item.status !== 30' class="model">
						<view :class='{on:item.checked}' class="checkbox" @click="checkClick(index)">
							<u-icon v-if='item.checked && item.status !== 30' color="#000" name="checkbox-mark"
								size="30rpx"></u-icon>
						</view>
					</view>
					<view class="image" @click="imgClick(item)">
						<u-image :src='item.img' border-radius="16rpx" height="218rpx" width="218rpx">
						</u-image>
						<view v-if='item.seller_type === 0' class="tip">
							预售
						</view>
						<!-- #ifdef MP -->
						<u-image v-if='item.status === 30' class="img" height="60rpx"
							src='https://manghe.jikechaowan.com/image/img_16.png' width="60rpx"
							@tap.stop="unLock(item)"></u-image>
							<!-- #endif -->
							<!-- #ifndef MP -->
							<view @click.stop="unLock(item)" class="img">
								<u-image v-if='item.status === 30'  height="60rpx"
									src='https://manghe.jikechaowan.com/image/img_16.png' width="60rpx"
									@click="e=>unLock(item,$event)"></u-image>
							</view>
							
								<!-- #endif -->
					</view>

					<view class="name1 u-line-1">
						{{ item.reward_name }}
					</view>
					<view class="price1">
						<view class="u-font-22 u-type-info u-p-r-10">
							参考价
						</view>

						<view class="price-right1">
							<u-icon name='https://manghe.jikechaowan.com/image/img_11.png' size="26rpx">
							</u-icon>
							<view class="text">
								{{ money(item.rececle_price) }}
							</view>
						</view>
					</view>
				</view>
				<view v-if='current===0&&goods.length%2!==0'>
				</view>
				<view v-for='item in supplement' style='width: 218rpx;'></view>

			</view>
		</mescroll-uni>
		<view v-if='isEdit' class="fixed">
			<view class="btn t1" @click="goLock">锁定</view>
			<view class="btn t1" @click="goGive" >赠送</view>
			<view class="btn t2" @click="goDelivery">发货</view>
			<view class="btn t3" @click="goResolve">分解</view>
		</view>
		<u-modal v-model="show" :content="content" :show-cancel-button="true" :title="title" @confirm="sureDo">
		</u-modal>
		<modal6 v-model="showUnlock" @submit="doUnlock" />
		<modal7 v-model="giveShow" @submit="doGive" />
		<modal5 ref="modal5" v-model="resovelShow" @submit="doResolve" />
		<modal17 uid='8' v-model='showModal17'></modal17>
		<share ref='share' v-if="shareInfo" v-model='showShare' :goodInfo="shareInfo" :page='page' />
		<model15 v-model="model15" :content='content2'></model15>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import modal6 from "@/components/modal6"
	import modal7 from "@/components/modal7"
	import modal5 from "@/components/modal5"
	import modal17 from "@/components/model17"
	import model15 from '@/components/model15.vue'
	import myDropdown from '@/components/my-dropdown/u-dropdown.vue'
	import myDropdownItem from '@/components/my-dropdown-item/my-dropdown-item.vue'
	import {
		apiGoods
	} from "@/common/mock.js"
	import share from "@/components/share"

	export default {
		components: {
			modal6,
			myDropdownItem,
			modal7,
			modal5,
			share,
			modal17,
			model15,
			myDropdown
		},
		mixins: [MescrollMixin], // 使用mixin
		inject: ['changeEdit'],
		props: ['index'],
		data() {
			return {
				isShowShare:true,
				value1: 0,
				options1: [{
						label: '默认',
						value: 0,
					},
					{
						label: '按参考价从高到底',
						value: 2,
					},
					{
						label: '按参考价从低到高',
						value: 1,
					},
					{
						label: '按获得时间升序',
						value: 4,
					},
					{
						label: '按获得时间降序',
						value: 3,
					}
				],
				options2: [{
						label: '去冰',
						value: 1,
					},
					{
						label: '加冰',
						value: 2,
					},
				],
				content2: '',
				model15: false,
				goods_num: [0, 0],
				showModal17: false,
				order_id: '',
				showShare: false,
				resovelShow: false,
				giveShow: false,
				showUnlock: false,
				content: '',
				title: '',
				show: false,
				isEdit: false,
				top: 0,
				flag: false,
				upOption: {
					// page: {
					// 	size: 10 // 每页数据的数量
					// },
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						tip: '~ 暂无数据 ~', // 提示
						// btnText: '去看看'
					}
				},
				share: [],
				goods: [], //列表数据
				list: [{
						name: '展开'
					},
					{
						name: '折叠'
					}
				],
				current: 0,
				isAll: false,
				current_lock_goods: 0,
				action: '' //lock
			}
		},
		mounted() {
			uni.$on('listChange', () => {
				this.isEdit = false
				this.mescroll.resetUpScroll()
			})
			this.$nextTick(function() {
				this.$u.getRect('.box').then(res => {
					console.log(res, 'top');
					this.top = res.bottom + 'px'
					console.log('top', this.top);
				}).catch((err) => {
					console.log(err);
				})
			})
		},
		destroyed() {
			uni.$off('listChange')
		},
		watch: {
			current() {
				this.close()
			},
			value1(){
			this.mescroll.triggerDownScroll()
			},
			'goods.length':{
				handler(value){
					if(value===0){
					this.mescroll.showEmpty()	
					}else{
						this.mescroll.removeEmpty()
					}
					
				}
			},
		},
		methods: {
			close(){
				this.isEdit = false
				this.$refs.uDropdown.close()
			},
			meumClick(index){
				this.isEdit = false
				if(index==2){
					this.showModal17=true
				}else if(index==1){
					this.$refs.uDropdown.menuClick(0)
				}
			},
			imgClick(item) {
				if (this.isEdit) return
				if (item.content_info) {
					this.content2 = item.content_info
					this.model15 = true
				}
			},
			checkClick(index) {
				this.goods[index].checked = !this.goods[index].checked
			},
			doResolve() {
				let ids = this.goods.reduce((result, item, index) => {
					if (item.checked) {
						if (this.current) result.push(item.blind_reward_goods_id)
						else result.push(item.id)
					}
					return result
				}, [])

				this.$store.dispatch('order_resoleGoods', {
					show: this.current,
					ids: JSON.stringify(ids)
				}).then((res) => {
					this.$t(res.msg, () => {
						this.goods = this.goods.filter((item) => {
							if (this.current === 0 && ids.indexOf(item.id) > -1) return false
							if (this.current === 1 && ids.indexOf(item.blind_reward_goods_id) > -1)
								return false
							return true
						})
						this.goods_num[this.current] = this.goods.length
						this.resovelShow = false
						this.isEdit=false
						this.isAll=false
						this.mescroll.triggerDownScroll()
						uni.$emit('resChange')
					})
				}).catch((res) => {
					this.$toast(res.msg)
				})
			},
			goDelivery() {
				let ids = this.goods.reduce((result, item, index) => {
					if (item.checked) {
						if (this.current) result.push(item.blind_reward_goods_id)
						else result.push(item.id)
					}
					return result
				}, [])
				let flag = this.goods.every(item => {
					if (item.checked && item.seller_type == 0) {
						return false
					} else {
						return true
					}
				})
				if (!flag) return this.$toast('选择的奖品中有是“预售”状态的奖品无法发货。请您重新进择')
				if (!ids.length) return this.$toast('请选择要发货的商品!')
				this.$authRoute({
					url: '/pages/user/delivery',
					params: {
						ids: JSON.stringify(ids),
						show: this.current,
					}
				})
			},
			goResolve() { //奖品分解
				let ids = this.goods.reduce((result, item, index) => {
					if (item.checked) {
						if (this.current) result.push(item.blind_reward_goods_id)
						else result.push(item.id)
					}
					return result
				}, [])
				if (!ids.length) return this.$toast('请选择要分解的商品!')
				let num = this.goods.filter((item) => item.checked).reduce((result, item) => {
					return result + (item.goods_num * parseFloat(item.resolve_total_num))
				}, 0)
				this.$refs.modal5.num1 = num
				this.resovelShow = true
			},
			doUnlock() {
				//合并状态传 商品ID 和数量，否则传 订单ID
				let id = this.current ? this.current_lock_goods.blind_reward_goods_id : this.current_lock_goods.id
				this.$store.dispatch('order_unlockGoods', {
					ids: JSON.stringify([id]),
					show: this.current,
				}).then((res) => {
					let lock_goods = this.goods.find((item) => {
						if (this.current === 0) return item.id === this.current_lock_goods.id
						return item.blind_reward_goods_id === this.current_lock_goods.blind_reward_goods_id
					})
					lock_goods.status = 0;
					this.$t(res.msg, () => {
						this.showUnlock = false
					})
				}).catch((res) => {
					this.$toast(res.msg)
				})
			},
			doGive() {
				//发起赠送
				//展开状态传order_id 否则传商品ID
				let ids = this.goods.reduce((result, item, index) => {
					if (item.checked) {
						if (this.current) result.push(item.blind_reward_goods_id)
						else result.push(item.id)
					}
					return result
				}, [])
				if (!ids.length) return this.$toast('请选择要操作的奖品!')
				this.$store.dispatch('order_giveGoods', {
					show: this.current,
					ids: JSON.stringify(ids),
				}).then((res) => {
					this.giveShow = false
					this.order_id = res.data.order_id
					this.share = this.goods.filter((item) => {
						if (this.current === 0 && ids.indexOf(item.id) > -1 && item.status === 0)
							return true;
						if (this.current === 1 && ids.indexOf(item.blind_reward_goods_id) > -1 && item
							.status === 0) return true;
						return false
					})
					this.showShare = true
					this.$t(res.msg, () => {
						this.goods_num[this.current] = this.goods.length
						console.log(this.goods_num);
						this.goods = this.goods.filter((item) => {
							if (this.current === 0 && ids.indexOf(item.id) > -1 && item.status ===
								0) return false;
							if (this.current === 1 && ids.indexOf(item.blind_reward_goods_id) > -
								1 && item.status === 0) return false;
							return true
						})
					})
					this.isEdit=false
					this.isAll=false
					this.mescroll.triggerDownScroll()
					uni.$emit('shareChange')
				}).catch((res) => {
					console.log(res);
					this.$toast(res.msg)
				})
			},
			sureDo() {
				//展开状态传order_id 否则传商品ID
				let ids = this.goods.reduce((result, item, index) => {
					if (item.checked) {
						if (this.current) result.push(item.blind_reward_goods_id)
						else result.push(item.id)
					}
					return result
				}, [])
				if (!ids.length) return this.$toast('请选择要操作的奖品!')
				this.$store.dispatch('order_lockGoods', {
					show: this.current,
					ids: JSON.stringify(ids),
				}).then((res) => {
					this.$t(res.msg, () => {
						this.goods.map((item) => {
							if (this.current === 0 && ids.indexOf(item.id) > -1) item.status = 30;
							if (this.current === 1 && ids.indexOf(item.blind_reward_goods_id) > -1)
								item.status = 30;
						})
					})

				}).catch((res) => {
					this.$toast(res.msg)
				})
			},
			checkAll() {
				this.goods.map((item) => {
					if (item.status !== 30) item.checked = !this.isAll
					return item
				})
				this.isAll = !this.isAll
			},
			goLock() {
				let flag = this.goods.find((item) => {
					return item.checked
				})
				if (!flag) return this.$toast('请选择您要锁定的商品!')
				this.title = '锁定奖品';
				this.content = '锁定奖品后将无法做其他操作，确定锁定吗？';
				this.show = true
				this.action = 'lock'
			},
			goGive() {
				console.log(this.isShowShare);
				if(!this.isShowShare) return
				let flag = this.goods.find((item) => {
					return item.checked
				})
				if (!flag) return this.$toast('请选择您要赠送的商品!')
				this.action = 'give'
				this.giveShow = true
			},
			edit() {
				this.changeEdit()
			},
			sectionChange(index) {
				this.current = index;
				this.upCallback({
					num: 1
				})
			},
			upCallback(page) {
				
				this.$store.dispatch('order_getOrderList', {
					page: page.num,
					show: this.current,
					sort:this.value1
				}).then(res => {
					this.isShowShare=!!res.data.lock_give_status
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					res.data.list = res.data.list.map((item) => {
						item.checked = false
						return item
					})
					// this.goods_num[this.current]=res.data.goods_num
					this.goods_num.splice(this.current, 1, res.data.goods_num)
					if (this.current === 1) {
						this.mescroll.endSuccess(res.data.list.length, false);
					} else {
						this.mescroll.endSuccess(res.data.list.length);
					}
					//设置列表数据
					if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					this.goods = this.goods.concat(res.data.list); //追加新数据
				}).catch((err) => {
					console.log(err);
					//联网失败, 结束加载
					console.log(err);
					this.mescroll.endErr();
				})
			},
			//点击空布局按钮的回调
			emptyClick() {
				uni.showToast({
					title: '点击了按钮,具体逻辑自行实现'
				})
			},
			unLock(goods,e) {
				this.current_lock_goods = goods
				this.showUnlock = true
			}
		},
		computed: {
			supplement() {
				if (this.goods.length % 3 === 0 || this.current === 1) return 0
				let num = parseInt(this.goods.length / 3)
				return ((num + 1) * 3) - this.goods.length
			},
			shareInfo() {
				if (this.share.length == 0) return false
				return {
					share_info: '你的好友送你' + this.share.length + '个礼物\n快去看看吧',
					img1: this.share[0].img,
				}
			},
			page() {
				if (this.order_id.length == 0) return false
				return `/pages/good/receive?order_id=${this.order_id}`
			}
		},

	}
</script>

<style>
	.fixed {
		bottom: var(--window-bottom)
	}
</style>
<style lang="scss" scoped>
	.fixed {
		position: fixed;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		padding: 30rpx 16rpx;
		align-items: center;
		height: 100rpx;
		padding-bottom: 30rpx;
		z-index: 9999;
		background-color: #f8f8f8;
		gap: 0 20rpx;
		.btn {
			flex:1;
			height: 80rpx;
			border-radius: 16rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
		}

		.t1 {
			background-color: #eeeeee;
		}

		.t2 {
			background-color: #333;
			color: #fff;
		}

		.t3 {
			background-color: #eb555b;
			color: #fff;
		}
	}

	.model {
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 2;
		top: 0;
		right: 0;
		background: #000000;
		opacity: 0.5;
		display: flex;
		align-items: center;
		justify-content: center;

		.checkbox {
			width: 46rpx;
			height: 46rpx;
			border: 4rpx solid #FFFFFF;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.on {
			background-color: #fff;
		}
	}

	.image {
		position: relative;

		.img {
			position: absolute;
			opacity: .3;
			left: 0;
			top: 0;
		}

		.tip {
			width: 56rpx;
			height: 32rpx;
			background: #EB555B;
			border-radius: 4rpx;
			display: flex;
			line-height: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 20rpx;
			color: #fff;
			position: absolute;
			right: 8rpx;
			bottom: 8rpx;
		}
	}

	.top {
		padding: 40rpx 16rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.subsection {
			width: 296rpx;
		}

		.btns {
			display: flex;
			align-items: center;

			.btn {
				width: 104rpx;
				height: 60rpx;
				background: #EEEEEE;
				border-radius: 30rpx;
				font-size: 24rpx;
				font-family: PingFangSC;
				font-weight: 500;
				color: #333333;
				text-align: center;
				line-height: 60rpx;
				margin-left: 20rpx;
			}

			.t1 {
				background-color: #323232;
				color: #fff;
			}

		}
	}

	.box {
		margin: 0 16rpx;
		margin-top: 26rpx;
		background-color: #fff;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;

		.title {
			padding: 24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title-left {
				font-size: 24rpx;
				font-family: PingFangSC;
				font-weight: 500;
				color: #B8B8BA;
			}

			.title-right {
				width: 220rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}
	}

	.goods-box {
		background-color: #fff;
		margin: 0 16rpx;
		// min-height: 100rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 0 16rpx;

		.goods1 {
			position: relative;

			overflow: hidden;
			border-radius: 16rpx;
			padding-bottom: 20rpx;
			margin-bottom: 40rpx;
			width: 335rpx;

			.name {
				line-height: 1;
				margin-top: 20rpx;
				margin-bottom: 20rpx;
				padding: 0 10rpx;
			}

			.price {
				display: flex;
				align-items: flex-end;
				padding: 0 10rpx;
				justify-content: space-between;

				.price-left {
					display: flex;
					align-items: flex-end;

					.text {
						font-weight: 600;
						line-height: 1;
						padding-left: 9rpx;
					}
				}

				.price-right {
					line-height: 1;
					font-size: 22rpx;

					text {
						font-size: 20rpx;
						padding-left: 10rpx;
					}
				}
			}
		}
	}

	.goods2 {
		overflow: hidden;
		border-radius: 16rpx;
		padding-bottom: 20rpx;
		margin-bottom: 40rpx;
		width: 218rpx;
		position: relative;
		background-color: #fefefe;

		.model {
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 2;
			top: 0;
			right: 0;
			background: #000000;
			opacity: 0.5;
		}

		.name1 {
			line-height: 1;
			margin-top: 20rpx;
			padding: 0 10rpx;
			font-size: 24rpx;
		}

		.price1 {
			display: flex;
			padding: 0 10rpx;
			justify-content: space-between;
			align-items: flex-end;
			margin-top: 20rpx;
		}

		.price-right1 {
			display: flex;
			align-items: flex-end;

			.text {
				font-weight: 600;
				line-height: 1;
				padding-left: 9rpx;
			}
		}
	}
</style>
