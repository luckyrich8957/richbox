<template>
	<view>
		<view class='cell-box'>
			<u-cell-group :border="false">
				<u-cell-item title="头像" @click="uploadAvatar">
					<u-avatar slot='right-icon' :src='userInfo.avatar' size='mini'></u-avatar>
				</u-cell-item>
				<u-cell-item title="昵称" :value="userInfo.nickname"
					@click="$authRoute({url:'/pages/user/nickname',params:{name:userInfo.nickname}})">

				</u-cell-item>
				<u-cell-item :arrow='false' title="账号ID" @click="copy">
					<view class='right-icon' slot='right-icon'>
						{{ userInfo.account_id }}
						<view class="btn">复制</view>
					</view>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="cell-box b1">
			<text class="u-font-28">拆盲盒动画</text>
			<u-switch v-model="checked" @change="changeAnimall" size='45' class="switch" active-color='#333'></u-switch>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="cell-box b1" @click="show1=true">
			<text class="u-type-error u-font-28" >注销账号</text>
		</view>
		<!-- #endif -->

		<view class="cell-box b1" @click="show=true">
			<text class="u-type-error u-font-28" >退出登录</text>
		</view>
		<u-modal v-model="show" content="是否退出登录？" :show-cancel-button='true' @confirm='logout'></u-modal>
		<u-modal v-model="show1" title="温馨提示" content="确定要注销账号吗？" :show-cancel-button='true' @confirm='zhuXiao'></u-modal>
	</view>
</template>

<script>
	import {
		getChooseImage
	} from "@/common/injection"
	import uniCopy from "@/js_sdk/xb-copy/uni-copy";

	export default {
		data() {
			return {
				show:false,
				show1:false,
				checked: false,
				userInfo: {nickname:''},
				fromData: {
					avatar: ''
				}
			};
		},
		onShow() {
			// 1打开 2关闭
			if(!this.$cache('anima')){
				this.$cache('anima',1)
			}
			this.checked=this.$cache('anima')==1
			this.getUserInfo()
		},
		methods: {
      zhuXiao(){
        this.$store.dispatch('blind_zhuXiao').then((res)=>{
            this.$u.toast(res.msg)
        }).catch(()=>{
          this.$u.toast("您的注销申请已提交，请耐心等待管理员审核!")
        });
      },
			logout() {
				this.$store.commit('unlogin','退出登录')
			},
			copy() {
				let that = this
				uniCopy({
					content: this.userInfo.account_id,
					success() {
						that.$toast('复制成功')
					},
					error() {
						that.$toast('当前客户端不支持复制到剪切板')
					}
				})
			},
			getUserInfo(res) {
				this.$store.dispatch('my_getUserInfo').then((res) => {
					this.userInfo = res.data.user
				})
			},
			uploadAvatar() {
				getChooseImage(['album']).then((res) => {
					this.$loading('上传中')
					this.$upload(res.file).then((res) => {
						this.$store.dispatch('user_editUserInfo', {
							field: 'avatar',
							value: res.data.url
						}).then((res2) => {
							this.hideLoading()
							this.$store.commit('setUserInfo', {
								...this.$store.state.userInfo,
								avatar: res.data.url
							})
							this.userInfo.avatar = res.data.url
						})
					})
				})
			},
			changeAnimall(val) {
				console.log(val);
				this.$cache('anima', val ? 1 : 2)
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		padding: 26rpx 16rpx 0;
		background-color: #fafafa;
	}

	.cell-box {
		padding: 0 0 0 36rpx;
		background-color: #fff;
		overflow: hidden;
		border-radius: 16rpx;
	}

	.b1 {
		display: flex;
		justify-content: space-between;
		padding: 26rpx 32rpx 26rpx 68rpx;
		align-items: center;
		margin-top: 26rpx;
	}

	.right-icon {
		font-size: 28rpx;
		font-family: PingFangSC;
		font-weight: 500;
		color: #B8B8BA;
		display: flex;
		align-items: center;

		.btn {
			margin-left: 26rpx;
			width: 68rpx;
			height: 36rpx;
			background: #EEEEEE;
			border-radius: 4rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #333;
			font-size: 22rpx;
		}
	}
</style>
