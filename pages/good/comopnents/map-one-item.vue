<template>
  <view class="wrap">
    <view class="wrap-item" @click="goClick">
      <u-image :src='goods.logo' border-radius="16" width="320rpx" height="320rpx"></u-image>
      <view class="bottom">
        <view class="percentage">
          {{ goods.owner_num }} / {{ goods.reward_ids_arr.length }}
        </view>
        <view class="link">
          <view class="current" :style="{width}">
          </view>
        </view>
        <view class="name">
          {{ goods.map_name }}
        </view>
      </view>
    </view>
    <view :class="{btn:true,go:canDui}" @click="goClick">
      {{ canDui ? '去兑换' : '去收集' }}
    </view>

  </view>

</template>

<script>
export default {
  data() {
    return {};
  },
  props: ['num', 'goods'],
  inject: ['toDui'],
  computed: {
    width() {
      return this.num / 15 * 300 + 'rpx'
    },
    canDui() {
      return this.goods.owner_num >= this.goods.reward_ids_arr.length
    }
  },
  methods: {
    goClick() {
      if (this.canDui) {
        this.toDui(this.goods)
      } else {
        this.$authRoute({
          url: '/pages/good/debris',
          params: {
            id: this.goods.id
          }
        })
      }

    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 350rpx;
}

.btn {
  margin: 36rpx auto 80rpx;
  width: 140rpx;
  height: 64rpx;
  border: 1px solid #FFFFFF;
  border-radius: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  font-family: PingFangSC;
  font-weight: 500;
  color: #FFFFFF;
}

.go {
  border: none;
  background-color: #eb555b;
}

.wrap-item {
  position: relative;
  height: 435rpx;
  width: 350rpx;
  background-image: url('https://manghe.jikechaowan.com/image/img_25.png');
  background-repeat: no-repeat;
  background-size: contain;
  // background-color: red;
  display: flex;
  justify-content: center;
  padding-top: 10rpx;

  .bottom {
    position: absolute;
    width: 350rpx;
    height: 220rpx;
    background-image: url('https://manghe.jikechaowan.com/image/img_26.png');
    background-size: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    padding: 0 28rpx;

    .percentage {
      margin-top: 60rpx;
      line-height: 1;
      font-size: 28rpx;
      font-family: HelveticaNeue;
      font-weight: normal;
      color: #FFFFFF;
    }

    .link {
      margin-top: 16rpx;
      width: 300rpx;
      height: 4rpx;
      background: #0C0C0C;
      border-radius: 2rpx;
      overflow: hidden;

      .current {
        height: 100%;
        background-color: #F0926A;
        border-radius: 2rpx;
      }
    }

    .name {
      margin-top: 30rpx;
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 300;
      color: #FFFFFF;
      line-height: 30rpx;
    }
  }
}
</style>
