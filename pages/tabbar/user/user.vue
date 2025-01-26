<template>
  <view>
    <view class="card user-top">
      <view class="user-info">
        <block v-if='isLogin'>
          <u-image height="112rpx" shape='circle'
                   src="https://manghe.jikechaowan.com/image/touxiang.png"
                   width="112rpx" @click="$u.route('/pages/login/login')"></u-image>
          <text @click="$u.route('/pages/login/login')">点击头像登录</text>
        </block>
        <block v-else>
          <view class="login">
            <view class="left">
              <u-image
                  :src="pageInfo.avatar ? pageInfo.avatar : 'https://manghe.jikechaowan.com/image/touxiang.png'"
                  height="112" shape="circle" width="112"></u-image>
              <view class="text">
                <view class="name">
                  {{ pageInfo.nickname||'' }}
                </view>
                <view class="code" @click="copy">
                  {{ pageInfo.account_id||'' }}
                  <view class="btn">
                    复制
                  </view>
                </view>
              </view>
            </view>
            <u-image height="72" src='https://manghe.jikechaowan.com/image/setting-icon.png' width="72"
                     @click="$authRoute({url:'/pages/user/setting'})"></u-image>
          </view>
        </block>
      </view>
      <view class="num" >
        <view class="num-item" @click="$authRoute({url:'/pages/money/Kcode'})" v-if="pageInfo.showCoins">
          <text class="num-1">{{ pageInfo.coins || 0 }}</text>
          <text class="num-2">K币</text>
        </view>
        <view class="num-item" @click="$authRoute({url:'/pages/money/list'})">
          <text class="num-1">{{ (pageInfo.balance && Number(pageInfo.balance)) || 0 }}</text>
          <text class="num-2">晶石</text>
        </view>
        <view class="num-item" @click="$authRoute({url:'/pages/coupon/coupon'})">
          <text class="num-1">{{ pageInfo.coupon_num || 0 }}</text>
          <text class="num-2">优惠券</text>
        </view>
        <view class="num-item" @click="$authRoute({url:'/pages/reward/reward'})">
          <text class="num-1">{{ pageInfo.box_order_num || 0 }}</text>
          <text class="num-2">盒柜</text>
        </view>
      </view>
    </view>
    <view v-if='!isLogin&&pageInfo.message_info&&pageInfo.message_info.msg_count>0' class="message" @click="$u.route('/pages/user/message')">
      <u-image height="36rpx" src='https://manghe.jikechaowan.com/image/message-icon.png'
               style="flex-shrink: 0;" width="32rpx">
      </u-image>
      <view class="notice">
        <u-notice-bar :list="[pageInfo.message_info.message]" :speed='100' :volume-icon='false'
                      bg-color="#FFE9E9" color='#eb555b' font-size='24rpx' mode="horizontal"></u-notice-bar>
      </view>
      <view class="l">
        {{ pageInfo.message_info.msg_count>9?'9+':pageInfo.message_info.msg_count }}
      </view>
    </view>
    <view class="card user-icon" v-if='false'>
      <u-icon v-for="(item,index) in icon" :key='index' :label='item.text' :name='item.image' label-pos='bottom'
              label-size='24rpx' margin-top='24rpx' size='58rpx' @click="jump(item.link)"></u-icon>
    </view>
    <view class="card cell">
      <u-cell-group :border='false'>
        <block v-for="(item,index) in cell" :key='index'>
          <!-- #ifdef MP-WEIXIN -->
          <button v-if="item.text==='联系客服'"  class="u-reset-button" open-type='contact' @click="kf">
            <u-cell-item :title="item.text" :title-style='{fontSize:"28rpx",fontWeight:"500",marginLeft:"20rpx"}'>
              <u-icon slot='icon' :border-bottom='index!==cell.lenght' :name='item.image'
                       size='35rpx'
                      class='u-m-r-40'>
              </u-icon>
            </u-cell-item>
          </button>
          <!-- #endif -->
		  <!-- #ifndef MP-WEIXIN -->
		  <button v-if="false"  class="u-reset-button" open-type='contact' @click="kf">
		    <u-cell-item :title="item.text" :title-style='{fontSize:"28rpx",fontWeight:"500",marginLeft:"20rpx"}'>
		      <u-icon slot='icon' :border-bottom='index!==cell.lenght' :name='item.image'
		               size='35rpx'
		              class='u-m-r-20'>
		      </u-icon>
		    </u-cell-item>
		  </button>
		  <!-- #endif -->
          <u-cell-item :title-style='{fontSize:"28rpx",fontWeight:"500",marginLeft:"20rpx"}' v-else :title="item.text"  @click="jump(item.link,item)">
            <view slot='icon' class='u-m-r-20 u-flex'>
            	<u-icon   :border-bottom='index!==cell.lenght' :name='item.image'
            	        :title-style='{fontSize:"28rpx",fontWeight:"500"}' size='35rpx'
            	        style='margin-right: 20rpx;'>
            	</u-icon>
            </view>
			
          </u-cell-item>
        </block>
      </u-cell-group>
    </view>
  </view>
</template>

<script>
import uniCopy from '@/js_sdk/xb-copy/uni-copy.js'
import {
  mapState
} from "vuex"

