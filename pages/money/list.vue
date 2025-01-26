<template>
  <view>
    <view class="card">
      <view class="title">
        我的晶石
      </view>
      <view class="num">
        <u-image height='45rpx' src='@/static/material/crystal.png' width='35rpx'></u-image>
        <text class='money u-p-l-10'>{{ money(userInfo.balance) }}</text>
      </view>
      <view class="btns">
        <view class="btn " @click="exchangeShow=true">
          兑换K币
        </view>
      </view>
    </view>
    <view class="tabs">
      <u-tabs :active-item-style="{fontSize:'34rpx',fontweight:'600',color:'#333'}"
              :bar-style="{backgroundColor:'#eb555b',width:'30rpx' ,height:'8rpx',borderRadius:'4rpx'}"
              :current="tabIndex" :is-scroll="false"
              :list='tabs'
              bg-color="#fafafa" font-size='28'
              height="94" inactive-color='#333' @change="change"></u-tabs>
    </view>
    <list-item :height='height' :index='tabIndex' :tabs="pageConfig.recharge_info" :type='1'/>
    <!-- 晶石兑换K币弹窗 -->
    <u-popup v-model="exchangeShow" :closeable='true' border-radius='40' close-icon-color='#000' mode="bottom">
      <view class="ex-content">
        <view class="title">
          晶石兑换K币
        </view>
        <view class="rate">
          兑换汇率：10晶石 = 1K币
        </view>
        <view class="new u-flex u-col-center">
          现有晶石：
          <u-image height='35rpx' src='@/static/material/crystal.png' width='26rpx'></u-image>
          <text class='money u-p-l-10'>{{ money(userInfo.balance) }}</text>
        </view>
        <view class="num-box">
          <view v-for="(item,index) in exList" :key='index' :class="{'num-item':true,on:index===ex}"
                @click="ex=index;customNum='';">
            {{ '兑换' + money(item.amount) + '晶石' }}
          </view>
          <view :class="{'num-item':true,on:ex===-2}" @click="all">
            全部兑换
          </view>
          <view class="num-item u-p-20">
            <u-input v-model='customNum' :clearable='false' maxlength="6" placeholder="自定义金额" type='number'
                     @focus="ex=-1"/>
          </view>
        </view>
        <view v-if='error1' class="error-tip u-font-24 u-p-t-20 u-type-warning">
          * 您的晶石不够，请选择对应晶石数量或输入自定义数量
        </view>
        <view class="btn" @click="sureEx">
          确认兑换
        </view>
      </view>
    </u-popup>

    <u-popup v-model="txShow" :closeable='true' border-radius='40' close-icon-color='#000' mode="bottom">
      <view class="ex-content">
        <view class="title">
          晶石提现
        </view>
        <view class="tip">
          {{ pageConfig.withdraw_info }}
        </view>
        <view class="new u-m-t-45">
          可用晶石：¥{{ userInfo.balance }}
        </view>
        <view class="input-title">
          请输入支付宝账号
        </view>
        <view class="input-code">
          <u-input v-model='alicode' placeholder="请输入支付宝账号"/>
        </view>
        <view class="input-title">
          请输入支付宝姓名
        </view>
        <view class="input-code">
          <u-input v-model='name' placeholder="请输入支付宝绑定姓名"/>
        </view>
        <view class="num-title">
          请选择提现金额
        </view>
        <view class="num-box">
          <view v-for="(item,index) in txList" :key='index' :class="{'num-item':true,on:index===tx}"
                @click="tx=index;txcustomNum=0">
            {{ item ? '￥' + item.amount : '自定义金额' }}
          </view>
        </view>
        <view v-if='tx+1===txList.length' class="input">
          <u-input v-model='txcustomNum' :border="true" maxlength="4" placeholder="请输入兑换金额" type='number'/>
        </view>
        <view class="btn" @click="sureWithDraw">
          确认提现
        </view>
      </view>
    </u-popup>
    <u-modal v-model="showEx" :content="content" :showCancelButton="true" @confirm="confirmEx"></u-modal>
  </view>
</template>

<script>
import listItem from './components/listItem.vue'

