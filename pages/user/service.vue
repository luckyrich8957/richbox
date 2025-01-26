<template>
	<view>
		<view class="top">
			<text class='top-1'>竭诚为您服务</text>
			<text class='top-2'>{{$store.state.appConfig?$store.state.appConfig.sysConfig.kefu_info:''}}</text>
		</view>
		<view class="card">
			<u-image src='@/static/icon/service-wx.png' width='100rpx' height='100rpx'></u-image>
			<view class="card-r">
				<text class="card-r-1">微信客服</text>
				<text class="card-r-2">微信号：{{$store.state.appConfig?$store.state.appConfig.sysConfig.kefu_phone:''}}</text>
			</view>
		</view>
		<view class='btn' @click='btnClick'>复制客服号</view>
		<u-modal v-model="show" :mask-close-able='true' @confirm='confirm' content="客服微信号复制成功是否打开微信？" :show-cancel-button='true' ></u-modal>
	</view>
	
</template>

<script>
	import uniCopy from '@/js_sdk/xb-copy/uni-copy.js'
	export default {
		data() {
			return {
				show:false
			}
		},
		methods: {
			confirm(){
			try {
			    // #ifdef APP-PLUS
			    if (plus.runtime.isApplicationExist({ pname: 'com.tencent.mm', action: 'weixin://' })) {
			        if (plus.os.name == 'Android') {
			            plus.runtime.openURL(`weixin://`, error => {
			                //error后执行，处理android兼容
			                var Intent = plus.android.importClass("android.content.Intent");
			                var ComponentName = plus.android.importClass('android.content.ComponentName')
			                var intent = new Intent();
			                intent.setComponent(new ComponentName("com.tencent.mm", "com.tencent.mm.ui.LauncherUI"));
			                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			                intent.setAction("android.intent.action.VIEW");
			                var main = plus.android.runtimeMainActivity();
			                main.startActivity(intent);
			            }, 'com.tencent.mm');
			        } else if (plus.os.name == 'iOS') {
			            plus.runtime.openURL(`weixin://`);
			        }
			    } else {
			        uni.showToast({
			            title: '未检测到微信',
			            icon: 'none'
			        });
			        //TODO
			    }
			    // #endif
			
			    // #ifdef H5
			    location.href = 'weixin://';
			    // #endif
			} catch (e) {
			    this.$u.toast('打开微信失败')
			}
			},
			btnClick(){
				// #ifdef H5
				uniCopy({
				  content: this.$store.state.appConfig.sysConfig.kefu_phone+'',
				  success: (res) => {
					  uni.hideToast()
				    this.show=true
				  },
				  error: (e) => {
				    uni.showToast({
				      title: e,
				      icon: 'none',
				      duration: 3000,
				    })
				  }
				})
				// #endif
				// #ifdef APP
				import("@/js_sdk/dc-clipboard/clipboard.js").then(res=>{
					res.setText(this.$store.state.appConfig.sysConfig.kefu_phone);
					uni.hideToast()
					this.show=true 
				}).catch(err=>{
					console.log(err);
				})
				// #endif
			},
		}
	}
</script>

<style lang="scss" scoped>
	.btn{
		width: 700rpx;
		height: 80rpx;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		background-color:#3d3d3d;
		color: #fff;
		align-items: center;margin: 100rpx auto;
		&:active {
		  opacity: .5;
		  transform: scale(.99);
		}
	}
.top{
	height:340rpx;
	background-color: #3d3d3d;
	border-bottom-right-radius:50% 70rpx;
	border-bottom-left-radius:  50% 70rpx;
	display: flex;
	flex-direction: column;
	color: #fff;
	line-height: 1;
	padding-left: 29rpx;
	&-1{
		margin-top: 85rpx;
		font-size:30rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	&-2{
		font-size: 28rpx;
		
	}
}
.card{
	margin: -133rpx auto 0;
	width: 700rpx;
	height: 166rpx;
	background: #FFFFFF;
	box-shadow: 0px 0px 22rpx 0px rgba(73,73,73,0.0800);
	border-radius: 6rpx;
	display: flex;
	padding: 0 32rpx;
	align-items: center;
	&-r{
		display: flex;
		flex-direction: column;
		margin-left: 28rpx;
		align-self: stretch;
		line-height: 1;
		color: #000;
		&-1{
			margin-top: 50rpx;
			font-size: 30rpx;
			font-family: Microsoft YaHei;
			font-weight: bold;
			color: #1E212C;
		}
		&-2{
			margin-top: 17rpx;
			font-size: 22rpx;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #1E212C;
		}
	}
}
</style>
