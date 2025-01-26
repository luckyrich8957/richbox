<template>
  <view class="pages">
    <view class="alert">
      <view class="left">
        抽中奖品即可收集到对应的图鉴，集齐图鉴可兑换奖品
      </view>
      <u-icon name='arrow-right' size='30rpx' color="#fff"></u-icon>
    </view>
    <view class="subsection">
      <u-subsection ref="sub" :list="list" active-color='#fff' inactive-color='#B8B8BA' :height='92'
                    @change="sectionChange"
                    :current="current"></u-subsection>
    </view>

    <map-one v-show='current===0'/>
    <map-two v-show='current===1' ref="mapTwo"/>
    <u-popup v-model='show' :mask-close-able='false' :mask-custom-style="{background: 'rgba(0, 0, 0, 0.8)'}"
             :isTransparent='true' mode='center' width="85%">
      <view class="popup">
        <view class="down" @click="show=false">
          <u-icon name='https://manghe.jikechaowan.com/image/img_28.png' size='60rpx'></u-icon>
        </view>
        <view class="title">
          {{ detail.reward_name }}
        </view>
        <view class="img">
          <u-image :src='detail.logo' border-radius="16rpx" width="488rpx" height="488rpx"></u-image>
        </view>
        <view class="num">
          {{ detail.owner_num }} / {{ detail.reward_ids_arr.length }}
        </view>
        <view class="tip">
          {{ canDui ? '您已收齐图鉴' : '未集齐该图鉴' }}
        </view>
        <view class="btn" @click="gotoDui">
          {{ canDui ? '兑换' : '去收集' }}
        </view>
      </view>
    </u-popup>
    <u-modal v-model="showConfirm" @confirm="sureDuiHuan" :show-cancel-button="true" :content="content"
             :title="title"></u-modal>
  </view>
</template>

<script>
import mapOne from './comopnents/map-one.vue'
import mapTwo from './comopnents/map-two.vue'

export default {
  components: {
    mapOne,
    mapTwo
  },
  computed: {
    canDui() {
      return this.detail.owner_num >= this.detail.reward_ids_arr.length
    }
  },
  provide() {
    return {
      isShow: (e) => {
        this.show = e
      },
      detail: (e) => {
        this.detail = e
        this.$nextTick(function () {
          this.show = true
        })
      },
      toDui: (e) => {
        this.$nextTick(function () {
          this.current = 1
        })
      },
      goDuiHuan: (id) => {
        this.showConfirm = true
        this.currentGoodsId = id
      },
    }
  },
  data() {
    return {
      title: '兑换奖品',
      showConfirm: false,
      content: '您确定要兑换该奖品吗？',
      detail: {
        reward_name: '',
        owner_num: 0,
        reward_ids_arr: [],
        logo: '',
      },
      show: false,
      list: [{
        name: '图鉴'
      },
        {
          name: '兑奖'
        }
      ],
      current: 0,
      currentGoodsId: {}
    }
  },
  methods: {
    gotoDui() {
      if (this.canDui) {
        this.show = false
        this.showConfirm = true
        this.currentGoodsId = this.detail.id
      } else {
        this.$authRoute({
          url: '/pages/tabbar/goods/goods'
        })
      }

    },
    sectionChange(index) {
      this.current = index;
    },

    sureDuiHuan(goods) {
      this.$store.dispatch('mapAuth_exchangeReward', {
        id: this.currentGoodsId
      }).then((res) => {
        this.$t(res.msg, () => {
          this.$refs['mapTwo'].upCallback({num: 1})
        })
      }).catch((res) => {
        this.$toast(res.msg)
      })
    }
  },
  onReady() {
    //248
    this.$u.getRect('.subsection').then(res => {
      console.log(res.bottom * 2);
    })
  }
}
</script>
<style>
</style>
<style scoped lang="scss">

.pages{
	 // background-color: #212024 !important;
	 /* #ifdef MP */
	  min-height: 100vh;
	  /* #endif */
}

.popup {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  .down {
    position: absolute;
    right: 0;
    width: 60rpx;
    top: 0;
  }

  .title {
    margin-top: 120rpx;
    width: 332rpx;
    font-size: 28rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 38rpx;
  }

  .img {
    border: 6rpx solid #fff;
    background-color: #fff;
    border-radius: 16rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30rpx;
  }

  .num {
    margin-top: 32rpx;
    font-size: 36rpx;
    font-family: HelveticaNeue;
    font-weight: normal;
    color: #FFFFFF;
    line-height: 1;
  }

  .tip {
    margin-top: 12rpx;
    font-size: 20rpx;
    font-family: PingFangSC;
    font-weight: 300;
    color: #EB555B;
    line-height: 1;
  }

  .btn {
    margin-top: 44rpx;
    width: 500rpx;
    height: 90rpx;
    background: #FFFFFF;
    border-radius: 16rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
  }
}

.alert {
  background-color: #101012;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  height: 74rpx;

  .left {
    font-size: 22rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #fff;
  }
}

.subsection {
  margin-top: 26rpx;
  padding: 0 16rpx 46rpx;
background-color: #212024;
  /deep/ .u-subsection {
    background-color: #323232 !important;

    .u-item-bg {
      background-color: #464646 !important;
    }
  }
}
</style>
