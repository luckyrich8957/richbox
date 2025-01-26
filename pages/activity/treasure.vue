<template>
  <mescroll-body :sticky="true" ref="mescrollRef" @init="mescrollInit" @down="downCallback" :up="upOption">
    <view class="tt" :style="{height: topHeight+'px', overflow:'hidden'}">
      <view class="alert">
        <view class="left">
          购买盲盒将有一定几率获得藏宝图，藏宝图可以兑换奖品
        </view>
      </view>
      <view class="top">
        <view class="top-itme" v-for="(item,index) in mapsList" :key='index'>
          <u-image :src='item.logo' width="80rpx" height="61rpx"></u-image>
          <view class="name">
            {{ item.level }}级藏宝图
          </view>
          <view class="num">
            <text class="num1">{{ item.map_num }}</text>
            张
          </view>
        </view>
      </view>
    </view>
    <view class="tabs">
      <u-tabs font-size='28' @change="change" height="94" :current="tabIndex"
              :bar-style="{backgroundColor:'#eb555b',width:'30rpx' ,height:'8rpx',borderRadius:'4rpx'}"
              inactive-color='#333' :active-item-style="{fontSize:'34rpx',fontweight:'600',color:'#333'}"
              bg-color="#fafafa" :is-scroll="false" :list='tabs'></u-tabs>
    </view>
    <swiper v-if='swiperHeight.length>0' class="uni-maps-swiper" :style="{height: swiperHeight}" :current="tabIndex"
            @change="swiperChange">
      <swiper-item>
        <treasure-item ref="mescrollItem" :height="swiperHeight"
                       :disable-scroll="disableScroll" :userInfo="userInfo" @updateMaps="updateMaps"></treasure-item>
      </swiper-item>
      <swiper-item>
        <treasure-item-two :height="swiperHeight" @updateMaps="updateMaps" :disableScroll="disableScroll"/>
      </swiper-item>
    </swiper>
  </mescroll-body>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import treasureItem from "./components/treasureItem.vue";
import treasureItemTwo from "./components/treasureItemTwo.vue";
import Vue from "vue";

export default {
  mixins: [MescrollMixin], // 使用mixin
  components: {
    treasureItem,
    treasureItemTwo
  },
  data() {
    return {
      upOption: {
        use: false // 主体框架只启用下拉刷新
      },
      topHeight: uni.upx2px(750), // 顶部内容的高度 (单位px)
      swiperHeight: "", // 需要固定swiper的高度 (单位px)
      disableScroll: true, // swiper列表是否禁止滚动
      tabs: [{
        name: '藏宝阁'
      }, {
        name: '藏宝图合成'
      }],
      tabIndex: 0,
      mapsList: [],
      userInfo: {}
    };
  },
  watch: {
    tabIndex(i) {
      // 当列表禁止滚动时,需把列表滚动条置顶 (解决问题: "全部"tab翻到第二页,切换到其他tab,滚动到顶部,再切回"全部"tab,此时的列表数据应该重头开始)
      if (this.disableScroll) {
        this.disableScroll = false // 当disableScroll=true时,scroll-view的scrollTo会失效,需先开启,再置顶
        this.$nextTick(() => {
          let mescroll = this.getMescroll()
          mescroll && mescroll.scrollTo(0, 0)
          setTimeout(() => { // 经测试android真机需延时300ms才能恢复禁止滚动,否则scrollTo有可能无效
            this.disableScroll = true
          }, 300)
        })
      }
    },

  },
  onLoad() {
    // 需要固定swiper的高度 (需减去悬浮tabs的高度64rpx)
    this.swiperHeight = uni.getSystemInfoSync().windowHeight - 47 + 'px'
    this.getPageInfo()
  },
  onReady() {
    this.$u.getRect('.tt').then(res => {
      console.log(res);
    })
  },
  mounted() {
    // #ifdef H5
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0
    }) // 刷新浏览器,重置滚动条
    // #endif
  },
  methods: {
    change(index) {
      this.tabIndex = index;
    },
    updateMaps(info) {
      Vue.set(this, 'userInfo', Object.assign(this.userInfo, info))
      this.mapsList = this.mapsList.map((item, index) => {
        item.map_num = this.userInfo['maps_num' + (index + 1)]
        return item
      })
    },
    getPageInfo() {
      this.$store.dispatch('treasure_getUpgradeInfo').then((res) => {
        this.userInfo = res.data.userInfo
        this.mapsList = res.data.mapsList.map((item, index) => {
          item.map_num = res.data.userInfo['maps_num' + (index + 1)]
          Vue.set(item, 'hc_num', 0)
          return item
        })
      })
    },
    /*下拉刷新的回调 */
    downCallback() {
      // 这里加载你想下拉刷新的数据, 比如刷新轮播数据
      // loadSwiper();
      this.mescroll.endSuccess()
    },
    // 轮播菜单
    swiperChange(e) {
      this.tabIndex = e.detail.current
    },
    // 获取指定下标的mescroll对象
    getMescroll(i) {
      let mescrollItems = this.$refs.mescrollItem;
      if (mescrollItems) {
        return mescrollItems.mescroll
      }
      return null
    },
    // 页面的滚动事件
    onPageScroll(e) {
      this.disableScroll = Math.ceil(e.scrollTop) < this.topHeight
    }
  },
}
</script>
<style>
page {
  background-color: #fafafa;
}
</style>
<style lang="scss" scoped>

.alert {
  background-color: #ffe9e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  height: 74rpx;

  .left {
    font-size: 22rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #EB555B;
  }
}

.top {
  margin: 26rpx 16rpx;
  height: 660rpx;
  background: #FFFFFF;
  border-radius: 40rpx;
  padding-top: 65rpx;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  .top-itme {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33%;

    .name {
      margin-top: 40rpx;
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 400;
      color: #B8B8BA;
      line-height: 1;
    }

    .num {
      margin-top: 25rpx;
      font-size: 28rpx;
      font-family: PingFangSC;
      font-weight: 400;
      color: #0C0C0C;

      .num1 {
        font-size: 76rpx;
        font-family: HelveticaNeue;
        font-weight: normal;
        color: #0C0C0C;
        line-height: 1;
      }
    }
  }
}

.tabs {
  padding: 0 100rpx;
  z-index: 990;
  position: sticky;
  top: var(--window-top);
  background-color: #fafafa;
  // background-color: #fff;
}
</style>
