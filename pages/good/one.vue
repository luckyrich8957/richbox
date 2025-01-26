<template>
  <view
      class="pages"
  >
    <!-- #ifndef MP-ALIPAY -->
    <u-navbar
		:immersive='true'
        :back-icon-size="40"
        :background="{ backgroundColor: 'transparent' }"
        :border-bottom="false"
        back-icon-color="#ffffff"
        class="nav"
    ></u-navbar>
    <!-- #endif -->
	<!-- #ifdef MP-ALIPAY -->
	<u-navbar
		:immersive='true'
	    :back-icon-size="40"
	    :background="{ backgroundColor: 'transparent' }"
	    :border-bottom="false"
	    back-icon-color="transparent"
	    class="nav"
	></u-navbar>
	<!-- #endif -->
	<view class="title-img">
		<u-image src='https://manghe.jikechaowan.com/image/new/one-title.png' width='667rpx' height='110rpx' ></u-image>
	</view>
	<template v-if='isOne'>
				<!-- 只有一个的情况 -->
				<view class="good-one">
					<view class="icon">
						<u-image width='140rpx' height='46rpx' :src='goodList[0][0].reward_type_img'></u-image>
					</view>
					<view class="good-img">
						<u-image :src='goodList[0][0].img' width='250rpx' height='250rpx'></u-image>
					</view>
				</view>
	</template>
	<template v-else>
		<swiper :circular="true" class='swiper' :current="uCurrent" @change="change">
			<swiper-item style='height: 100%;' v-for='item in goodList'>
				<view class="swiper-item" :style='{alignItems:item.length>3?"normal":"center"}'>
					<view class="item" v-for='item1 in item' >
						<view class="icon">
							<u-image width='76rpx' height='25rpx' :src='item1.reward_type_img'></u-image>
						</view>
						<view class="good-img">
							<u-image :src='item1.img' width='140rpx' height='140rpx'></u-image>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</template>
				<view class="tip">
					（赏品已存入盒柜）
				</view>
				<view  class="u-swiper-indicator" v-if='showDot'>
				<view class="u-indicator-item-dot" :class="{ 'u-indicator-item-dot-active': index == uCurrent }" v-for="(item, index) in goodList"
					 :key="index"></view>
				</view>	
	<view class="btn-box" :style="{marginTop:showDot?'50rxp':'100rpx'}">
		<view class="btn b3" @click='$authRoute({url:"/pages/reward/reward",type:"redirect"})'></view>
		<view class="btn b2" @click="()=>resoleGoods()"></view>
		<view class="btn b1" @click="back"></view>
	</view>
	<!-- 弹窗 -->
	<modal5 v-model='show' @submit='submit' :num='num'></modal5>
	<model18 v-model ='show2' @del='del'  :isclose='isclose'></model18>
	<modal17 :goods='filiList' v-model='fuli'/>
  </view>
</template>

<script>
	import modal17 from '@/components/modal17.vue'
	import modal5 from '@/components/modal5.vue'
	import model18 from '@/components/modal18.vue'