export default {
  data() {
    return {
      list: [
      ],

      pageInfo: {
        message_info: {}
      },
      isLogin: true,
      icon: [
        {
          image: 'https://manghe.jikechaowan.com/image/icon1.png',
          text: '藏宝图',
          url: '',
          link: '/pages/activity/treasure'
        },
        {
          image: 'https://manghe.jikechaowan.com/image/icon2.png',
          text: '图鉴',
          url: '',
          link: '/pages/good/map'
        },
        {
          image: 'https://manghe.jikechaowan.com/image/icon3.png',
          text: '积分商城',
          link: '/pages/good/integral'
        },
        {
          image: 'https://manghe.jikechaowan.com/image/icon4.png',
          text: '邀请赚钱',
          link: '/pages/activity/share'
        }
      ],
      cell: [
		  {
		    image: 'https://manghe.jikechaowan.com/image/cell2.png',
		    text: '邀请好友',
		    link: '/pages/activity/share',
		  		auth:1,
		  },
		  {
        image: 'https://manghe.jikechaowan.com/image/cell2.png',
        text: '我的收藏',
        link: '/pages/user/collection',
		auth:1,
      },
        {
          image: 'https://manghe.jikechaowan.com/image/cell1.png',

          text: '收货地址',
          link: '/pages/user/address',
		  auth:1,
        },
        {
          image: 'https://manghe.jikechaowan.com/image/cell2.png',
          text: '用户协议',
          link: 'pages/user/agreement?id=1',
		  auth:0,
        },
        {
          image: 'https://manghe.jikechaowan.com/image/cell3.png',
          text: '问题投诉',
          link: '/pages/user/complaints',
		  auth:1,
        },
        // #ifndef MP-ALIPAY
        {
          image: 'https://manghe.jikechaowan.com/image/cell4.png',
          text: '联系客服',
          link: '/pages/user/service',
		  auth:0,
        }
        // #endif
      ]
    }

  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  methods: {
    kf() {
      // #ifdef MP-WEIXIN
      return
      // #endif
    },
    copy() {
      uniCopy({
        content: this.pageInfo.account_id,
        success: (res) => {
          uni.showToast({
            title: res,
            icon: 'none'
          })
        },
        error: (e) => {
          uni.showToast({
            title: e,
            icon: 'none',
            duration: 3000,
          })
        }
      })
    },
    jump(link,item) {
		// #ifdef MP
		if(item.text=='联系客服') return this.$u.toast('暂未开放')
		// #endif
      this.$authRoute({
        url: link
      },item.auth);
    }
  },
  onShow() {
    this.isLogin = !this.$isLogin()
    console.log(this.isLogin);
    if (this.isLogin) {
      return this.pageInfo = {}
    }
    this.$store.dispatch('user_getHomePageInfo').then((res) => {
      this.pageInfo = res.data.pageInfo
    }).catch(() =>
        this.isLogin = false
    )
  }

}
</script>

<style lang="scss" scoped>
page {
  background-color: #fafafa;
  padding-top: 20rpx;
}

.message {
  background-color: #FFE9E9;
  margin: 0 16rpx 26rpx 16rpx;
  border-radius: 16rpx;
  padding: 0 38rpx;
  height: 90rpx;
  display: flex;
  align-items: center;

  /deep/ .u-notice-bar-wrap {
    width: 570rpx;
  }

  .notice {
    flex: 1;
  }

  .l {
    flex-shrink: 0;
    background-color: #eb555b;
    width: 40rpx;
    height: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
	font-size: 24rpx;
    border-radius: 50%;
  }
}

.card {
  background-color: #fff;
  border-radius: 40rpx;
  padding: 25rpx;
  margin: 16rpx;
  margin-top: 0;
  margin-bottom: 32rpx;

}

.user-icon {
  border-radius: 12rpx;
  padding: 40rpx;
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
}

.cell {
  border-radius: 12rpx;
  padding: 0;
  padding-left: 25rpx;
}

.user-top {
  .user-info {
    display: flex;
    align-items: center;

    // justify-content: space-between;
    text {
      font-size: 32rpx;
      font-family: PingFangSC;
      font-weight: 500;
      padding-left: 23rpx;
      color: #B8B8BA;
    }

    .login {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;

        .text {
          display: flex;
          margin-left: 20rpx;
          flex-direction: column;
          justify-content: space-evenly;

          .code {
            display: flex;
            font-size: 24rpx;
            align-items: center;
            color: #B8B8BA;

            .btn {
              margin-left: 12rpx;
              font-size: 20rpx;
              border: 1rpx solid #eee;
              padding: 3rpx 6rpx;
            }
          }

          .name {
            font-size: 32rpx;
            font-weight: 500;
          }
        }
      }
    }
  }

  .num {
    margin-top: 50rpx;
    margin-bottom: 20rpx;
    padding: 0 50rpx;
    display: flex;
    justify-content: space-between;

    .num-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .num-1 {
        margin-bottom: 10rpx;
        font-size: 36rpx;
        font-family: HelveticaNeue;
        font-weight: 600;
        color: #0C0C0C;
      }

      .num-2 {
        font-size: 22rpx;
        font-family: PingFangSC;
        font-weight: 400;
        color: #333333;
      }

    }
  }
}
</style>
