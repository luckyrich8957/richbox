<template>
	<mescroll-uni v-if="i === index" ref="mescrollRef" @init="mescrollInit" :top="height" @down="downCallback" :up="upOption" @up="upCallback">
		<view class="box">
			<view class="list u-border-bottom" v-for="item in goods">
				<view class="left">
					<view class="name">{{ item.title }}</view>
					<view class="time">{{ item.create_time }}</view>
				</view>
				<view class="right">{{ item.pm ? '+' : '-' }}{{ item.total_num }}</view>
			</view>
			<view class="empty" v-if="!goods.length">
				<u-image width="144rpx" height="116rpx" src="https://manghe.jikechaowan.com/image/img_21.png"></u-image>
				<text class="t">{{ i == 1 ? '暂无记录' : '暂无明细' }}</text>
			</view>
		</view>
	</mescroll-uni>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { apiGoods } from '@/common/mock.js';

export default {
	mixins: [MescrollMixin],
	data() {
		return {
			empty: true,
			upOption: {
				noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
				empty: {
					use: false,
					tip: '~ 暂无无数据 ~' // 提示
				}
			},
			goods: []
		};
	},
	props: ['i', 'index', 'height', 'type'],
	methods: {
		upCallback(page) {
			//联网加载数据// 具体项目中,您可能取的是tab中的type,status等字段
			let bill_type = 'coins';
			if (this.type === 1) bill_type = 'balance';
			let params = { bill_type: bill_type, page: page.num, pm: this.i === 1 ? 1 : 0 };
			this.$store
				.dispatch('bill_getCapitalRecordList', params)
				.then(res => {
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(res.data.list.length);
					//设置列表数据
					if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					this.goods = this.goods.concat(res.data.list); //追加新数据
					if (this.goods.length == 0) {
						this.empty = true;
					} else {
						this.empty = false;
					}
				})
				.catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.empty {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: 185rpx;

	.t {
		font-size: 24rpx;
		font-family: PingFangSC;
		font-weight: 300;
		color: #b8b8ba;
		line-height: 1;
		display: block;
		margin-top: 25rpx;
		text-align: center;
	}
}

.box {
	position: relative;
	padding: 16rpx 0 0 56rpx;

	.list {
		height: 110rpx;
		display: flex;
		justify-content: space-between;

		.left {
			line-height: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;

			.name {
				font-size: 28rpx;
				font-family: PingFangSC;
				font-weight: 400;
				color: #333333;
			}

			.time {
				font-size: 22rpx;
				font-family: PingFangSC;
				font-weight: 400;
				color: #b8b8ba;
			}
		}

		.right {
			align-self: center;
			margin-right: 57rpx;
			font-size: 32rpx;
			font-family: PingFangSC;
			font-weight: 400;
			color: #333333;
		}
	}
}
</style>
