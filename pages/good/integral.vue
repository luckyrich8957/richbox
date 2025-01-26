<template>
  <view>
    <view class="alert">
      在平台消费即可获得对应的积分，积分可兑换积分盲盒
    </view>
    <view class="card">
      <view class="title">
        我的积分
      </view>
      <view class="num">
        <u-icon name='https://manghe.jikechaowan.com/image/img_24.png' size="26rpx"></u-icon>
		<text class="u-p-l-10">{{ userInfo.integral }}</text>
        
      </view>
    </view>
    <mescroll-uni ref="mescrollRef" @init="mescrollInit" top="380" @down="downCallback" :up="upOption"
                  @up="upCallback">
      <view class="goods-box">
        <good :icon='1' :index='index' :good="item" v-for="(item,index) in goods" :key='index'/>
        <view class="empty" v-if='empty'>
          <u-image width="144rpx" height="116rpx" src='https://manghe.jikechaowan.com/image/img_20.png'></u-image>
          <text class="t">暂无商品</text>
        </view>
        <view style="width: 300rpx;" v-if="goods.length&&goods.length%2!==0">

        </view>
      </view>
    </mescroll-uni>
  </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";

import good from '@/components/good.vue'

export default {
  mixins: [MescrollMixin], // 使用mixin
  components: {
    good
  },
  data() {
    return {
      empty: false,
      upOption: {
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          use: false,
          tip: '~ 搜索无数据 ~', // 提示
          btnText: '去看看'
        }
      },
      goods: [], //列表数据
      userInfo: {integral:0}
    };
  },
  onReady() {
    this.$u.getRect('.card').then(res => {
      console.log(res.bottom * 2 + 19);
    })
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      this.$store.dispatch('my_getUserInfo').then((res) => {
        this.userInfo = res.data.user
      })
    },
    upCallback(page) {
      //联网加载数据
      this.$store.dispatch('blind_getPointBlindList', {page: page.num}).then(res => {
        // res.length=3
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(res.data.list.length);
        //设置列表数据
        if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
        this.goods = this.goods.concat(res.data.list); //追加新数据
        this.empty = (this.goods.length == 0)
      }).catch(() => {
        //联网失败, 结束加载
        this.mescroll.endErr();
      })
    },
  }
}
</script>
<style>
page {
  background-color: #fafafa;
}
</style>
<style lang="scss" scoped>
.empty {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 185rpx;

  .t {
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 300;
    color: #B8B8BA;
    line-height: 1;
    display: block;
    margin-top: 25rpx;
    text-align: center;
  }
}

.goods-box {
  padding: 10rpx 16rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.alert {
  padding-left: 31rpx;
  line-height: 74rpx;
  height: 74rpx;
  background: #FFE9E9;
  font-size: 22rpx;
  font-family: PingFangSC;
  font-weight: 400;
  color: #EB555B;
}

.card {
  margin: 26rpx 16rpx 18rpx;
  height: 260rpx;
  background: #FFFFFF;
  border-radius: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-size: 24rpx;
    margin-top: 56rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #B8B8BA;
    line-height: 1;
  }

  .num {
    line-height: 1;
    font-size: 76rpx;
    margin-top: 31rpx;
    font-family: HelveticaNeue;
    font-weight: normal;
    color: #0C0C0C;
  }
}
</style>
