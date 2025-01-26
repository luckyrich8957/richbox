<template>
  <view>
    <view class="alert">
      请选择已经保存的收货地址或新增收货地址
    </view>
    <view v-if='false' class="empty">
      <u-icon name='https://manghe.jikechaowan.com/image/img_34.png' size="46"></u-icon>
      <text>请添加收货地址</text>
    </view>
    <view v-for='item in list' v-else class="card" @click="chooseAddress(item.id)">
      <view class="info">
        <view class="u-m-r-36">
          {{ item.real_name }}
        </view>
        <view class="u-m-r-45">
          {{ item.phone }}
        </view>
        <view v-if="item.is_default" class="btn">
          默认
        </view>
      </view>
      <view class="address u-line-2">
        {{ item.province }} {{ item.city }} {{ item.district }} {{ item.detail }}
      </view>
    </view>
    <view class="fixed safe-area-inset-bottom">
      <view class='btn' @click="$authRoute({url:'/pages/user/pushAddress',params:{isChoose:1}})">
        添加收货地址
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      pageParams: {
        ids: '',
        show: 0,
      },
    };
  },
  onShow() {
    this.getUserAddresList()
  },
  onLoad(p) {
    if (Array.isArray(p.ids)) {
      this.pageParams = p
    } else {
      //解码
      this.pageParams = {...p, ids: JSON.parse(decodeURIComponent(p.ids))}
    }
  },
  methods: {
    submit() {
      console.log();
    },
    getUserAddresList() {
      this.$store.dispatch('my_getUserAddress').then((res) => {
        this.list = res.data.list
      })
    },
    chooseAddress(id) {
      this.$store.dispatch('my_setDefaultUserAddress', {id: id}).then((res) => {
        this.$authRoute({
          url: '/pages/user/delivery',
          params: {
            ids: this.pageParams.ids,
            show: this.pageParams.show,
          }
        })
      })
    }
  },
}
</script>
<style>
page {
  background-color: #fafafa;
  padding-bottom: 120 rpx;
}
</style>
<style lang="scss" scoped>
.empty {
  margin-top: 26rpx;
  height: 256rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 76rpx;
  margin: 0 16rpx;

  text {
    margin-top: 26rpx;
    line-height: 1;
    font-size: 28rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
  }
}

.alert {
  height: 74rpx;
  background: #EEEEEE;
  padding-left: 31rpx;
  line-height: 74rpx;
  font-size: 22rpx;
  font-family: PingFangSC;
  font-weight: 300;
  color: #666666;
}

.card {
  height: 176rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 0 16rpx;
  margin-top: 26rpx;

  .info {
    padding: 0 32rpx;
    display: flex;
    padding-top: 41rpx;
    align-items: center;

    view {
      line-height: 1;
      font-size: 28rpx;
      font-family: PingFangSC;
      font-weight: 500;
      color: #333333;
    }

    .btn {
      width: 64rpx;
      height: 32rpx;
      background: #323232;
      border-radius: 4rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22rpx;
      line-height: 1;
      font-family: PingFangSC;
      font-weight: 400;
      color: #FFFFFF;
    }
  }

  .address {
    padding: 0 32rpx;
    margin-top: 28rpx;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 300;
    color: #333333;
    line-height: 30rpx;
  }
}

.fixed {
  background-color: #fafafa;
  position: fixed;
  z-index: 99;
  height: 110rpx;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .btn {
    width: 718rpx;
    height: 90rpx;
    background: #323232;
    border-radius: 16rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #FFFFFF;
  }
}
</style>