export default {
	components:{
		modal5,
		modal17,
		model18 
	},
  data() {
    return {
		uCurrent:0,
		fuli:false,
		timer:null,
		isclose:true,
		show2:false,
		num:0,
		show:false,
      height: "44px",
      type: "egg",
	filiList:[],
      box_id: 0,
      blind_goods_id: 0,
      order_id: 0,
      // 是否是单抽
      isOne: false,
      goodList: [],
	  currentItem:{},
    };
  },
  watch:{
	  show2(val){
		  if(!val){
			  clearTimeout(this.timer)
		  }
	  }
  },
  computed:{
	  showDot(){
		 return this.goodList.length>1
	  },
  },
  methods: {
	  change(e){
	  		 this.uCurrent= e.detail.current
	  },
	  del(){
		  clearTimeout(this.timer)
	  },
	 async submit(){
	try{
	const {data}= await this.$store.dispatch('order_resoleGoods2',{order_id:this.order_id})
	 this.$t('分解成功',()=>{
		uni.navigateBack()
	})	
	}catch(e){
		this.$t(e.msg||'分解失败')
	}	
		  
	  },
	 async resoleGoods(item){
		  	this.num=this.goodList.flat().reduce((cur,item)=>{
		  			 cur+=parseFloat(item.resolve_total_num)
		  		 return cur
		  	 },0) 
		  	return this.show=true
	  },
	  back(){
		  uni.navigateBack()
	  },
    btnClick() {
		const a=this.$cache('back_goods')
      let url=a?a:'/pages/tabbar/index/index'
      this.$authRoute({
        url: url,
		type:'redirect'
      });
    },
    async init() {	
		// this.fuli=t
      try {
        const params = {
          order_id: this.order_id,
        }
        if (!this.reward_map) {
          params.map_id = this.reward_map;
        }
        const {data} = await this.$store.dispatch("blind_getRewardList", params);
		// 福利
		const goods=[]
		data.order_list.forEach(item=>{
			if(item.is_sys_give){
				this.filiList.push(item)
			}else{
				const arr =new Array(item.goods_num).fill(item)
				goods.push(...arr)
			}
		})
		this.goodList=goods.reduce((cur,item,index)=>{
			let col=cur.length  
			 if(index+1>col*5){
				cur.push([item])
			}else{
				cur[col-1].push(item)
			}
			return cur
		},[])
		this.isOne=(this.goodList.flat().length===1)  
		console.log(this.filiList);
		if(this.filiList.length>0){
			this.fuli=true
		}
      } catch (e) {
        console.log(e);
        this.$u.toast(e.msg);
      }
    },
  },
  onLoad(Params) {
    if (!Params.type) return;
    const {type, order_id, reward_map} = Params;
    this.type = type;
    this.order_id = order_id;
    this.reward_map = reward_map;
  },
  
  onReady() {
    this.init();
    setTimeout(() => {
      this.$u.getRect(".nav").then((res) => {
        this.height = res.height + "px";
      });
    });
  },
};
</script>

<style lang="scss" scoped>
	.u-indicator-item-dot {
		width: 14rpx;
		height: 14rpx;
		margin: 0 6rpx;
		border-radius: 20rpx;
		transition: all 0.5s;
		background-color: rgba(0, 0, 0, 0.3);
		border: 1px solid  #fff;
	}
	
	.u-indicator-item-dot-active {
		background-color: rgba(255, 255, 255, 0.8);
	}
	.u-swiper-indicator{
		margin-top: 25rpx;
		display: flex;
		justify-content: center;
	}
.pages{
	height: 100vh;
	overflow: hidden;
	background-image: url("https://manghe.jikechaowan.com/image/new/one-bg.png");
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-color: #29282c;
}
.title-img{
	margin-top: 215rpx;
	padding: 0 41rpx;
}
.swiper{
	margin-top: 86rpx;
	height: 450rpx;
	margin-bottom: 25rpx;
	.swiper-item{
		height: 100%;
		display: flex;
		padding: 0 40rpx;
		justify-content: center;
		flex-wrap: wrap;
		.item{
			.icon{
				padding: 15rpx 0 0 15rpx;
			}
			width: 200rpx;
			height: 200rpx;
			background: url('https://manghe.jikechaowan.com/image/new/border-bg.png');
			background-size: 100% 100%;
			margin: 0 11rpx 50rpx;
			.good-img{
				display: flex;
				justify-content: center;
			}
		}
	}
}
.good-one{
	width: 363rpx;
	height: 363rpx;
	background: url('https://manghe.jikechaowan.com/image/new/border-bg.png');
	background-size: 100% 100%;
	margin: 134rpx auto 30rpx;
	.icon{
		padding: 30rpx 0 0 30rpx;
	}
	.good-img{
		display: flex;
		justify-content: center;
	}
}
.tip{
	font-size: 24rpx;
	text-align: center;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #FFFFFF;
	opacity: 0.5;
}
.btn-box{
	display: flex;
	justify-content: center;
	padding:0 31rpx;
	flex-wrap: wrap;
	margin-top: 100rpx;
}
.btn{
	width: 320rpx;
	height: 110rpx;
	background-size: 100% 100%;
	margin:0rpx 10rpx 33rpx;
	// background-color: #fff;
	background-repeat: no-repeat;
	&:active {
	  opacity: .5;
	  transform: scale(.99);
	}
	
}
.b1{
	background-image:url('https://manghe.jikechaowan.com/image/new/btn1.png');
	
}
.b3{
	background-image:url('https://manghe.jikechaowan.com/image/new/btn3.png');
}
.b2{
	background-image:url('https://manghe.jikechaowan.com/image/new/btn2.png');
}
</style>
