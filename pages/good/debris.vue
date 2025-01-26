<template>
  <view class='pages' :style="{'--height':height}">
    <view class="alert">
      该图鉴共{{ goods.length }}种图片，您已收集到 {{ myGoods.length }} 种图片
    </view>
    <view class="goods-box">
      <view class="goods-item" v-for='item in goods'>
        <view class="img">
          <view class="model" v-if='item.owner_num===0'>
          </view>
          <u-image :src='item.img' width="350rpx" height="350rpx"></u-image>
        </view>
        <view class="go tip" v-if='item.owner_num===0' @click="$authRoute({url:'/pages/tabbar/goods/goods'})">
          <text>去收集</text>
          <u-icon name='arrow-right' size="25rpx" color='#eee'></u-icon>
        </view>
        <view class="num tip" v-else>
          X{{ item.owner_num }}
        </view>
        <view :class="{title:true,no:item.owner_num===0}">
          {{ item.reward_name }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      goods: [],
      id: '',
	  height:0,
      myGoods: []
    }
  },
  onReady() {
    this.getDetail()
this.height=uni.$u.sys().windowHeight+'px'
  },
  onLoad(p) {
    this.id = p.id
	
  },
  methods: {
    getDetail() {
      this.$store.dispatch('mapAuth_getMapsAuthInfo', {id: this.id}).then((res) => {
        this.goods = res.data.all_maps
        this.myGoods = res.data.all_maps.filter((item) => {
          return item.owner_num > 0
        })
      }).catch((res) => {

      })
    }
  }
}
</script>
<style>
</style>
<style scoped lang="scss">
.pages{
	background-color: #212024;
	min-height: var(--height);
}
.alert {
  padding-top: 46rpx;
  padding-bottom: 67rpx;
  padding-left: 32rpx;
  font-size: 24rpx;
  line-height: 1;
  font-family: PingFangSC;
  font-weight: 400;
  color: #B8B8BA;
}

.goods-box {
  padding: 0 16rpx 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .goods-item {
    width: 350rpx;

    .img {
      height: 350rpx;
      border-radius: 16rpx 16rpx 0px 0px;
      overflow: hidden;
      position: relative;
      background-color: #464646;

      .model {
        position: absolute;
        z-index: 2;
        background-color: rgba(0, 0, 0, .8);
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
    }

    .tip {
      height: 64rpx;

      border-radius: 0px 0px 16rpx 16rpx;
      display: flex;
      align-items: center;
    }

    .go {
      justify-content: space-between;
      align-items: center;
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 400;
      background: #464646;
      color: #FFFFFF;
      padding: 0 25rpx;
    }

    .num {
      background-color: #323232;
      justify-content: center;
      font-size: 28rpx;
      font-family: HelveticaNeue;
      font-weight: normal;
      color: #FFFFFF;
    }

    .title {
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 300;
      color: #FFFFFF;
      padding: 24rpx 25rpx 60rpx;
    }

    .no {
      color: #464646;
    }
  }
}
</style>
