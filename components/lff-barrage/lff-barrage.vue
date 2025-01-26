<template>
	    <view class="pa"  :style="{paddingTop:padding+'px',position: fixed?'fixed':'relative',width: '100%',height: fixed?'100%':height,pointerEvents: 'none', top: 0}">
		<view class="danmu-li" v-for="(item,index) in listData" :class="item.type" :style="[item.style]" :key="index">
			<view class="danmu-inner">
				<view class="user-box" :style="barrage[item.levelName].bg">
					<view class="user-img">
						<view class="img-box">
							<image :src="item.img"></image>
						</view>
					</view>
					<view class="user-text cl1" :style="barrage[item.levelName].textStyle">
						{{item.name}}
					</view>
					<view class="user-status cl1 u-flex" :style="barrage[item.levelName].textStyle">
						<template v-if="item.type === 'special'">
							<view class="special-effect">
								<span class="sparkle">✨</span>
								{{item.levelName}}(<view style="max-width: 300rpx;" class="u-line-1">{{item.title}}</view>)
								<span class="sparkle">✨</span>
							</view>
						</template>
						<template v-else>
							{{item.levelName}}(<view style="max-width: 300rpx;" class="u-line-1">{{item.title}}</view>)
						</template>
					</view>
					<view class="tip" v-if='barrage[item.levelName].tip' :style='barrage[item.levelName].tip.style'>
						<u-image width='100%' height='100%' :src='barrage[item.levelName].tip.img'></u-image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import barrage from '@/common/barrage.js'
	const arr=['A赏','B赏','C赏','D赏','最终赏']
	export default {
		props: {
			//rightToLeft leftToRight leftBottom
			height:{
				type:String,
				default:'100px'
			},
			padding:{
				default:0
			},
			fixed:{
				type:Boolean,
				default:true
			},
			type: {
				type: String,
				default: 'rightToLeft'
			},
			minTime: {
				type: Number,
				default: 6
			},
			maxTime: {
				type: Number,
				default: 6
			},
			minTop: {
				type: Number,
				default: 50
			},			
			maxTop: {
				type: Number,
				default: 50
			},
			hrackH: { //轨道高度
				type: Number,
				default: 100
			},
			noStacked: { //不允许堆叠(暂不可用)
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				barrage:JSON.parse(JSON.stringify(barrage)),
				listData: []
			}
		},
		mounted() {
			this.hrackNum = Math.floor((this.maxTop - this.minTop) / this.hrackH);
		},
		methods: {
			clearList(){
				this.listData=[]
			},
			add(obj) {
				if(!this.barrage[obj.levelName]){
					this.barrage[obj.levelName]=JSON.parse(JSON.stringify(this.barrage['最终赏']))
				}
				let data = {
					name: obj.name,
					levelName:obj.levelName,
					img: obj.img,
					title: obj.title,
					id: Date.parse(new Date()),
					time: Math.ceil(Math.floor(Math.random() * (this.maxTime - this.minTime + 1) + this.minTime)),
					type: this.type
				}
				if (this.type === 'leftBottom') {
					let objData = {
						name: obj.name,
						img: obj.img,
						levelName:obj.levelName,
						title: obj.title,
						type: 'leftBottomEnter',
						style: {
							transition: `all .5s`,
							animationDuration: `0.5s`,
							transform: `translateX(0%)`,
							bottom: `${this.minTop}px`
						}
					}
					let listLen = this.listData.length;
					let hrackNum = this.hrackNum;
					for (let i in this.listData) {
						if (this.listData[i].status === 'reuse') { //重用
							this.$set(this.listData, i, objData);
						} else if (this.listData[i].status === 'reset') { //重置
							this.listData[i].style.transition = 'none';
							this.listData[i].style.bottom = 0;
							this.listData[i].status = 'reuse';
						} else if (this.listData[i].status === 'recycle') { //回收
							this.listData[i].type = 'leftBottomExit';
							this.listData[i].status = 'reset';
						} else {
							this.listData[i].style.bottom = parseInt(this.listData[i].style.bottom) + this.hrackH + 'px';
						}
						if (parseInt(this.listData[i].style.bottom) >= (this.maxTop - this.hrackH) && this.listData[i]
							.status !== 'reset') { //需要回收
							
						}
					}
					if (listLen < hrackNum + 2) {
						this.listData.push(objData);
					}
				} else if (this.type === 'rightToLeft' || this.type === 'leftToRight') {
					let objData = this.horStacked(data);
			
					for (let i in this.listData) {
						if (this.listData[i].delTime <= Date.parse(new Date())) {
							this.repaint(i, objData.type);
							objData.type = '';
							this.$set(this.listData, i, objData);
							return
						}
					}
					this.listData.push(objData);
							console.log( this.listData);
				}
			},
			horStacked(data) {
				let top
				if(!this.fixed){
				let p=this.padding+2
				let h=uni.upx2px(this.hrackH)+p
				top=`${Math.ceil(Math.random()*(h-35-p)+p)}px`
				}else{
				top=`${Math.ceil(Math.random() * (this.maxTop - this.minTop + 1) + this.minTop)}px`
				}
				
				return {
					name: data.name,
					levelName:data.levelName,
					img: data.img,
					title: data.title,
					type: this.type,
					style: {
						animationDuration: `${data.time}s`,
						top
					},
					delTime: Date.parse(new Date()) + data.time * 1500
				}
			},
			repaint(index, type) {
				setTimeout(() => {
					this.listData[index].type = type;
				}, 100)
			}
		}

	}
