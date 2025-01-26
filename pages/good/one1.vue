<template>
  <view
      :style="{
      backgroundPosition: '0 ' + height,
      paddingBottom: isOne ? '0' : '268rpx',
    }"
      class="pages"
  >
    <!-- #ifndef MP-ALIPAY -->
    <u-navbar
        :back-icon-size="40"
        :background="{ backgroundColor: '#29282c' }"
        :border-bottom="false"
        back-icon-color="#ffffff"
        class="nav"
    ></u-navbar>
    <!-- #endif -->
	<!-- #ifdef MP-ALIPAY -->
	<u-navbar
	    :back-icon-size="40"
	    :background="{ backgroundColor: '#29282c' }"
	    :border-bottom="false"
	    back-icon-color="transparent"
	    class="nav"
	></u-navbar>
	<!-- #endif -->
    <view :style="{ marginTop: isOne ? '162rpx' : '62rpx' }" class="title">
      恭喜您获得
    </view>
    <view v-if="isOne">
      <view class="type u-flex u-row-center"><u-image :src='goodList[0].icon' width='242rpx' height='80rpx'></u-image>
					<text>X{{goodList[0].num}}</text></view>
      <view class="img">
        <u-image
            :src="goodList[0].img"
            height="500rpx"
            width="500rpx"
        ></u-image>
      </view>
    </view>
    <view v-else class="goods">
      <view v-for="(item, index) in goodList" :key="index" class="item">
        <view class="box">
			<view class="top">
				<u-image
				    v-if="item.type === 'good'"
				    :src="item.img"
				    border-radius="16rpx"
				    height="140rpx"
				    width="140rpx"
				></u-image>
				<view v-else class="img-box">
				  <u-image :src="item.img" height="96rpx" width="96rpx"></u-image>
				</view>
				<view class="item-right">
				  <view :style="{ color: item.color }" class="item-title u-flex">
				    <u-image :src='item.icon' width='121rpx' height='40rpx'></u-image>
					<text>X{{item.num}}</text>
				  </view>
				  <view class="item-name">
				    {{ item.reward_name }}
				  </view>
				</view>
			</view>
		  <view v-if="item.type === 'good'"  @click="" class="bottom">
		    <view class="border" @click="resoleGoods(item)">
		      <text>不喜欢 去分解</text>
		      <u-image class="u-m-10" height="35rpx" src="@/static/material/crystal.png" width="26rpx"></u-image>
		      {{ item.resolve_total_num }}
		    </view>
		  </view>
        </view>
        
      </view>
    </view>
    <view class="fixed safe-area-inset-bottom">
      <view class="btn-top">
        <view class="left" @click="$authRoute({url:'pages/reward/reward',type:'reLaunch'})"> 前往发货</view>
        <view class="right" @click="resoleGoods()">不喜欢，发起全部分解</view>
      </view>
      <view class="btn-bottom" @click="btnClick"> 再玩一次</view>
    </view>
	<modal5 v-model='show' @submit='submit' :num='num'></modal5>
	<model18 v-model ='show2' @del='del'  :isclose='isclose'></model18>
  </view>
</template>

<script>
	import modal5 from '@/components/modal5.vue'
	import model18 from '@/components/modal18.vue'
