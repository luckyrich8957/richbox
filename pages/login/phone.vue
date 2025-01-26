<template>
	<view class="pages">

		<view class="title">
			手机号
		</view>
		<u-field v-model="mobile" label="+86" label-width="60" maxlength='11' placeholder="请填写手机号">
		</u-field>
		<view v-if="isCode" class="title u-m-t-80">
			验证码
		</view>
		<u-field v-if="isCode" v-model="code" label-width="0" maxlength='4' placeholder="请填写验证码">
			<view slot='right' class="code" @click="getCode">{{ codeText }}</view>
		</u-field>

		<u-button :custom-style="customStyle" :hair-line="false" :loading="loading" :plain="true" hover-class="none"
			@click="phoneLogin">登录
		</u-button>
		<view class="radio">
			<u-checkbox v-model="flag" active-color='#333' class="checkbox" shape="circle"></u-checkbox>
			<view class="text u-flex" >
				<view @click="flag=!flag">已阅读并同意</view>
				<view @click="agreementClick" style="color: #333 ;padding-left: 10rpx">用户协议、隐私政策、买家须知</view>
			</view>
			<u-modal v-model="show" :mask-close-able="true" content="我已阅读并同意用户协议、隐私政策、买家须知" @confirm="confirm">
			</u-modal>
			<u-verification-code ref="uCode" @change="codeChange"></u-verification-code>

		</view>
		<!-- #ifdef APP -->
		<view class="msg">
			{{$store.state.appConfig?$store.state.appConfig.sysConfig.app_login_msg:''}}
		</view>
		<!-- #endif -->
		<model14 v-model="showModel" title="用户协议、隐私政策、买家须知" uid="3" @submit="(e)=>flag=e" />
		<slideCode :mobile='mobile' v-if="slideCode_show" @close="slideCode_show = false"
			@success="slideCode_success"></slideCode>
	</view>
</template>

<script>
	// import validation from '@/common/validation.js'
	import model14 from '@/components/modal14.vue'
	import slideCode from '@/components/slideCode.vue'
	export default {
		components: {
			model14,
			slideCode
		},
		data() {
			return {
				slideCode_show: false, //图形验证码是否显示
				slideCode_yanzheng: false, //图形验证码是否验证通过
				session_id:'',
				showModel: false,
				canCode: false,
				loading: false,
				flag: false,
				show: false,
				codeText: '获取验证码',
				mobile: '',
				code: '',
				customStyle: {
					height: '100rpx',
					width: '638rpx',
					border: 'none',
					backgroundColor: '#323232',
					'color': '#ffffff',
					marginTop: '170rpx',
				},
				uniqueId: '',
				isCode: 1
			};
		},
		onLoad(p) {
			if (p.uniqueId) {
				this.uniqueId = p.uniqueId
			}
		},
		
		onHide() {
			this.slideCode_show=false
		},
		methods: {
			slideCode_success: function(x) { //验证通过了
				this.slideCode_yanzheng = true //验证通过
				this.getCode()
			},
			codeChange(text) {
				this.codeText = text;
			},
			checkClick() {
				this.flag = !this.flag
			},
			agreementClick(e) {
				console.log(e);
				this.showModel = true
				//禁止冒泡
			},
			confirm() {
				this.flag = true;
				this.$nextTick(() => {
					this.phoneLogin();
				})
			},
			getCode() {
				if (this.$u.test.mobile(this.mobile) == false) {
					this.$u.toast('请输入正确的手机号');
					return
				}
				if (!this.slideCode_yanzheng) {
					return this.slideCode_show = true
				}
				this.canCode = true;

				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					this.$store.dispatch('user_sendLoginSms', {
						phone: this.mobile
					}).then((res) => {
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
						uni.hideLoading();
					}).catch(err=>{
						this.$u.toast(err.msg)
					})
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			phoneLogin() {
				//验证手机号和验证码

				if (!this.mobile) {
					this.$u.toast('请输入手机号');
					return
				}
				if (!this.code && this.isCode) {
					this.$u.toast('请输入验证码');
					return
				}
				if (this.$u.test.mobile(this.mobile) == false) {
					return this.$u.toast('请输入正确的手机号');
				}
				if (this.$u.test.code(this.code, 4) == false && this.isCode) {
					return this.$u.toast('请输入正确的验证码');
				}
				if (!this.canCode) {
					this.$u.toast('请先获取验证码');
					return
				}
				if (!this.flag) {
					return this.show = true;
				}
				this.loading = true;
				if (this.uniqueId) {
					this.$store.dispatch('user_authRegister', {
						code: this.code,
						uniqueId: this.uniqueId,
						phone: this.mobile,
						isCode: this.isCode,
					}).then((res) => {
						// console.log("res1",res1)
						let {
							data
						} = res
						this.loading = false;
						this.$store.commit('setUserInfo', data.user_info)
						this.$store.commit('setToken', data.token)
						uni.hideLoading()
						this.$t(res.msg, () => {
							this.$util.Backurl()
						})
					}).catch((res) => {
						this.loading = false;
						uni.hideLoading()
						uni.$u.toast(res.msg)
					})
				} else {
					this.$store.dispatch('user_fastLogin', {
						code: this.code,
						phone: this.mobile,
						invite_id: this.$store.state.invite_id
					}).then((res) => {
						// console.log("res1",res1)
						let {
							data
						} = res
						this.loading = false;
						this.$store.commit('setUserInfo', data.user_info)
						this.$store.commit('setToken', data.token)
						uni.hideLoading()
						this.$t(res.msg, () => {
							this.$util.Backurl()
						})
					}).catch((res) => {
						this.loading = false;
						uni.hideLoading()
						uni.$u.toast(res.msg)
					})
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.msg{
		margin-top: 40rpx;
		text-align: center;
		font-size: 24rpx;
		color: #333;
	}
	.pages {
		display: flex;
		flex-direction: column;
		padding: 121rpx 57rpx 0;

		.code {
			font-size: 24rpx;
			color: #EB555B;
		}

		.title {
			margin-bottom: 40rpx;
			font-size: 32rpx;
			font-family: PingFangSC;
			font-weight: 500;
			color: #333333;
		}

		/deep/ .u-field {
			padding-left: 0;
		}
	}

	.radio {
		display: flex;
		align-items: center;
		margin: 0 auto;
		margin-top: 142rpx;

		/deep/ .u-checkbox__label {
			margin-right: 5rpx;
		}

		.checkbox {
			//  缩小
			transform: scale(0.8);
		}

		.text {
			font-size: 22rpx;
			color: #B8B8BA;

		}
	}
</style>
