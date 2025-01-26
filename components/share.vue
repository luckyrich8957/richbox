<template>
	<view>
		<u-popup v-model='_show' border-radius="14" mode='bottom'>
			<view class="slot">
				<!-- #ifdef MP-WEIXIN -->
				<button :data-img='share.imageUrl' :data-path='_page' :data-title='share.title'
					class="item  u-reset-button" open-type="share">
					<u-image height='100rpx' mode='widthFix' src='https://manghe.jikechaowan.com/image/wx.png'
						width='100rpx'></u-image>
					<text>分享到微信好友</text>
				</button>
				<!-- #endif -->

				<!-- #ifdef MP-ALIPAY -->
				<button :data-img='share.imageUrl' :data-path='_page' :data-title='share.title'
					class="item u-reset-button" open-type="share">
					<u-image height='100rpx' src='https://manghe.jikechaowan.com/image/ali.png' width='100rpx'>
					</u-image>
					<text>支付寶</text>
				</button>

				<!-- #endif -->
				<!-- #ifdef MP-QQ -->
				<button :data-img='share.imageUrl' :data-path='_page' :data-title='share.title'
					class="item  u-reset-button" open-type="share">
					<u-image height='100rpx' src='https://manghe.jikechaowan.com/image/QQ.png' width='100rpx'></u-image>
					<text>QQ</text>
				</button>
				<!-- #endif -->
				<!-- #ifdef APP -->
				<view class="item">
					<u-image height='100rpx' src='https://manghe.jikechaowan.com/image/wx.png' width='100rpx'
						@click="shareApp('weixin')">
					</u-image>
					<text>分享</text>
				</view>
				<!-- #endif -->
				<view class="item" @click="haibao">
					<u-image height='100rpx' src='https://manghe.jikechaowan.com/image/share.png' width='100rpx'>
					</u-image>
					<text>下載分享海報</text>
				</view>
				<!-- #ifdef H5 -->
				<view class="item" @click="copy">
					<u-image height='100rpx' src='https://manghe.jikechaowan.com/image/share.png' width='100rpx'>
					</u-image>
					<text>複製分享連結</text>
				</view>
				<!-- #endif -->
			</view>
		</u-popup>
		<QSPopup ref="popup">
			<view class="flex_column ">
				<u-image :src="path" height='1000rpx' mode='widthFix' width='600rpx'>
					<view slot="error" class="error">
						{{ text }}
					</view>
				</u-image>
				<l-painter ref='painter' custom-style="position: fixed; left: 400%" />
				<view class="flex_row marginTop2vh">
					<!-- #ifndef H5||MP-ALIPAY -->
					<button size="mini" type="button" @click="save">保存圖片</button>
					<button size="mini" type="button" @click="gb">關閉海報</button>
					<!-- #endif -->
					<!-- #ifdef MP-ALIPAY -->
					<button type="button" @click="save">保存圖片</button>
					<button type="button" @click="gb">關閉海報</button>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<button size="mini" type="button" @click="haibaoShare">分享</button>
					<!-- #endif -->
				</view>
			</view>
		</QSPopup>
	</view>
</template>

