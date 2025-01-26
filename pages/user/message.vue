<template>
  <mescroll-uni ref="mescrollRef" @init="mescrollInit" top="0" @down="downCallback" :up="upOption"
                @up="upCallback">
    <view>
      <view v-for="(item,index) in goods" :class="['card' ,false?'':'t1']">
        <view class="text">
          <view class="dian" v-if="false"></view>
          <text>{{ item.message }}</text>
        </view>
        <view class="btns">
          <view class="btn" @click="jump(item.blindGoodsInfo)">
            查看中奖箱子
          </view>
          <view class="btn" @click="$authRoute({url:'/pages/reward/reward'})">
            查看奖品
          </view>
        </view>
      </view>
    </view>
  </mescroll-uni>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import {
  apiGoods
} from "@/common/mock.js"

export default {
  mixins: [MescrollMixin], // 使用mixin
  data() {
    return {
      upOption: {
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          tip: '~ 暂无消息 ~', // 提示
        }
      },
      goods: []
    };
  },
  methods: {
    upCallback(page) {
      //联网加载数据
      this.$store.dispatch('blind_getCollectMessage', {page: page.num}).then(res => {
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        console.log("res.data.list.length", res.data.list.length)
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
    jump(item) {
      let url = '/pages/list/box' //普通盲盒
      if (item.blind_type == 1) {
        url = '/pages/good/wireless' //无限盲盒
      }
      if (item.blind_type == 2) { //扭蛋机
        url = '/pages/list/egg'     //扭蛋机
      }
      this.$authRoute({
        url: url,
        params:item
      });
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  padding-top: 26rpx;
  background-color: #fafafa;
}

.card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 40rpx 32rpx 20rpx;
  margin: 0 16rpx 26rpx;
  position: relative;

  .text {
    font-size: 28rpx;
    font-family: PingFangSC;
    font-weight: 300;
    color: #333333;
    line-height: 38rpx;
    padding-left: 20rpx;

    .dian {
      position: absolute;
      top: 50rpx;
      width: 16rpx;
      left: 28rpx;
      height: 16rpx;
      background: #EB555B;
      border-radius: 50%;
    }
  }

  .btns {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 30rpx;

    .btn {
      line-height: 1;
      background-color: #eee;
      border-radius: 12rpx;
      padding: 20rpx 23rpx;
      font-size: 24rpx;
      margin-left: 20rpx;
    }
  }
}

.t1 {
  padding-left: 0;

  .text {
    color: #B8B8BA;
  }

  .btns {
    .btn {
      background-color: #fff;
      border: 1rpx solid #eee;
    }
  }
}
</style>