export default {
	components:{
		modal5,
		model18 
	},
  data() {
    return {
		timer:null,
		isclose:true,
		show2:false,
		num:0,
		show:false,
      height: "44px",
      type: "egg",
      reward_map: [],
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
  methods: {
	  del(){
		  clearTimeout(this.timer)
	  },
	 async submit(){
		try{
			const parmse={
				  order_id:this.order_id
			  }
			  if(this.currentItem!=='all'){
				  parmse.reward_unique=this.currentItem.reward_unique
			  }else{
				  this.isclose=false
			  }
			 const {data}= await this.$store.dispatch('order_resoleGoods2',parmse)
			if(this.goodList.length==1||this.currentItem=='all'){
				
				this.goodList=[]
				const a=this.$cache('back_goods')
				let url=a?a:'/pages/tabbar/index/index'
			return this.$t('分解成功',()=>{
				this.$authRoute({
					  url: url,
					  type:'redirect'
					});
			})	
			}else{
				this.isclose=true
				this.goodList=this.goodList.filter(item=>item.id!==this.currentItem.id)
			}
			this.show=false
			this.$u.toast('分解成功')
			this.timer=setTimeout(()=>{
				const a=this.$cache('back_goods')
				let url=a?a:'/pages/tabbar/index/index'
				this.$authRoute({
				  url: url,
				  type:'redirect'
				});
			},3000)
		}catch(e){
			console.log(e);
			this.$u.toast(e.msg||'分解失败')
		}
		  
	  },
	  resoleGoods(item){
		  if(!item){
			 this.num=this.goodList.reduce((cur,item)=>{
				 if(item.type=='good'){
					 cur+=parseFloat(item.resolve_total_num)
				 }
				 return cur
			 },0) 
			 this.currentItem='all'
			return this.show=true
		  }
		  this.currentItem=item
		  this.num=item.resolve_total_num   
		  this.show=true
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
      try {
        const params = {
          order_id: this.order_id,
        }
        if (!this.reward_map) {
          params.map_id = this.reward_map;
        }
        const {data} = await this.$store.dispatch("blind_getRewardList", params);
        const goods = []
		this.isOne=data.extract_type!=0
        goods.push(...data.order_list)
        if (goods[0]) {
          this.blind_goods_id = Array.isArray(goods[0].blind_goods_id) ? goods[0].blind_goods_id[0] : goods[0].blind_goods_id
          this.box_id = goods[0].box_id
        }
        goods.forEach(item => {
          item.type = "good"
          if (item.is_sys_give) {
            item.title = '彩蛋'
            item.color = '#FFFFFF'
          } else {
			item.icon=item.reward_type_img
			item.num=item.goods_num
            item.color = '#FFE230'
          }
        })
        const levelMap = ['', '一', '二', '三', '四', '五', '六']
        goods.push(...data.map.map(item => {
          return {
            ...item,
            type: 'material',
            title: `${levelMap[item.level]}级材料X1`,
            color: '#FFFFFF',
            reward_name: '可以在“我的-极客工坊”模块查看、兑换礼品',
            img: `https://manghe.jikechaowan.com/image/material/material-${item.level}.png`
          }
        }))
        this.goodList = goods;
		console.log(this.goodList);
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
.goods {
  margin: 45rpx 16rpx 0;

  .bottom {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .border {
      display: flex;
      color: #FFFFFF;
      align-items: center;
      font-size: 24rpx;
      padding: 0 28rpx;
      height: 70rpx;
      border: 2rpx solid #464646;
      border-radius: 12rpx;
      justify-content: center;
	background-color: #464646;
      .t1 {
        font-size: 30rpx;
        font-family: HelveticaNeue;
        font-weight: normal;
        color: #FFFFFF;
      }
    }
  }

  .item {
    width: 718rpx;
    background: #323232;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 26rpx;

  }

  .box {
	.top{
		// height: 204rpx;
		 display: flex;
	}
    
    background: linear-gradient(
            -20deg,
            rgba(207, 207, 207, 0) 0%,
            #f4f4f4 100%
    );
    background-image: url("https://manghe.jikechaowan.com/image/bg-one.png");
    background-size: 100% 100%;
   
    padding: 32rpx;
    //align-items: center;

    .img-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 140rpx;
      height: 140rpx;
      background: #323232;
      border-radius: 12rpx;
    }

    .item-right {
      margin-left: 26rpx;
      flex: 1;

      .item-title {
        line-height: 1;
        margin-top: 14rpx;
        margin-bottom: 15rpx;
        font-size: 28rpx;
        font-family: PingFangSC;
        font-weight: 500;
      }

      .item-name {
        font-size: 24rpx;
        font-family: PingFangSC;
        font-weight: 300;
        color: #b8b8ba;
        line-height: 30rpx;
      }
    }
  }
}

.fixed {
  background-color: #29282c;
  bottom: 0rpx;
  padding-bottom: 50rpx;
  padding: 16rpx;
  padding-bottom: 50rpx;
  position: fixed;
  left: 0;
  right: 0;

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16rpx;
  }

  .btn-bottom {
    @extend .btn;
    height: 90rpx;
    background: #eb555b;
    font-size: 30rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #ffffff;
    margin-top: 22rpx;
  }

  .btn-top {
    display: flex;
    justify-content: space-between;

    view {
      width: 348rpx;
      height: 90rpx;
      background: #323232;
      @extend .btn;
      font-size: 30rpx;
      font-family: PingFangSC;
      font-weight: 300;
      color: #ffffff;
    }
  }
}

.pages {
  min-height: 100vh;
  background-image: url("https://manghe.jikechaowan.com/image/img-21.png");
  background-position: 0 44px;
  background-size: 100%;
  background-repeat: no-repeat;
  background-color: #29282c;

  .title {
    margin-top: 162rpx;
    font-size: 52rpx;
    font-family: PingFangSC;
    font-weight: 600;
    color: #fefefe;
    text-align: center;
    line-height: 1;
  }

  .type {
    line-height: 1;
    font-size: 36rpx;
    font-family: PingFangSC;
    font-weight: 600;
    color: #ffe230;
    text-align: center;
    margin-top: 35rpx;
  }

  .img {
    border-radius: 16rpx;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 50rpx;
    display: block;
    width: 500rpx;
    font-size: 0;
    box-shadow: 0 0 10rpx 10rpx #ffe230;
  }
}
</style>