<script lang="ts">
	import {
		base64ToPath
	} from '@/js_sdk/mmmm-image-tools/index.js'
	//需要把这些参数去除
	let ruleOut = ['coupon_user_id', 'coupon_price', 'num', 'state', 'blind_type', 'reward_goods_num', 'box_num',
		'winning_num'
	]
	import QSPopup from '@/components/QS-popup/QS-popup.vue';
	import uniCopy from '@/js_sdk/xb-copy/uni-copy.js'
	import {
		parseQuery
	} from "../utils/util";

	import { defineComponent, computed, ComputedRef } from 'vue';

	interface ShareState {
		userInfo: {
			uid: number;
			nickname: string;
			avatar: string;
		};
		_page: string;
		share: {
			title: string;
			imageUrl: string;
		};
		_show: boolean;
	}

	export default defineComponent({
		components: {
			QSPopup
		},
		name: "share",
		data() {
			return {
				text: '海報生成中...',
				path: '',
				isDraw: true,
				show: false,
				poster: {} as Record<string, any>,
				posterImage: '',
				canvasId: 'default_PosterCanvasId',
			}
		},
		props: {
			value: Boolean,
			goodInfo: {
				type: Object,
				default() {
					return {}
				},
			},
			page: {
				type: String,
				default: '/pages/tabbar/index/index',
			},
		},
		watch: {
			async _show(val) {
			},
		},
		methods: {
			paint() {
				return new Promise(async (resolve, reject) => {
					let url
					try {
						const {
							data
						} = await this.$store.dispatch('createQrcode', {
							page: this._page
						})
						url = data.url
					} catch (e) {
						url = ''
					}
					console.log(url, url, 'url');
					this.$refs.painter.render({
						css: {
							width: '600rpx',
							borderRadius: '30rpx',
						},
						views: [{
							css: {
								borderRadius: '10rpx',
								background: '#fff',
								padding: '30rpx'
							},
							type: "view",
							views: [{
									css: {
										display: 'inline-block',
										borderRadius: '50%',
										width: '100rpx',
										height: '100rpx'
									},
									type: 'image',
									src: this.userInfo.avatar
								}, {
									type: 'text',
									text: '你的好友' + this.userInfo.nickname + '邀請去玩盲盒',
									css: {
										width: '420rpx',
										display: 'inline-block',
										lineClamp: 3,
										paddingTop: '30rpx',
										fontSize: '24rpx',
										color: '#aaa',
										marginLeft: '20rpx'
									}
								},
								{
									css: {
										borderRadius: '10rpx',
										margin: '30rpx auto 0',
										objectFit: 'contain',
										width: '520rpx',
										height: '520rpx'
									},
									type: 'image',
									src: this.share.imageUrl
								},
								{
									css: {
										mode: 'cover',
										display: 'inline-block',
										marginTop: '20rpx',
										width: '200rpx',
										height: '200rpx'
									},
									type: 'image',
									src: url,
								},
								{
									type: 'text',
									text: this.share.title,
									css: {
										lineClamp: 4,
										width: '300rpx',
										display: 'inline',
										fontSize: '24rpx',
										color: '#888',
										marginLeft: '20rpx',
										marginTop: '80rpx'
									}
								},
								{
									type: 'text',
									text: '長按識別二維碼',
									css: {
										width: '100%',
										display: 'inline-block',
										fontSize: '24rpx',
										color: 'red',
										textAlign: 'center',
										marginTop: '20rpx'
									}
								},
							]
						}]
					}).then((res) => {
						this.$refs.painter.canvasToTempFilePathSync({
							fileType: "jpg",
							quality: 0.5,
							success: (res) => {
								resolve(res.tempFilePath)
							},
							fail: (err) => {
								rej(err)
							}
						})
					})
				})
			},
			gb() {
				this.$refs.popup.hide()
			},
			async save() {
				if (this.isDraw) return this.$u.toast(this.text)
				let path = this.path
				// #ifdef MP
				path = await base64ToPath(this.path)
				// #endif
				uni.saveImageToPhotosAlbum({
					filePath: path,
					success: () => {
						this.$u.toast('保存成功')
						this.$refs.popup.hide()
					},
					fail: (err) => {
						console.log(err);
						// #ifdef APP
						this.$u.toast('保存失敗，請開啟權限')
						// #endif
						// #ifdef MP
						if (err['errMsg'] === 'saveImageToPhotosAlbum:fail auth deny') {
							uni.showModal({
								content: '你還未開啟權限是否去開啟？',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting({
											success(res1) {
												if (!res1.authSetting[
														'scope.writePhotosAlbum'
													]) {
													this.$u.toast(
														'授權失敗')
												} else {
													uni.saveImageToPhotosAlbum({
														filePath: path,
														success: () => {
															this.$u
																.toast(
																	'保存成功'
																)
															this.$refs
																.popup
																.hide()
														},
													})
												}
											}
										});
									}
								}
							})
						}
						// #endif
					}
				});
			},
			haibaoShare() {
				if (this.isDraw) return this.$u.toast(this.text)
				//在這裡使用文檔說的分享的方法
				// #ifdef APP-PLUS
				plus.share.sendWithSystem({
					type: 'image',
					pictures: [this.path]
				}, () => {
					console.log('分享成功');
					this._show = false
				}, function(e) {
					console.log('分享失敗：' + JSON.stringify(e));
				})
				// #endif
			},
			copy() {
				uniCopy({
					content: window.location.origin + '/#' + this._page,
					success: (res) => {
						uni.showToast({
							title: res,
							icon: 'none'
						})
					},
					error: (e) => {
						uni.showToast({
							title: e,
							icon: 'none',
							duration: 3000,
						})
					}
				})
				this._show = false
			},
			async haibao() {
				console.log(this.goodInfo.img1)
				this.$refs.popup.show()
				this._show = false
				if (this.path.length > 0) {
					this.path = ''
				}
				uni.showLoading({
					title: '海報生成中',
					mask: true
				})

				// #ifndef H5
				this.isDraw = true
				let url;
				try {
					const {
						data
					} = await this.$store.dispatch('createQrcode', {
						page: this._page
					})
					url = data.url
				} catch (e) {
					url = ''
				}
				console.log(url, url, 'url');
				// #endif
				this.$refs.painter.render({
					css: {
						width: '600rpx',
						borderRadius: '30rpx',
					},
					views: [{
						css: {
							borderRadius: '10rpx',
							background: '#fff',
							padding: '30rpx'
						},
						type: "view",
						views: [{
								css: {
									display: 'inline-block',
									borderRadius: '50%',
									width: '100rpx',
									height: '100rpx'
								},
								type: 'image',
								src: this.userInfo.avatar
							}, {
								type: 'text',
								text: '你的好友' + this.userInfo.nickname + '邀請去玩盲盒',
								css: {
									width: '420rpx',
									display: 'inline-block',
									lineClamp: 3,
									paddingTop: '30rpx',
									fontSize: '24rpx',
									color: '#aaa',
									marginLeft: '20rpx'
								}
							},
							{
								css: {
									borderRadius: '10rpx',
									margin: '30rpx auto 0',
									objectFit: 'contain',
									width: '520rpx',
									height: '520rpx'
								},
								type: 'image',
								src: this.share.imageUrl
							},
							// #ifndef H5
							{
								css: {
									mode: 'cover',
									display: 'inline-block',
									marginTop: '20rpx',
									width: '200rpx',
									height: '200rpx'
								},
								type: 'image',
								src: url,
							},
							// #endif
							// #ifdef H5
							{
								type: 'qrcode',
								text: window.location.origin + '/#' + this._page,
								css: {
									display: 'inline-block',
									marginTop: '20rpx',
									width: '200rpx',
									height: '200rpx'
								}
							},
							// #endif
							{
								type: 'text',
								text: this.share.title,
								css: {
									lineClamp: 4,
									width: '300rpx',
									display: 'inline',
									fontSize: '24rpx',
									color: '#888',
									marginLeft: '20rpx',
									marginTop: '80rpx'
								}
							},
							// #ifndef H5
							{
								type: 'text',
								text: '長按識別二維碼',
								css: {
									width: '100%',
									display: 'inline-block',
									fontSize: '24rpx',
									color: 'red',
									textAlign: 'center',
									marginTop: '20rpx'
								}
							},
							// #endif
							// #ifdef H5
							{
								type: 'text',
								text: '長按保存圖片',
								css: {
									width: '100%',
									display: 'inline-block',
									fontSize: '24rpx',
									color: 'red',
									textAlign: 'center',
									marginTop: '20rpx'
								}
							},
							// #endif
						]
					}]
				}).then(res => {
					uni.hideLoading()
					this.$refs.painter.canvasToTempFilePathSync({
						fileType: "jpg",
						quality: 0.5,
						success: (res) => {
							this.path = res.tempFilePath
							console.log(this.path, '、、、、、');
							this.isDraw = false
						},
						fail: (err) => {
							this.text = '海報生成失敗'
							this.isDraw = true
						}
					})
				}).catch(err => {
					this.text = '海報生成失敗'
					this.isDraw = true
					uni.hideLoading()
				})
			},
			async shareApp(name) {
				// #ifdef APP-PLUS
				uni.showLoading({
					title: '生成中'
				})
				const path = await this.paint()
				plus.share.sendWithSystem({
					type: 'image',
					pictures: [path]
				}, () => {
					console.log('分享成功');
					this._show = false
					uni.hideLoading()
				}, function(e) {
					console.log('分享失敗：' + JSON.stringify(e));
					uni.hideLoading()
				})
				// #endif
			}
		},
		computed: {
			userInfo(): ComputedRef<ShareState['userInfo']> {
				return computed(() => {
					if (this.$store.state.userInfo.uid) {
						return {
							uid: this.$store.state.userInfo.uid,
							nickname: this.$store.state.userInfo.nickname,
							avatar: this.$store.state.userInfo.avatar
						}
					}
					return {
						uid: 0,
						nickname: '',
						avatar: ''
					}
				})
			},
			_page(): ComputedRef<string> {
				return computed(() => {
					let query = parseQuery(window.location.href)
					for (let key in query) {
						if (ruleOut.includes(key)) {
							delete query[key]
						}
					}
					return this.$store.state.page + '?' + Object.keys(query).map(key => key + '=' + query[key]).join('&')
				})
			},
			share(): ComputedRef<ShareState['share']> {
				return computed(() => {
					return this.$store.state.share
				})
			},
			_show: {
				get(): boolean {
					return this.value;
				},
				set(val: boolean): void {
					this.$emit('input', val);
				}
			}
		},

	})
</script>
