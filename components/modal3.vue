<template>
	<u-popup v-model='_show' :closeable="true" border-radius="40" mode='center' width="600rpx">
		<view class="content">
			<view class="title">
				邀请赚钱规则
			</view>
			<scroll-view scroll-y="true" class="scroll" style="height: 570rpx;">
				<view>
					1. 用户实名制原则为了保证企业服务的效率和
					严肃性，企业用户注册需如实填写个人身份信
					息。
				</view>
				<view>2. 用户信息自我维护原则企业用户信息的注 册、修改、注销，都由企业用户企业服务空间 中自行维护。</view>
				<view>3. 管理员负责制原则每个企业设置一名经企业 授权的企业管理员,负责审核本企业其他用户注 册信息。</view>
				<view>4. 用户帐号验证原则用户手机号码和个人邮箱 地址作为登录帐号是必填信息，为了保证政企 沟通的准备。 </view>
				<view>5. 用户帐号验证原则用户手机号码和个人邮箱 地址作为登录帐号是必填信息，为了保证政企 沟通的准备。</view>
				<view>6. 管理员负责制原则每个企业设置一名经企业 授权的企业管理员,负责审核本企业其他用户注 册信息。</view>
			</scroll-view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		props: ['value'],
		methods: {},
		computed: {
			_show: {
				get() {
					return this.value
				},
				set(val) {
					this.$emit('input', val)
				}
			}
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		height: 780rpx;
		padding: 0 56rpx;
		padding-top: 80rpx;

		.title {
			font-size: 36rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
			line-height: 1;
			text-align: center;
			margin-bottom: 36rpx;
		}
		.scroll{
			font-size: 24rpx;
			font-family: PingFangSC;
			font-weight: 300;
			color: #333333;
			line-height: 30rpx;
			view{
				margin-bottom: 50rpx;
			}
		}
	}
</style>