</script>
<style>

</style>
<style lang="scss">
	@keyframes leftBottomEnter {
		0% {
			transform: translateY(100%);
			opacity: 0;
		}

		100% {
			transform: translateY(0%);
			opacity: 1;
		}
	}
	.pa{
		width: 750rpx;
		overflow: hidden;
		position: relative;
		box-sizing: content-box;
	}
	@keyframes leftBottomExit {
		0% {
			transform: translateY(0%);
			opacity: 1;
		}

		100% {
			transform: translateY(-200%);
			opacity: 0;
		}
	}

	@keyframes leftToRight {
		0% {
			transform: translateX(-100%);
		}

		100% {
			transform: translateX(100%);
		}
	}

	@keyframes rightToLeft {
		0% {
			transform: translateX(100%);
		}

		100% {
			transform: translateX(-100%);
		}
	}

	.danmu-li {
		position: absolute;
		width: 100%;
		transform: translateX(100%); 
		animation-timing-function: linear;
		z-index:99;
		&.leftBottomEnter {
			animation-name: leftBottomEnter;
		}

		&.leftBottomExit {
			animation-name: leftBottomExit;
			animation-fill-mode: forwards;
		}

		&.rightToLeft {
			animation-name: rightToLeft;
		}

		&.leftToRight {
			animation-name: leftToRight;
		}

		.danmu-inner {
			display: inline-block;

			.user-box {
				display: flex;
				padding: 10rpx 40rpx 10rpx 10rpx;
				// background: rgba(0, 0, 0, 0.3);
				background: linear-gradient(90deg, #FFF498 0%, #E1EDFF 100%);
				border-radius: 32rpx;
				align-items: center;
				position: relative;
				.tip{
					position: absolute;
					top:0;
					transform:translateY(-70%);
					right:0rpx;
				}
				.user-img {
					.img-box {
						display: flex;

						image {
							width: 46rpx;
							height: 46rpx;
							background: rgba(55, 55, 55, .3);
							border-radius: 50%;
						}
					}
				}

				.user-status {
					margin-left: 10rpx;
					white-space: nowrap;
					font-size: 22rpx;
					font-family: PingFangSC;
					font-weight: 400;
					color: #333333;
					// color: rgba(255, 255, 255, 1);
				}

				.user-text {
					margin-left: 10rpx;
					white-space: nowrap;
					font-weight: 400;
					font-size: 22rpx;
					font-family: PingFangSC;
					font-weight: 400;
					color: #333333;
					// width: 80rpx;
					// color: rgba(255, 255, 255, 1);
				}
			}
		}
	}
</style>
