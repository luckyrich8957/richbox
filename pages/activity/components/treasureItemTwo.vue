<template>
  <view class="wrap" :style="{height:height,overflow:disableScroll?'hidden':'auto'}">
    <view class="goods-box">
      <view class="goods-item u-border-bottom" v-for="(item,index) in list" v-if="item.level > 1">
        <u-image :src='item.logo' width='120rpx' height="92rpx"></u-image>
        <view class="content">
          <view class="name">
            合成{{ item.level }}等藏宝图（{{ item.need_maps_num }} : 1）
          </view>
          <u-number-box v-model="item.hc_num" @change="valChange" :step="item.need_maps_num"></u-number-box>
          <view class="text">
            可合成
            <text style='color: red;'>{{ canNum(item) || 0 }}</text>
            张{{ item.level }}等藏宝图
          </view>
        </view>
        <view :class='{"btn":true,no:!canNum(item)}' @click="handerHc(item)">
          合成
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {

  props: {
    disableScroll: {
      type: Boolean,
      default() {
        return false;
      }
    },
	height: [Number, String],
  },

  data() {
    return {
      value: 0,
      list: []
    };
  },
  computed: {
    canNum() {
      return (item) => {
        return Math.floor(item.hc_num / item.need_maps_num)
      }
    }
  },
  watch: {},
  mounted() {
    this.$store.dispatch('treasure_getUpgradeInfo').then((res) => {
      this.userInfo = res.data.userInfo
      this.list = res.data.mapsList.map((item, index) => {
        item.map_num = res.data.userInfo['maps_num' + (index + 1)]
        item.hc_num = 0
        item.can_num = 0
        return item
      })
    })
  },
  methods: {
    valChange() {

    },
    handerHc(item) {
      if (!this.canNum(item)) return this.$toast('材料不足无法合成!')
	  uni.showLoading({
	  	title:'合成中'
	  })
      this.$store.dispatch('treasure_upgradeMap', {
        level: item.level - 1,
        to_level: item.level,
        num: item.hc_num,
      }).then((res) => {
        this.$t(res.msg, () => {
          this.$emit('updateMaps', res.data)
        },1000,false)
      }).catch((res) => {
        this.$toast(res.msg)
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.goods-box {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 26rpx 16rpx 0;

  ::v-deep .u-numberbox {
    .u-icon-minus {
      height: 64rpx !important;
      width: 62rpx !important;
    }

    .u-number-input {
      height: 64rpx !important;
      width: 92rpx !important;
    }

    .u-icon-plus {
      height: 64rpx !important;
      width: 62rpx !important;
    }
  }

  .goods-item {
    height: 272rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 56rpx 32rpx 59rpx;

    .content {
      align-self: unset;

      .name {
        font-size: 28rpx;
        font-family: PingFangSC;
        font-weight: 500;
        color: #333333;
        line-height: 38px;
        margin-bottom: 27rpx;
        line-height: 1;
      }

      .text {
        line-height: 1;
        font-size: 24rpx;
        font-family: PingFangSC;
        font-weight: 400;
        color: #B8B8BA;
        margin-top: 26rpx;
      }
    }

    .btn {
      width: 140rpx;
      height: 64rpx;
      background: #323232;
      border-radius: 12rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 500;
      color: #FFFFFF
    }

    .no {
      color: #B8B8BA;
      background: #EEEEEE;
    }
  }
}
</style>
