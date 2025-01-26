<template>
	<view class="wrap">
		<u-popup v-model='_show' :closeable="size.close" :border-radius="size.radius" mode='center' :height='size.height'
			:width="size.with">
			<view class="content">
				<view class="tip">
					* 请手写签名
				</view>
				<view class='input'>
					<Signature ref="sig" @showChange='showChange' v-model="v"></Signature>
				</view>
				<view class="btns">
					<view class="btn" @click="_show = false">
						取消
					</view>
					<view class="btn t1" @click="submit">确认</view>
				</view>
			</view>
		</u-popup>
	</view>

</template>

<script>
	import Signature from '@/components/sin-signature/sin-signature.vue'
	import UImage from "../uview-ui/components/u-image/u-image";

	export default {
		options: {
			styleIsolation: 'shared'
		},
		data() {
			return {
				img: '',
				v: '',
				size : {
					height: 'auto',
					with: '625rpx',
					radius: '40',
					close:true
				}
			};
		},

		components: {
			UImage,
			Signature,
		},
		props: ['value'],
		methods: {
			showChange(val) {
				if (val) {
					this.size = {
						height: '100%',
						with: '100%',
						radius: '0',
						close:false
					}
				} else {
					this.size = {
						height: 'auto',
						with: '625rpx',
						radius: '40',
						close:true
					}
				}
			},
			//  将base64转换成image
			submit() {
				if (!this.v) return this.$u.toast('请写入签名')
				let str;
				this.$store.dispatch('upload_file', {
					file: this.v
				}).then((res) => {
					str = res.data.url
					return res.data.url
				}).then(res => this.$store.dispatch('user_userSign', {
					signImg: res
				})).then((res) => {
					this.$store.commit('setUserInfo', {
						...this.$store.state.userInfo,
						real_auth_step: 2
					})
					this.$emit('submit', str)
					this._show = false
				}).catch(err => {
					this.$u.toast(err.msg || '签名错误')
				})
			}
		},
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
	.wrap {
		/deep/.u-mode-center-box {
			overflow: visible !important;
		}
	}

	.content {
		height: 748rpx;
		padding: 0 56rpx;
		padding-top: 100rpx;

		.tip {
			line-height: 1;
			font-size: 24rpx;
			font-family: PingFangSC;
			font-weight: 300;
			color: #333333;
			margin-bottom: 15rpx;
		}

		.input {
			height: 408rpx;
			background: #F4F4F4;
			border-radius: 12rpx;
		}

		.btns {
			margin-top: 70rpx;
			display: flex;
			justify-content: space-between;

			.btn {
				width: 270rpx;
				height: 90rpx;
				border: 2rpx solid #EEEEEE;
				border-radius: 16rpx;
				font-size: 30rpx;
				font-family: PingFangSC;
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: 400;
				color: #333333;
			}

			.t1 {
				border: none;
				color: #fff;
				background-color: #000;
			}
		}
	}
</style>