export default {
  components: {
    listItem
  },
  onHide() {
    this.txShow = false
    this.exchangeShow = false
  },
  data() {
    return {
      // 提现弹窗
      isAll: false, // 是否全部提现
      content: '确定兑换成K币吗？',
      txShow: false,
      showEx: false,
      txList: [50, 100, 200, 500, 1000],
      tx: 0,
      txcustomNum: '',
      customNum: '',
      // 阿里账号
      alicode: "",
      // 姓名
      name: "",
      exchangeShow: false,
      exList: [50, 100, 200, 500, 1000],
      ex: 0,
      tabIndex: 0,
      height: 0,
      pageConfig: {},
      userInfo: {},
      tabs: [{name: '晶石'}, {name: '获得记录'}, {name: '消费明细'}],
    }
  },

  methods: {
    all() {
      if (this.userInfo.balance < 10) {
        return this.$toast('最低兑换数量为10晶石')
      }
      this.customNum = ''
      this.ex = -2
    },
    sureWithDraw() {
      let id = this.txList[this.tx].id
      if (!this.alicode || !this.name) return this.$toast('请完善提现信息')
      this.$store.dispatch('withdraw_createWithdraw', {
        alipay_account: this.alicode,
        fullname: this.name,
        id: this.txcustomNum ? 0 : id,
        amount: this.txcustomNum,
      }).then((res) => {
        this.$t(res.msg, () => {
          this.txShow = false
          this.userInfo.balance = res.data.balance
        })
      }).catch((res) => {
        this.$toast(res.msg)
      })
    },
    getPageInfo2() {  //K币兑换
      this.$store.dispatch('recharge_getCoinsExchangeConfig').then((res) => {
        this.exList = res.data.list
      })
    },
    confirmEx() {
      this.$store.dispatch('order_createTransferCoinsOrder', this.formData).then((res) => {
        this.$t(res.msg, () => {
          this.ex = 0
          this.customNum = ''
          this.showEx = false
          this.exchangeShow = false
          this.userInfo.balance = res.data.balance
        })
      }).catch((res) => {
        this.$toast(res.msg)
      })
    },
    sureEx() {
      let amount;
      let selectAmount;
      let id;
      if (this.ex == -1) {
        amount = this.customNum;
        if (amount && amount.length > 0) {
          id = 0;
        } else {
          return this.$toast('请输入兑换金额')
        }
      } else if (this.ex == -2) {
        amount = parseInt(this.userInfo.balance / 10) * 10;
        id = 0;
      } else {
        id = this.exList[this.ex].id
        selectAmount = this.exList[this.ex].amount
      }

      if (parseFloat(amount) > parseFloat(this.userInfo.balance) || parseFloat(selectAmount) > parseFloat(this.userInfo.balance)) return this.$t('账户晶石不足!')
      this.formData = {
        id: id,
        amount: amount,
        selectAmount: selectAmount,
      }
      this.showEx = true
    },
    change(index) {
      this.tabIndex = index;
    },
    getPageInfo() {
      this.$store.dispatch('getPageInfo').then((res) => {
        this.pageConfig = res.data.info
        this.userInfo = res.data.user_info
      })
    },
    getWithdrawInfo() {
      this.$store.dispatch('withdraw_withdrawConfig', {}).then((res) => {
        this.txList = res.data.list
        this.txList.push(false)
      })
    }
  },
  onReady() {
    this.$nextTick(function () {

      // #ifndef MP-ALIPAY
      this.$u.getRect('.tabs').then(res => {
        this.height = res.bottom + 15 + 'px'
      })
      // #endif
      // #ifdef MP-ALIPAY
      my.createSelectorQuery().select('.tabs').boundingClientRect().exec(res => {
        this.height = res[0].bottom + 15 + 'px'
        console.log(this.height);
      })
      // #endif
    })
    this.getPageInfo2();
    this.getPageInfo()
    this.getWithdrawInfo()
  },
  computed: {
    error1() {
      if (this.ex == -1 || this.ex == -2) return false
      let id = this.exList[this.ex].id
      let selectAmount = this.exList[this.ex].amount
      return parseFloat(selectAmount) > parseFloat(this.userInfo.balance)
    }
  }
}
</script>

<style>
page {
  background-color: #fafafa;
  padding-top: 26 rpx;
}
</style>
<style lang="scss" scoped>
.tabs {
  padding: 26rpx 50rpx 0;
}

.card {
  margin: 0 16rpx;
  background: #FFFFFF;
  border-radius: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    margin-top: 56rpx;
    line-height: 1;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #B8B8BA;
  }

  .num {
    margin-top: 30rpx;
    display: flex;
    align-items: flex-end;
    font-size: 28rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #0C0C0C;
    line-height: 1;

    .money {
      font-size: 76rpx;
      font-family: HelveticaNeue;
      font-weight: normal;
      color: #0C0C0C;
      line-height: 1;
    }
  }

  .btns {
    width: 100%;
    display: flex;
    padding: 57rpx 40rpx 36rpx;
    justify-content: space-between;

    .btn {
      width: 100%;
      // width: 308rpx;
      height: 100rpx;
      background: #0C0C0C;
      border-radius: 20rpx;
      font-size: 30rpx;
      font-family: PingFangSC;
      font-weight: 500;
      color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .t1 {
      background-color: #000000;
    }
  }
}

.ex-content {
  padding: 80rpx 56rpx 32rpx;

  .tip {
    font-size: 24rpx;
    margin-top: 50rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #B8B8BA;
    line-height: 36rpx;
  }

  .input-title {
    line-height: 1;
    margin: 35rpx 0 15rpx;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 300;
    color: #333333;
  }

  .num-title {
    line-height: 1;
    margin-top: 65rpx;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #B8B8BA;
  }

  .title {
    font-size: 36rpx;
    text-align: center;
    line-height: 1;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
  }

  .input-code {
    background-color: #f4f4f4;
    display: flex;
    align-items: center;
    padding: 0 45rpx;
    height: 80rpx;
    border-radius: 12rpx;
  }

  .rate {
    line-height: 1;
    margin-top: 56rpx;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #333333;
  }

  .new {
    line-height: 1;
    margin-top: 24rpx;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #EB555B;
  }

  .num-box {
    padding-top: 12rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .num-item {
      width: 200rpx;
      height: 80rpx;
      border: 1rpx solid #eee;
      border-radius: 12rpx;
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 19rpx;
    }

    .on {
      color: #fff;
      background-color: #000000;
      border: none;
    }
  }

  .btn {
    width: 638rpx;
    height: 90rpx;
    background: #448EF6;
    border-radius: 16rpx;
    font-size: 30rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 80rpx;
  }

  .input {
    margin-top: 20rpx;
  }
}
</style>