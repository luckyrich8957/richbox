<template>
  <view>
    <view class="card" v-for="(item,index) in list" :key='index'>
      <view class="card-top u-border-bottom">
        <view class="info">
          <view>
            {{ item.real_name }}
          </view>
          <view>
            {{ item.phone }}
          </view>
        </view>
        <view class="address u-line-2">
          {{ item.province }} {{ item.city }} {{ item.district }}{{ item.detail }}
        </view>
      </view>
      <view class="card-bottom">
        <view class="checkbox">
          <u-checkbox :size='32' active-color='#333' :value='item.is_default === 1' @input='current=index'>
          </u-checkbox>
          <text @click="current=item.id" style='color: #333;font-size: 24rpx;line-height: 30rpx;'>默认地址</text>
        </view>
        <view class="btn">
          <view class="btn-item u-type-error" style="margin-left: 80rpx;" @click="currentId = item.id;delShow = true">
            删除
          </view>
          <view class="btn-item" @click="$authRoute({url:'/pages/user/pushAddress',params:{id:item.id}})">
            编辑
          </view>
        </view>
      </view>

    </view>
    <view class="empty" v-if="!list.length">
      <u-image src='https://manghe.jikechaowan.com/image/img_29.png' width="140rpx" height="129rpx"></u-image>
      <text>暂无收货地址</text>
    </view>
    <view class="fixed safe-area-inset-bottom" @click="$authRoute({url:'/pages/user/pushAddress'})">
      <view class="btn">
        添加收货地址
      </view>
    </view>
    <u-modal v-model="delShow" :content="content" :show-cancel-button="true" @confirm="sureDel"></u-modal>
  </view>
</template>

<script>
import list from "../money/list";
import share from '@/components/share.vue'

export default {
  data() {
    return {
      shareModel: false,
      currentId: 0,
      current: 0,
      list: [],
      delShow: false,
      content: '确定要删除该收货地址吗？',
    }
  },
  components: {
    share
  },
  onShow() {
    this.getUserAddresList()
  },
  methods: {
    getUserAddresList() {
      this.$store.dispatch('my_getUserAddress').then((res) => {
        this.list = res.data.list
      })
    },
    sureDel() {
      if (this.currentId) {
        this.$store.dispatch('my_delUserAddress', {id: this.currentId}).then((res) => {
          this.$t(res.msg, () => {
            this.list = this.list.filter((item) => {
              return item.id !== this.currentId
            })
          })
        }).catch((res) => {
          this.$toast(res.msg)
        })
      }
    },
  }
}
</script>
<style>
page {
	box-sizing: border-box;
  background-color: #fafafa;
  padding: 26rpx 16rpx 150rpx;
}
</style>
<style lang="scss" scoped>
.empty {
  // line-height: ;
  position: fixed;
  top: 40vh;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;

  text {
    margin-top: 25rpx;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 300;
    color: #B8B8BA;
    line-height: 1;
  }
}

.fixed {
  position: fixed;
  z-index: 99;
  background-color: #fafafa;
  height: 110rpx;
  left: 0;
  right: 0;
  bottom: 20rpx;
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

.card {
  height: 256rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 26rpx;

  .card-top {
    height: 176rpx;
    padding: 0 30rpx;

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 1;
      padding-top: 44rpx;

      view {
        font-size: 28rpx;
        font-family: PingFangSC;
        font-weight: 500;
        color: #333333;
      }
    }

    .address {
      margin-top: 28rpx;
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 300;
      color: #333333;
      line-height: 30rpx;
    }
  }

  .card-bottom {
    height: 79rpx;
    padding: 0 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;

      .btn-item {
        font-size: 24rpx;
        font-family: PingFangSC;
        font-weight: 400;
      }

      /deep/ .u-checkbox__label {
        margin-right: 0;
      }
    }
  }
}
</style>
