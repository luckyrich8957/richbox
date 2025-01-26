<template>
  <!--
  swiper中的transfrom会使fixed失效,此时用height固定高度;
  swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
  -->
  <!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
  <!-- top的高度等于悬浮菜单tabs的高度 -->
  <mescroll-uni :ref="'mescrollRef'+i" @init="mescrollInit" :height="height" :disable-scroll="disableScroll"
                :down="downOption" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
    <!-- 数据列表 -->
    <view class="goods-box">
      <view class="icon">
        <u-icon name='https://manghe.jikechaowan.com/image/img_2.png' size="26rpx" label="筛选" label-size="29rpx" color="#333" label-pos="right"
                margin-left='10rpx'></u-icon>

      </view>
      <view class="goods-item" v-for="(item,index) in goods" :key='index'>
        <view class="img u-flex u-row-center u-col-center" style="width: 180rpx; height: 180rpx;">
          <u-image :src='item.img' mode='widthFix' width="180rpx"></u-image>
        </view>
        <view class="good-right">
          <view class="name u-line-2">
            {{ item.reward_name }}
          </view>
          <view class="u-flex u-row-between">
            <view class='text'>
              <view class="num">
                <view class="num-btn">
                  ￥{{ item.price }}
                </view>
                <view class="text1">
                  需要{{ item.num }}张{{ item.map_level }}藏宝图
                </view>
              </view>
            </view>
            <view :class='{"btn":true,"no":canDui(item)}' @click="duiHuan(item)">
              兑换
            </view>
          </view>
        </view>
      </view>

    </view>
  </mescroll-uni>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import MescrollMoreItemMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";
import {apiGoods} from "@/common/mock.js"

export default {
  mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
  data() {
    return {
      downOption: {
        use: false // 禁用
      },
      upOption: {
        auto: true, // 不自动加载
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          tip: '~ 空空如也 ~', // 提示
        }
      },
      goods: [] //列表数据
    }
  },
  computed: {
    canDui() {
      return (item) => {
        return this.userInfo["maps_num" + item.map_level] < item.num
      }
    }
  },
  props: {
    i: Number, // 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
    index: { // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
      type: Number,
      default() {
        return 0
      }
    },
    tabs: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
      type: Array,
      default() {
        return []
      }
    },
    height: [Number, String], // mescroll的高度
    userInfo: [Object],
    disableScroll: Boolean // 是否禁止滚动, 默认false
  },
  methods: {
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      //联网加载数据
      this.$store.dispatch('treasure_getRewardList', {page: page.num}).then(res => {

        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(res.data.list);
        //设置列表数据
        if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
        this.goods = this.goods.concat(res.data.list); //追加新数据
      }).catch(() => {
        //联网失败, 结束加载
        this.mescroll.endErr();
      })
    },
    duiHuan(item) {
      if (this.canDui(item)) return this.$toast('材料不足无法兑换哦!')
      this.$store.dispatch('treasure_exchangeReward', {
        id: item.id
      }).then((res) => {
        this.$t(res.msg, () => {
          this.$emit('updateMaps', res.data)
        })
      }).catch((res) => {
        return this.$toast(res.msg)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-box {
  .icon {
    // margin-top: 26rpx;
    margin-bottom: 35rpx;
    padding-right: 16rpx;
    display: flex;
    flex-direction: row-reverse;
  }
}

.goods-item {
  height: 258rpx;
  margin: 16rpx 26rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 34rpx 32rpx 44rpx;
  display: flex;

  .good-right {
    flex: 1;

    .btn {
      width: 140rpx;
      height: 64rpx;
      background: #EB555B;
      border-radius: 12rpx;
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 500;
      color: #FEFEFE;
      line-height: 38rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: flex-end;
      position: relative;
      top: 20rpx;
    }

    .no {
      color: #B8B8BA;
      background: #EEEEEE;
    }

    margin-left: 35rpx;

    .name {
      font-size: 28rpx;
      padding-right: 20rpx;
      font-family: PingFangSC;
      font-weight: 300;
      color: #333333;
      line-height: 38rpx;
      height: 70rpx;
    }

    .text {
      .num-btn {
        display: inline-block;
        margin-top: 18rpx;
        font-size: 22rpx;
        font-family: PingFangSC;
        font-weight: 400;
        text-decoration: line-through;
        background: #323232;
        border-radius: 4rpx;
        color: #fff;
        padding: 7rpx 10rpx;
        line-height: 1;
      }

      .text1 {
        font-size: 26rpx;
        line-height: 1;
        margin-top: 18rpx;
        font-family: PingFangSC;
        font-weight: 500;
        color: #EB555B;
      }

    }
  }
}
</style>
