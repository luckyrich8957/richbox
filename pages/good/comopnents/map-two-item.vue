<template>
  <view class="wrap" @click="itemClick">


    <view class="good">
      <view class="top u-border-bottom">
        <!-- <u-image border-radius="16" src='https://manghe.jikechaowan.com/image/img_2.png' width="320rpx" height="320rpx"></u-image> -->
		<u-image border-radius="16" :src='goods.img' width="320rpx" height="320rpx"></u-image>
        <view class="name">
          {{ goods.reward_name }}
        </view>
      </view>
      <view class="bottom">
        <view class="left">
          {{ goods.owner_num }} / {{ goods.reward_ids_arr.length }}
        </view>
        <u-icon name='arrow-right' label-pos="left" color="#B8B8BA" label-size="22" label-color="#B8B8BA" size="25rpx"
                label="对应图鉴"></u-icon>
      </view>
    </view>
    <view :class="{btn:true,go:canGo}" @click.stop="duiHuan">
      {{ num === 15 ? '兑换' : '兑换' }}
    </view>

  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    canGo() {
      return this.goods.owner_num >= this.goods.reward_ids_arr.length;
    }
  },
  props: ['num', 'goods'],
  inject: ['isShow', 'detail', 'goDuiHuan'],
  methods: { 
    itemClick() {
      this.detail(this.goods)
    },
    duiHuan() {
      if (!this.canGo) return this.$toast('您暂未收集齐该材料不能兑换哦!')
      this.goDuiHuan(this.goods.id)
    }

  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 350rpx;
}

.good {
  width: 350rpx;
  height: 520rpx;
  background: #333333;
  border-radius: 16rpx;
  overflow: hidden;

  .top {
    height: 449rpx;
    padding: 15rpx 15rpx 0;

    .name {
      padding: 0 10rpx;
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 300;
      color: #FFFFFF;
      line-height: 30rpx;
      margin-top: 25rpx;
    }
  }

  .bottom {
    padding: 0 26rpx;
    height: 70rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      font-size: 28rpx;
      font-family: HelveticaNeue;
      font-weight: normal;
      color: #FFFFFF;
      line-height: 38rpx;
    }
  }

  /deep/ .u-border-bottom {
    &::after {
      border-color: #464646 !important;
    }
  }
}

.btn {
  margin-top: 18rpx;
  margin-bottom: 40rpx;
  width: 350rpx;
  height: 64rpx;
  border: 2rpx solid #333333;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-family: PingFangSC;
  font-weight: 500;
  color: #B8B8BA;
}

.go {
  color: #fff;
  background-color: #EB555B;
  border: none;
}
</style>
